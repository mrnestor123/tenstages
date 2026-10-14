// The illumination curve: p (0 = stage 1 at dusk, 1 = stage 10 in full light) → every page color.
// Shared by the server (stage pages render their state) and the path driver.
//
// The ground goes dusk teal → forest → moss → sage → olive gold → gold → cream, spread over the whole
// path so every stage is visibly lighter than the last. Ink flips once, at FLIP, where the ground is a
// mid tone. Around the flip neither ink reaches AA for small text (about 3.6:1 for a few percent of the
// scroll), so the ground crosses that band quickly and the stage pages (centers at p = .05 ... .95) sit
// well clear of it.
const stops: [number, string][] = [
  [0, '#141b1b'],
  [0.12, '#182524'],
  [0.25, '#1e302d'],
  [0.38, '#2c433b'],
  [0.45, '#455a4c'],
  [0.5, '#7b8466'],
  [0.58, '#aaa876'],
  [0.7, '#d3c180'],
  [0.84, '#ecdc9d'],
  [1, '#fffad5'],
];
export const FLIP = 0.5;

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a: string, b: string, t: number) => {
  const x = rgb(a), y = rgb(b);
  return hex(x.map((v, i) => v + (y[i] - v) * t));
};
const clamp = (p: number) => Math.min(1, Math.max(0, p));
const ramp = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export function groundAt(p: number) {
  p = clamp(p);
  let i = 0;
  while (i < stops.length - 2 && p > stops[i + 1][0]) i++;
  const [p0, c0] = stops[i];
  const [p1, c1] = stops[i + 1];
  return mix(c0, c1, (p - p0) / (p1 - p0));
}

export const isLight = (p: number) => p >= FLIP;

/** Ground, ink, secondary ink, accent and hairline for a position on the path. */
export function paletteAt(p: number) {
  p = clamp(p);
  const bg = groundAt(p);
  // Dark side: text brightens as the ground lifts, so contrast holds right up to the flip.
  // Light side: ink starts darkest at the flip and eases toward the brand brown at the end.
  const light = isLight(p);
  const fg = light ? mix('#1d1b16', '#2b2a26', ramp(p, FLIP, 1)) : '#fffad5';
  const muted = light ? mix('#26241d', '#5c584c', ramp(p, FLIP, 0.9)) : mix('#b9b49a', '#efe8c0', ramp(p, 0.25, FLIP));
  const accent = light ? mix('#2a1d06', '#7d5e22', ramp(p, FLIP, 0.9)) : mix('#d9bc7a', '#f4dfa0', ramp(p, 0.25, FLIP));
  const [r, g, b] = rgb(fg);
  return { bg, fg, muted, accent, line: `rgb(${r} ${g} ${b} / 0.16)` };
}

/** The same palette as an inline style string for <html> (server render). */
export function cssVars(p: number) {
  const c = paletteAt(p);
  return `--c-bg:${c.bg};--c-fg:${c.fg};--c-muted:${c.muted};--c-accent:${c.accent};--c-line:${c.line}`;
}

export const stageAt = (p: number) => Math.min(10, Math.floor(p * 10 + 1e-9) + 1);
export const pOfStage = (n: number) => (n - 0.5) / 10;
