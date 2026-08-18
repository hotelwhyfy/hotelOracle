import {
  SPEED, elementOf, modalityOf,
  type AspectName, type Element, type Modality,
  type PhaseName, type Planet, type Sign, type Sky,
} from '../astro';

export type SignalKind =
  | 'phase' | 'placement' | 'retrograde' | 'aspect'
  | 'ascendant' | 'house' | 'element' | 'modality';

export type Tone = 'hard' | 'soft' | 'neutral';

export interface Signal {
  id: string;          // stable token; part of the seed, so it must not wobble
  kind: SignalKind;
  weight: number;      // 0-1 salience
  tone: Tone;
  planet?: Planet;
  other?: Planet;
  sign?: Sign;
  aspect?: AspectName;
  house?: number;
  phase?: PhaseName;
  element?: Element;
  modality?: Modality;
}

/**
 * How loudly a body is allowed to speak. The generational planets sit in the
 * same sign for the better part of a decade and aspect each other for years at
 * a stretch — left unweighted they drown out everything that actually changes,
 * and every reading comes out identical for months.
 */
const VOICE: Record<string, number> = {
  luminary: 1, personal: 0.8, social: 0.55, generational: 0.25,
};

const voice = (p: Planet) => VOICE[SPEED[p]];

const TONE_OF: Record<AspectName, Tone> = {
  conjunction: 'neutral', sextile: 'soft', square: 'hard',
  trine: 'soft', opposition: 'hard',
};

const ANGULAR = new Set([1, 4, 7, 10]);

export function signalsFrom(sky: Sky): Signal[] {
  const out: Signal[] = [];

  // --- lunar phase: the metronome of the whole reading -------------------
  const climactic = sky.moon.phase === 'new' || sky.moon.phase === 'full';
  out.push({
    id: `phase:${sky.moon.phase}`,
    kind: 'phase',
    weight: climactic ? 1 : 0.85,
    tone: sky.moon.waxing ? 'soft' : 'neutral',
    phase: sky.moon.phase,
  });

  // --- placements --------------------------------------------------------
  for (const p of sky.placements) {
    out.push({
      id: `placement:${p.planet}:${p.sign}`,
      kind: 'placement',
      weight: voice(p.planet),
      tone: 'neutral',
      planet: p.planet,
      sign: p.sign,
    });

    if (p.retrograde) {
      out.push({
        id: `retrograde:${p.planet}`,
        kind: 'retrograde',
        // Mercury retrograde is the one everybody already feels, so it earns
        // more room than its speed class alone would give it
        weight: p.planet === 'Mercury' ? 0.9 : voice(p.planet) * 0.7,
        tone: 'hard',
        planet: p.planet,
        sign: p.sign,
      });
    }

    if (p.house !== undefined) {
      out.push({
        id: `house:${p.planet}:${p.house}`,
        kind: 'house',
        weight: voice(p.planet) * (ANGULAR.has(p.house) ? 0.8 : 0.5),
        tone: 'neutral',
        planet: p.planet,
        sign: p.sign,
        house: p.house,
      });
    }
  }

  // --- aspects -----------------------------------------------------------
  for (const a of sky.aspects) {
    const pace = Math.min(voice(a.a), voice(a.b));
    out.push({
      id: `aspect:${a.aspect}:${a.a}:${a.b}`,
      kind: 'aspect',
      // an applying aspect is arriving rather than leaving — it reads as news
      weight: a.exactness * pace * (a.applying ? 1.1 : 0.9),
      tone: TONE_OF[a.aspect],
      planet: a.a,
      other: a.b,
      aspect: a.aspect,
    });
  }

  // --- the horizon, when we know where the reader stands ------------------
  if (sky.ground) {
    out.push({
      id: `ascendant:${sky.ground.ascendantSign}`,
      kind: 'ascendant',
      weight: 0.75,
      tone: 'neutral',
      sign: sky.ground.ascendantSign,
    });
  }

  // --- the chart's centre of gravity --------------------------------------
  const elements = new Map<Element, number>();
  const modalities = new Map<Modality, number>();
  for (const p of sky.placements) {
    const w = voice(p.planet);
    const e = elementOf(p.sign);
    const m = modalityOf(p.sign);
    elements.set(e, (elements.get(e) ?? 0) + w);
    modalities.set(m, (modalities.get(m) ?? 0) + w);
  }
  const rank = <T,>(m: Map<T, number>) => [...m].sort((x, y) => y[1] - x[1])[0][0];

  out.push({
    id: `element:${rank(elements)}`,
    kind: 'element', weight: 0.6, tone: 'neutral', element: rank(elements),
  });
  out.push({
    id: `modality:${rank(modalities)}`,
    kind: 'modality', weight: 0.5, tone: 'neutral', modality: rank(modalities),
  });

  return out.sort((a, b) => b.weight - a.weight);
}

/** Stable fingerprint of the sky — identical skies must produce identical readings. */
export const fingerprint = (signals: Signal[]) =>
  signals.map((s) => s.id).sort().join('|');
