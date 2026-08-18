export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;
export type Sign = (typeof SIGNS)[number];

export const PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
] as const;
export type Planet = (typeof PLANETS)[number];

export const ASPECTS = ['conjunction', 'sextile', 'square', 'trine', 'opposition'] as const;
export type AspectName = (typeof ASPECTS)[number];

export const PHASES = [
  'new', 'waxing crescent', 'first quarter', 'waxing gibbous',
  'full', 'waning gibbous', 'last quarter', 'waning crescent',
] as const;
export type PhaseName = (typeof PHASES)[number];

export const ELEMENTS = ['fire', 'earth', 'air', 'water'] as const;
export type Element = (typeof ELEMENTS)[number];

export const MODALITIES = ['cardinal', 'fixed', 'mutable'] as const;
export type Modality = (typeof MODALITIES)[number];

/** Element of a sign, by its index in SIGNS. Aries is fire, then the cycle repeats. */
export const elementOf = (sign: Sign): Element =>
  ELEMENTS[SIGNS.indexOf(sign) % 4];

export const modalityOf = (sign: Sign): Modality =>
  MODALITIES[SIGNS.indexOf(sign) % 3];

/** How fast a body moves through the zodiac. Drives salience: slow pairs say the
 *  same thing for years and must not be allowed to dominate a daily reading. */
export const SPEED: Record<Planet, 'luminary' | 'personal' | 'social' | 'generational'> = {
  Sun: 'luminary', Moon: 'luminary',
  Mercury: 'personal', Venus: 'personal', Mars: 'personal',
  Jupiter: 'social', Saturn: 'social',
  Uranus: 'generational', Neptune: 'generational', Pluto: 'generational',
};

export interface Placement {
  planet: Planet;
  longitude: number;   // ecliptic longitude, 0-360, tropical of date
  sign: Sign;
  degree: number;      // 0-30 within the sign
  speed: number;       // degrees/day, negative when retrograde
  retrograde: boolean;
  house?: number;      // 1-12, only when the observer's location is known
}

export interface Aspect {
  a: Planet;
  b: Planet;
  aspect: AspectName;
  orb: number;         // degrees from exact
  exactness: number;   // 0-1, 1 = perfectly exact
  applying: boolean;   // tightening rather than separating
}

export interface Moon {
  phase: PhaseName;
  angle: number;       // 0-360 elongation from the Sun
  illumination: number;// 0-1
  waxing: boolean;
}

export interface Ground {
  ascendant: number;   // ecliptic longitude
  ascendantSign: Sign;
  midheaven: number;
  midheavenSign: Sign;
  latitude: number;
  longitude: number;
}

export interface Sky {
  at: Date;
  placements: Placement[];
  aspects: Aspect[];
  moon: Moon;
  ground?: Ground;     // absent when location was denied or unavailable
}
