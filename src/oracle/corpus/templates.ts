import type { SignalKind, Tone } from '../signals';

export type Role =
  | 'invocation' | 'omen' | 'tension' | 'current' | 'ground' | 'counsel' | 'charge';

export interface Template {
  role: Role;
  /** Signal kinds this frame can speak for. Empty means it needs no signal. */
  kinds: SignalKind[];
  /** Restrict to signals of a given tone. */
  tone?: Tone;
  text: string;
}

/**
 * Slots are {table:binding}. `table` names a vocabulary table (or `bank`, or
 * `raw` to print the bound value itself); `binding` is a field of the signal —
 * planet, other, sign, aspect, phase, house, element, modality — or a literal
 * key. The first letter of each rendered section is capitalised automatically.
 */
export const templates: Template[] = [
  // --- invocation --------------------------------------------------------
  { role: 'invocation', kinds: ['phase'], text: '{bank:opening} {motion:phase}.' },
  { role: 'invocation', kinds: ['phase'], text: '{motion:phase}.' },
  { role: 'invocation', kinds: ['phase'], text: '{bank:opening} {motion:phase}, and it will not repeat itself.' },
  { role: 'invocation', kinds: ['element'], text: '{bank:opening} {temper:element}.' },
  { role: 'invocation', kinds: ['element'], text: '{temper:element}. Read accordingly.' },
  { role: 'invocation', kinds: ['modality'], text: '{bank:opening} {cadence:modality}.' },
  { role: 'invocation', kinds: ['phase'], text: '{motion:phase}. That is the whole of the weather.' },
  { role: 'invocation', kinds: ['element'], text: 'Before anything else: {temper:element}.' },

  // --- omen ---------------------------------------------------------------
  { role: 'omen', kinds: ['placement'], text: '{domain:planet} {quality:sign}.' },
  { role: 'omen', kinds: ['placement'], text: 'In {raw:sign}, {domain:planet} {quality:sign}.' },
  { role: 'omen', kinds: ['placement'], text: 'This is the sign: {domain:planet} {quality:sign}.' },
  { role: 'omen', kinds: ['placement'], text: '{domain:planet} has gone into {raw:sign} and {quality:sign}.' },
  { role: 'omen', kinds: ['placement'], text: '{bank:omen}, and {domain:planet} {quality:sign}.' },
  { role: 'omen', kinds: ['aspect'], text: '{domain:planet} {relation:aspect} {domain:other}.' },
  { role: 'omen', kinds: ['aspect'], text: 'The figure overhead is this: {domain:planet} {relation:aspect} {domain:other}.' },
  { role: 'omen', kinds: ['aspect'], text: '{domain:planet} {relation:aspect} {domain:other}, and the sky is not subtle about it.' },
  { role: 'omen', kinds: ['phase'], text: '{motion:phase}, which is the only news worth reporting.' },
  { role: 'omen', kinds: ['placement', 'aspect'], text: '{bank:omen}. Overhead, {domain:planet} answers.' },

  // --- tension ------------------------------------------------------------
  { role: 'tension', kinds: ['aspect'], tone: 'hard', text: 'Where it catches: {domain:planet} {relation:aspect} {domain:other}.' },
  { role: 'tension', kinds: ['aspect'], tone: 'hard', text: '{domain:planet} {relation:aspect} {domain:other}, and neither will move first.' },
  { role: 'tension', kinds: ['aspect'], tone: 'hard', text: '{domain:planet} {relation:aspect} {domain:other}. That friction is not yours to resolve today.' },
  { role: 'tension', kinds: ['aspect'], tone: 'hard', text: 'The cost is here: {domain:planet} {relation:aspect} {domain:other}.' },
  { role: 'tension', kinds: ['aspect'], tone: 'hard', text: 'Do not expect ease. {domain:planet} {relation:aspect} {domain:other}.' },
  { role: 'tension', kinds: ['retrograde'], text: '{drift:planet}.' },
  { role: 'tension', kinds: ['retrograde'], text: 'And {drift:planet} — allow for it.' },
  { role: 'tension', kinds: ['retrograde'], text: '{drift:planet}. Nothing signed this week is final.' },
  { role: 'tension', kinds: ['retrograde'], text: 'Note the backward motion: {drift:planet}.' },

  // --- current ------------------------------------------------------------
  { role: 'current', kinds: ['aspect'], tone: 'soft', text: 'Meanwhile {domain:planet} {relation:aspect} {domain:other}.' },
  { role: 'current', kinds: ['aspect'], tone: 'soft', text: 'There is help in it: {domain:planet} {relation:aspect} {domain:other}.' },
  { role: 'current', kinds: ['aspect'], tone: 'soft', text: '{domain:planet} {relation:aspect} {domain:other}, quietly, without asking to be noticed.' },
  { role: 'current', kinds: ['aspect'], text: 'Underneath, {domain:planet} {relation:aspect} {domain:other}.' },
  { role: 'current', kinds: ['placement'], text: 'Running under all of it, {domain:planet} {quality:sign}.' },
  { role: 'current', kinds: ['placement'], text: 'And {domain:planet} {quality:sign}, as it has all season.' },
  { role: 'current', kinds: ['element'], text: 'Through all of it, {temper:element}.' },
  { role: 'current', kinds: ['modality'], text: '{cadence:modality}.' },

  // --- ground (only reachable when the reader's location is known) ---------
  { role: 'ground', kinds: ['ascendant'], text: 'Where you stand, {raw:sign} is on the horizon; whatever arrives, arrives through that door.' },
  { role: 'ground', kinds: ['ascendant'], text: '{raw:sign} is rising over the place you are standing in.' },
  { role: 'ground', kinds: ['ascendant'], text: 'The horizon at your latitude is cut by {raw:sign}. That is the shape of the entrance.' },
  { role: 'ground', kinds: ['house'], text: '{domain:planet} is moving through {field:house}.' },
  { role: 'ground', kinds: ['house'], text: 'For you, in this place, {domain:planet} sits in {field:house}.' },
  { role: 'ground', kinds: ['house'], text: 'It lands in {field:house}: {domain:planet}, {quality:sign}.' },

  // --- counsel ------------------------------------------------------------
  { role: 'counsel', kinds: [], text: 'So: {bank:gesture}.' },
  { role: 'counsel', kinds: [], text: '{bank:gesture} — {bank:hour}.' },
  { role: 'counsel', kinds: [], text: 'The counsel is simple and unwelcome: {bank:gesture}.' },
  { role: 'counsel', kinds: [], text: 'If you do one thing: {bank:gesture}.' },
  { role: 'counsel', kinds: [], text: '{bank:gesture}. Then {bank:gesture}.' },
  { role: 'counsel', kinds: ['aspect'], text: 'Do not mistake {domain:planet} for {domain:other}. {bank:gesture}.' },
  { role: 'counsel', kinds: ['aspect'], text: 'Between {domain:planet} and {domain:other}, choose neither. {bank:gesture}.' },
  { role: 'counsel', kinds: ['placement'], text: 'Let {domain:planet} do what it does — it {quality:sign} — and {bank:gesture}.' },
  { role: 'counsel', kinds: [], text: 'What is asked of you is small: {bank:gesture}, {bank:hour}.' },

  // --- charge -------------------------------------------------------------
  { role: 'charge', kinds: [], text: '{bank:charge}' },
  { role: 'charge', kinds: [], text: '{bank:witness} is keeping count. {bank:charge}' },
  { role: 'charge', kinds: [], text: '{bank:charge} Expect it {bank:hour}.' },
  { role: 'charge', kinds: [], text: 'Ask {bank:witness}, if you doubt it. {bank:charge}' },
  { role: 'charge', kinds: [], text: '{bank:charge} That is all the sky is willing to say.' },
];
