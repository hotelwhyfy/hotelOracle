import './style.css';
import { observe, type Location } from './astro';
import { bucketOf, divine } from './oracle/assemble';
import { renderReading, renderSky } from './ui/render';

const PLACE = 'oracle.place';
const DECLINED = 'oracle.declined';

/**
 * Coordinates are deliberately coarsened before they are stored. The ascendant
 * shifts about a degree per degree of longitude, so two decimal places is far
 * more precision than the sky needs and far less than a home address.
 */
const coarsen = (n: number) => Math.round(n * 100) / 100;

const read = (key: string) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { /* private browsing; the reading works without it */ }
};

function remembered(): Location | undefined {
  const raw = read(PLACE);
  if (!raw) return undefined;
  try { return JSON.parse(raw) as Location; } catch { return undefined; }
}

type Status = 'unlocated' | 'located' | 'denied' | 'seeking';

let place = remembered();
let status: Status = place ? 'located' : 'unlocated';
/** Set when the reader presses "forget". Without it, the automatic request on
 *  the next visit would silently overturn their choice. */
let declined = read(DECLINED) === 'true';

const app = document.querySelector<HTMLDivElement>('#app')!;

const masthead = (at: Date) => {
  const header = document.createElement('header');
  header.className = 'masthead';
  header.innerHTML = `
    <h1>The Oracle</h1>
    <p class="masthead__time">${at.toLocaleString(undefined, {
      dateStyle: 'long', timeStyle: 'short',
    })}</p>`;
  return header;
};

const NOTES: Record<Status, string> = {
  located: 'The horizon and the houses are being read from where you stand.',
  unlocated: 'Reading the sky alone. Grant your position and the horizon opens too.',
  denied: 'Position withheld. The sky still speaks, only with fewer voices.',
  seeking: 'Finding the horizon…',
};

/** Shown only while a first-time permission prompt is actually on screen. */
function drawCasting() {
  const casting = document.createElement('p');
  casting.className = 'casting';
  casting.textContent = 'Finding the horizon…';
  app.replaceChildren(masthead(new Date()), casting);
}

function draw() {
  const sky = observe(new Date(), place);
  const reading = divine(sky);

  const footer = document.createElement('footer');
  footer.className = 'footer';

  const attune = document.createElement('button');
  attune.className = 'attune';
  attune.textContent = place ? 'forget where I stand' : 'attune to where I stand';
  attune.addEventListener('click', place ? forget : attuneNow);

  const note = document.createElement('p');
  note.className = 'footer__note';
  note.textContent = NOTES[status];

  const detail = document.createElement('details');
  detail.className = 'behind';
  const summary = document.createElement('summary');
  summary.textContent = 'the sky behind this';
  detail.append(summary, renderSky(sky));

  footer.append(attune, note, detail);
  app.replaceChildren(masthead(sky.at), renderReading(reading), footer);
}

function position(): Promise<Location | undefined> {
  if (!navigator.geolocation) return Promise.resolve(undefined);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        latitude: coarsen(coords.latitude),
        longitude: coarsen(coords.longitude),
      }),
      () => resolve(undefined),
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 3_600_000 },
    );
  });
}

/**
 * The Geolocation spec excludes time spent awaiting permission from the
 * `timeout` option, so a reader who simply ignores the browser dialog never
 * triggers the error callback. We keep our own clock so the page cannot hang.
 */
function withDeadline<T>(promise: Promise<T>, ms: number): Promise<T | 'timeout'> {
  return Promise.race([
    promise,
    new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), ms)),
  ]);
}

/** 'granted' | 'prompt' | 'denied', or undefined where the API is unavailable. */
async function permission(): Promise<string | undefined> {
  try {
    return (await navigator.permissions?.query({ name: 'geolocation' }))?.state;
  } catch {
    return undefined;
  }
}

const same = (a?: Location, b?: Location) =>
  a?.latitude === b?.latitude && a?.longitude === b?.longitude;

function settle(found: Location | undefined, redrawIfUnchanged: boolean) {
  if (found) {
    const moved = !same(found, place);
    place = found;
    status = 'located';
    write(PLACE, JSON.stringify(found));
    if (moved || redrawIfUnchanged) draw();
    return;
  }
  status = place ? 'located' : 'denied';
  if (redrawIfUnchanged) draw();
}

/** Pressed explicitly, so it also clears a previous opt-out. */
async function attuneNow() {
  declined = false;
  write(DECLINED, null);
  status = 'seeking';
  draw();
  settle(await position(), true);
}

function forget() {
  place = undefined;
  status = 'unlocated';
  declined = true;
  write(PLACE, null);
  write(DECLINED, 'true');
  draw();
}

/**
 * Ask for position on arrival, without making the reader wait when we don't
 * have to. If permission is already granted, or we remember a position, the
 * reading paints at once and quietly corrects itself if the position moved.
 * Only a first-time prompt — where the browser dialog is genuinely on screen —
 * holds the first paint.
 */
async function boot() {
  if (declined || !navigator.geolocation) {
    status = place ? 'located' : 'unlocated';
    draw();
    return;
  }

  const state = await permission();

  if (state === 'denied') {
    status = place ? 'located' : 'denied';
    draw();
    return;
  }

  // nothing to show yet and a dialog about to appear: wait for the answer
  if (!place && state !== 'granted') {
    drawCasting();
    const pending = position();
    const answer = await withDeadline(pending, 10_000);

    if (answer === 'timeout') {
      // the dialog is still sitting there unanswered; give them a reading
      // rather than a waiting room, and fold the position in if it ever comes
      status = 'unlocated';
      draw();
      pending.then((found) => settle(found, false));
      return;
    }
    settle(answer, true);
    return;
  }

  // we can already say something, so say it and refine in the background
  draw();
  settle(await position(), false);
}

/** The reading is fixed to the hour it was cast in, so renew it when the hour turns. */
function renewOnTheHour() {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 2, 0);
  setTimeout(() => {
    if (bucketOf(new Date()) !== bucketOf(now)) draw();
    renewOnTheHour();
  }, nextHour.getTime() - now.getTime());
}

boot();
renewOnTheHour();
