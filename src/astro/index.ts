import { readSky } from './ephemeris';
import { assignHouses, groundAt } from './houses';
import type { Sky } from './types';

export interface Location {
  latitude: number;
  longitude: number;
}

/** Read the sky. With a location we can also place the horizon and the houses;
 *  without one the reading simply draws on fewer signals. */
export function observe(date: Date = new Date(), where?: Location): Sky {
  const sky = readSky(date);
  if (!where) return sky;

  const ground = groundAt(date, where.latitude, where.longitude);
  return { ...sky, ground, placements: assignHouses(sky.placements, ground) };
}

export * from './types';
export { norm360, placementOf, signOf } from './ephemeris';
