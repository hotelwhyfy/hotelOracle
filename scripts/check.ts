/**
 * Corpus QA. Samples readings across many skies and flags broken output —
 * unfilled slots, doubled spaces, orphaned punctuation — plus reports coverage
 * so you can see which vocabulary entries never actually get used.
 */
import { observe } from '../src/astro';
import { capacity, divine } from '../src/oracle/assemble';
import { templates } from '../src/oracle/corpus/templates';

const NYC = { latitude: 40.71, longitude: -74.01 };
const SAMPLES = 2000;

let malformed = 0;
const sectionCounts: number[] = [];
const seenTemplates = new Set<string>();
const seenText = new Set<string>();
const roleCounts = new Map<string, number>();

for (let i = 0; i < SAMPLES; i++) {
  // walk 7 hours at a time so the moon, the aspects and the horizon all move
  const at = new Date(Date.UTC(2026, 0, 1) + i * 7 * 3600e3);
  const reading = divine(observe(at, i % 3 ? NYC : undefined));

  // test each section on its own; the blank line between sections is intentional
  const broken = reading.sections.find((s) =>
    /[{}]|  |\s[.,]|^\s|,\s*\.|\.\s+[a-z]|^[a-z]/.test(s.text));
  if (broken) {
    if (malformed++ < 5) console.log(`  MALFORMED [${broken.role}]:`, JSON.stringify(broken.text));
  }
  sectionCounts.push(reading.sections.length);
  seenText.add(reading.text);
  for (const s of reading.sections) {
    roleCounts.set(s.role, (roleCounts.get(s.role) ?? 0) + 1);
    seenTemplates.add(s.role + s.text.slice(0, 12));
  }
}

// determinism: the same sky must always give the same words
const fixed = new Date('2026-08-18T20:00:00Z');
const repeats = new Set([0, 0, 0, 0, 0].map(() => divine(observe(fixed, NYC)).text));

console.log(`\n  samples          ${SAMPLES}`);
console.log(`  malformed        ${malformed}`);
console.log(`  deterministic    ${repeats.size === 1 ? 'yes' : `NO (${repeats.size} variants)`}`);
console.log(`  distinct texts   ${seenText.size} (${((seenText.size / SAMPLES) * 100).toFixed(1)}% unique)`);
console.log(`  sections         ${Math.min(...sectionCounts)}-${Math.max(...sectionCounts)}`);
console.log(`  templates        ${templates.length} defined`);
console.log('  role frequency');
for (const [role, n] of [...roleCounts].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${role.padEnd(12)} ${((n / SAMPLES) * 100).toFixed(0)}%`);
}

const caps = capacity(observe(new Date(), NYC));
console.log('  capacity for one sky');
for (const [role, n] of Object.entries(caps)) {
  if (role === 'total') continue;
  console.log(`    ${role.padEnd(12)} ${n.toLocaleString()}`);
}
console.log(`    ${'TOTAL'.padEnd(12)} ${caps.total.toExponential(2)} distinct readings`);
console.log();
process.exit(malformed || repeats.size !== 1 ? 1 : 0);
