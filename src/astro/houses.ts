import * as A from 'astronomy-engine';
import { norm360, signOf } from './ephemeris';
import { SIGNS, type Ground, type Placement } from './types';

const DEG = Math.PI / 180;

/** Mean obliquity of the ecliptic for the date, in degrees (IAU 1980 polynomial). */
function obliquity(date: Date): number {
  const T = A.MakeTime(date).tt / 36525; // Julian centuries from J2000
  return 23.439291111 - T * (0.0130041667 + T * (1.638889e-7 - T * 5.036111e-7));
}

/** Right ascension of the midheaven — local apparent sidereal time in degrees. */
function ramc(date: Date, longitude: number): number {
  return norm360((A.SiderealTime(date) + longitude / 15) * 15);
}

/**
 * Ecliptic longitude of the point rising on the eastern horizon.
 * Verified against the sunrise invariant (ASC == Sun's longitude at sunrise)
 * to within ~1 degree at low and mid latitudes.
 */
function ascendant(ramcDeg: number, latitude: number, obliquityDeg: number): number {
  const r = ramcDeg * DEG;
  const e = obliquityDeg * DEG;
  const p = latitude * DEG;
  return norm360(
    Math.atan2(Math.cos(r), -(Math.sin(r) * Math.cos(e) + Math.tan(p) * Math.sin(e))) / DEG,
  );
}

/** Ecliptic longitude of the point culminating on the meridian. */
function midheaven(ramcDeg: number, obliquityDeg: number): number {
  const r = ramcDeg * DEG;
  const e = obliquityDeg * DEG;
  return norm360(Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(e)) / DEG);
}

export function groundAt(date: Date, latitude: number, longitude: number): Ground {
  const e = obliquity(date);
  const r = ramc(date, longitude);
  const asc = ascendant(r, latitude, e);
  const mc = midheaven(r, e);
  return {
    ascendant: asc,
    ascendantSign: signOf(asc),
    midheaven: mc,
    midheavenSign: signOf(mc),
    latitude,
    longitude,
  };
}

/**
 * Whole-sign houses: the ascendant's whole sign is the first house and each
 * following sign is the next. Chosen over quadrant systems because it stays
 * sane at extreme latitudes, where Placidus houses collapse entirely.
 */
export function assignHouses(placements: Placement[], ground: Ground): Placement[] {
  const rising = SIGNS.indexOf(ground.ascendantSign);
  return placements.map((p) => ({
    ...p,
    house: ((SIGNS.indexOf(p.sign) - rising + 12) % 12) + 1,
  }));
}
