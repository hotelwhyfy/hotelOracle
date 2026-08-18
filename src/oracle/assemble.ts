import type { Sky } from '../astro';
import * as V from './corpus/vocabulary';
import { templates, type Role, type Template } from './corpus/templates';
import { fingerprint, signalsFrom, type Signal } from './signals';
import { hash, pick, pickWeighted, seeded, type Rand } from './rng';

export interface Section {
  role: Role;
  text: string;
  signal?: string;   // the signal id this line was drawn from
}

export interface Reading {
  sections: Section[];
  text: string;
  seed: number;
  at: Date;
  located: boolean;
  signals: Signal[];  // ranked, for the "sky behind this" panel
}

const TABLES: Record<string, Record<string, string[]>> = {
  domain: V.domain, quality: V.quality, relation: V.relation, motion: V.motion,
  field: V.field, drift: V.drift, temper: V.temper, cadence: V.cadence, bank: V.bank,
};

const SLOT = /\{(\w+):(\w+)\}/g;

/** Fields of a signal a template may bind to. */
function bindings(signal?: Signal): Record<string, string | undefined> {
  if (!signal) return {};
  return {
    planet: signal.planet, other: signal.other, sign: signal.sign,
    aspect: signal.aspect, phase: signal.phase, element: signal.element,
    modality: signal.modality,
    house: signal.house === undefined ? undefined : String(signal.house),
  };
}

/** Can this frame be spoken for this signal? */
function fits(template: Template, signal?: Signal): boolean {
  if (!template.kinds.length) return true;            // needs no signal at all
  if (!signal) return false;
  if (!template.kinds.includes(signal.kind)) return false;
  if (template.tone && template.tone !== signal.tone) return false;

  // every slot the frame opens must actually be fillable
  const bound = bindings(signal);
  for (const [, table, key] of template.text.matchAll(SLOT)) {
    if (table === 'bank') continue;
    const resolved = bound[key] ?? key;
    if (table === 'raw') {
      if (bound[key] === undefined) return false;
      continue;
    }
    if (!TABLES[table]?.[resolved]?.length) return false;
  }
  return true;
}

function render(template: Template, signal: Signal | undefined, rand: Rand, used: Set<string>) {
  const bound = bindings(signal);

  const text = template.text.replace(SLOT, (_, table: string, key: string) => {
    if (table === 'raw') return bound[key] ?? key;

    const resolved = table === 'bank' ? key : bound[key] ?? key;
    const options = TABLES[table]?.[resolved];
    if (!options?.length) return '';

    // do not say the same phrase twice in one reading unless there is no choice
    const fresh = options.filter((o) => !used.has(o));
    const chosen = pick(rand, fresh.length ? fresh : options);
    used.add(chosen);
    return chosen;
  });

  return sentenceCase(text);
}

/** Capitalise the opening letter and any letter that starts a new sentence.
 *  Some banks hold whole sentences, so a slot can land mid-line after a full
 *  stop and would otherwise read lowercase. */
function sentenceCase(text: string): string {
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (_, lead, letter) => lead + letter.toUpperCase());
}

/** Which signals could carry any frame in this role, given what is already spent. */
function candidates(role: Role, signals: Signal[], spent: Set<string>) {
  const frames = templates.filter((t) => t.role === role);
  const free = signals.filter((s) => !spent.has(s.id));
  const usable = free.filter((s) => frames.some((t) => fits(t, s)));
  const signalless = frames.some((t) => !t.kinds.length);
  return { frames, usable, signalless };
}

function speak(
  role: Role, signals: Signal[], spent: Set<string>, rand: Rand, used: Set<string>,
): Section | undefined {
  const { frames, usable, signalless } = candidates(role, signals, spent);

  const signal = pickWeighted(rand, usable, (s) => s.weight);
  // a role whose frames all need a signal simply falls silent when none is left
  if (!signal && !signalless) return undefined;

  const fitting = frames.filter((t) => fits(t, signal));
  if (!fitting.length) return undefined;

  const template = pick(rand, fitting);
  // only frames that actually used the signal should consume it
  if (signal && template.kinds.length) spent.add(signal.id);

  return { role, text: render(template, signal, rand, used), signal: signal?.id };
}

/** The sky changes continuously; a reading must not. Bucketing to the hour gives
 *  a stable answer that still renews as the moon and the horizon move. */
export function bucketOf(at: Date, granularity: 'hour' | 'day' = 'hour'): string {
  const iso = at.toISOString();
  return granularity === 'day' ? iso.slice(0, 10) : iso.slice(0, 13);
}

/**
 * How many distinct readings this corpus can produce for one given sky, broken
 * down by role. Useful while writing: a role with a low count is where the
 * oracle will start repeating itself.
 */
export function capacity(sky: Sky): Record<string, number> {
  const signals = signalsFrom(sky);
  const roles: Role[] = ['invocation', 'omen', 'ground', 'tension', 'current', 'counsel', 'charge'];
  const out: Record<string, number> = {};

  for (const role of roles) {
    let total = 0;
    for (const template of templates.filter((t) => t.role === role)) {
      const forSignals = template.kinds.length ? signals.filter((s) => fits(template, s)) : [undefined];
      for (const signal of forSignals) {
        if (!fits(template, signal)) continue;
        const bound = bindings(signal);
        let ways = 1;
        for (const [, table, key] of template.text.matchAll(SLOT)) {
          if (table === 'raw') continue;
          const resolved = table === 'bank' ? key : bound[key] ?? key;
          ways *= TABLES[table]?.[resolved]?.length ?? 1;
        }
        total += ways;
      }
    }
    out[role] = total;
  }
  out.total = Object.values(out).filter((n) => n > 0).reduce((a, b) => a * b, 1);
  return out;
}

export function divine(sky: Sky, granularity: 'hour' | 'day' = 'hour'): Reading {
  const signals = signalsFrom(sky);
  const seed = hash(`${bucketOf(sky.at, granularity)}::${fingerprint(signals)}`);
  const rand = seeded(seed);

  const plan: Role[] = sky.ground
    ? ['invocation', 'omen', 'ground', 'tension', 'current', 'counsel', 'charge']
    : ['invocation', 'omen', 'tension', 'current', 'counsel', 'charge'];

  const spent = new Set<string>();
  const used = new Set<string>();
  const sections = plan
    .map((role) => speak(role, signals, spent, rand, used))
    .filter((s): s is Section => s !== undefined);

  return {
    sections,
    text: sections.map((s) => s.text).join('\n\n'),
    seed,
    at: sky.at,
    located: Boolean(sky.ground),
    signals,
  };
}
