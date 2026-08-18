import type { Sky } from '../astro';
import type { Reading } from '../oracle/assemble';
import { ASPECT_GLYPH, MOON_GLYPH, PLANET_GLYPH, SIGN_GLYPH } from './glyphs';

const el = (tag: string, className?: string, text?: string) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const degrees = (d: number) => `${Math.floor(d)}°${String(Math.floor((d % 1) * 60)).padStart(2, '0')}′`;

export function renderReading(reading: Reading): HTMLElement {
  const wrap = el('div', 'reading');
  reading.sections.forEach((section, i) => {
    const p = el('p', `line line--${section.role}`, section.text);
    p.style.animationDelay = `${i * 260}ms`;
    wrap.append(p);
  });
  return wrap;
}

export function renderSky(sky: Sky): HTMLElement {
  const wrap = el('div', 'sky');

  const moon = el('p', 'sky__moon');
  moon.append(
    el('span', 'sky__moonGlyph', MOON_GLYPH[sky.moon.phase] ?? '☽'),
    el('span', undefined, ` ${sky.moon.phase} moon · ${Math.round(sky.moon.illumination * 100)}% lit`),
  );
  wrap.append(moon);

  const table = el('div', 'bodies');
  for (const p of sky.placements) {
    const row = el('div', 'body');
    row.append(
      el('span', 'body__planet', `${PLANET_GLYPH[p.planet]} ${p.planet}`),
      el('span', 'body__sign', `${SIGN_GLYPH[p.sign]} ${degrees(p.degree)} ${p.sign}`),
      el('span', 'body__flags',
        [p.retrograde ? '℞' : '', p.house ? `h${p.house}` : ''].filter(Boolean).join(' ')),
    );
    table.append(row);
  }
  wrap.append(table);

  if (sky.ground) {
    wrap.append(el('p', 'sky__ground',
      `ascendant ${SIGN_GLYPH[sky.ground.ascendantSign]} ${degrees(sky.ground.ascendant % 30)} ${sky.ground.ascendantSign}` +
      `  ·  midheaven ${SIGN_GLYPH[sky.ground.midheavenSign]} ${sky.ground.midheavenSign}`));
  }

  const aspects = el('div', 'aspects');
  for (const a of sky.aspects.slice(0, 10)) {
    aspects.append(el('div', 'aspect',
      `${PLANET_GLYPH[a.a]} ${ASPECT_GLYPH[a.aspect]} ${PLANET_GLYPH[a.b]}` +
      `   ${a.aspect} · orb ${a.orb.toFixed(1)}° · ${a.applying ? 'applying' : 'separating'}`));
  }
  wrap.append(aspects);

  return wrap;
}
