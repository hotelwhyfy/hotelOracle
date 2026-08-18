/** Print a reading in the terminal. `npm run read -- [lat] [lon]` */
import { observe } from '../src/astro';
import { divine } from '../src/oracle/assemble';

const [lat, lon] = process.argv.slice(2).map(Number);
const where = Number.isFinite(lat) && Number.isFinite(lon)
  ? { latitude: lat, longitude: lon }
  : undefined;

const sky = observe(new Date(), where);
const reading = divine(sky);

console.log(`\n  ${sky.at.toISOString()}${where ? `  ${lat}, ${lon}` : '  (unlocated)'}\n`);
for (const line of reading.text.split('\n\n')) console.log(`  ${line}\n`);
console.log(`  seed ${reading.seed} · ${reading.signals.length} signals\n`);
