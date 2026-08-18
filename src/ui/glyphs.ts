import type { AspectName, Planet, Sign } from '../astro';

export const PLANET_GLYPH: Record<Planet, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
};

export const SIGN_GLYPH: Record<Sign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const ASPECT_GLYPH: Record<AspectName, string> = {
  conjunction: '☌', sextile: '⚹', square: '□', trine: '△', opposition: '☍',
};

export const MOON_GLYPH: Record<string, string> = {
  new: '●', 'waxing crescent': '☽', 'first quarter': '◐', 'waxing gibbous': '◑',
  full: '○', 'waning gibbous': '◒', 'last quarter': '◑', 'waning crescent': '☾',
};
