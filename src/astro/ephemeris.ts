import * as A from 'astronomy-engine';
import {
  SIGNS, PLANETS, PHASES,
  type Aspect, type AspectName, type Moon, type Placement, type Planet, type Sign,
} from './types';

export const norm360 = (d: number) => ((d % 360) + 360) % 360;

/** Signed difference a - b, wrapped into (-180, 180]. */
export const delta = (a: number, b: number) => norm360(a - b + 180) - 180;

/** Geocentric ecliptic longitude, tropical of date — the frame Western astrology uses. */
function longitude(planet: Planet, date: Date): number {
  if (planet === 'Moon') return norm360(A.EclipticGeoMoon(date).lon);
  return norm360(A.Ecliptic(A.GeoVector(A.Body[planet], date, true)).elon);
}

const DAY_MS = 86_400_000;

function placement(planet: Planet, date: Date): Placement {
  const lon = longitude(planet, date);
  // central difference over half a day: stable sign, still tight near stations
  const before = longitude(planet, new Date(date.getTime() - DAY_MS / 4));
  const after = longitude(planet, new Date(date.getTime() + DAY_MS / 4));
  const speed = delta(after, before) * 2;

  return {
    planet,
    longitude: lon,
    sign: SIGNS[Math.floor(lon / 30)],
    degree: lon % 30,
    speed,
    retrograde: speed < 0,
  };
}

const ASPECT_TABLE: { name: AspectName; angle: number; orb: number }[] = [
  { name: 'conjunction', angle: 0, orb: 8 },
  { name: 'sextile', angle: 60, orb: 4 },
  { name: 'square', angle: 90, orb: 6 },
  { name: 'trine', angle: 120, orb: 6 },
  { name: 'opposition', angle: 180, orb: 8 },
];

/** Angular separation of two longitudes, 0-180. */
const separation = (a: number, b: number) => Math.abs(delta(a, b));

function findAspects(placements: Placement[]): Aspect[] {
  const found: Aspect[] = [];
  for (let i = 0; i < placements.length; i++) {
    for (let j = i + 1; j < placements.length; j++) {
      const p = placements[i];
      const q = placements[j];
      const sep = separation(p.longitude, q.longitude);

      for (const { name, angle, orb } of ASPECT_TABLE) {
        const off = Math.abs(sep - angle);
        if (off > orb) continue;

        // an aspect is applying if the separation is heading toward exact
        const sepLater = separation(
          p.longitude + p.speed / 24,
          q.longitude + q.speed / 24,
        );
        found.push({
          a: p.planet,
          b: q.planet,
          aspect: name,
          orb: off,
          exactness: 1 - off / orb,
          applying: Math.abs(sepLater - angle) < off,
        });
        break; // orbs never overlap, so one aspect per pair
      }
    }
  }
  return found.sort((x, y) => y.exactness - x.exactness);
}

function moonState(date: Date): Moon {
  const angle = A.MoonPhase(date);                 // 0-360 elongation from the Sun
  const index = Math.floor(norm360(angle + 22.5) / 45) % 8;
  return {
    phase: PHASES[index],
    angle,
    illumination: A.Illumination(A.Body.Moon, date).phase_fraction,
    waxing: angle < 180,
  };
}

export function readSky(date: Date = new Date()) {
  const placements = PLANETS.map((p) => placement(p, date));
  return {
    at: date,
    placements,
    aspects: findAspects(placements),
    moon: moonState(date),
  };
}

export const placementOf = (placements: Placement[], planet: Planet) =>
  placements.find((p) => p.planet === planet)!;

export const signOf = (longitude: number): Sign => SIGNS[Math.floor(norm360(longitude) / 30)];
