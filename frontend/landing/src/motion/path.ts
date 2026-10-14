// Driver module: one variable p (0 = stage 1 at dusk, 1 = stage 10 in full light) drives
// the ground, the ink, the header counter, the drawn path and the point of light.
// Home: p follows scroll through #path. Other pages pin p with <html data-state>.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, prefersReducedMotion } from '../engine';
import { isLight, paletteAt, stageAt } from '../data/light';

gsap.registerPlugin(ScrollTrigger);

let line: SVGPathElement | null = null;
let dot: SVGCircleElement | null = null;
let halo: SVGCircleElement | null = null;
let len = 0;
let marks: number[] = []; // path length where each stage's run begins, plus the end
let current = 0;
let lastStage = 0;

const pinned = () => {
  const v = document.documentElement.dataset.state;
  return v === undefined || v === '' ? null : +v;
};

function apply(p: number) {
  current = p;
  const html = document.documentElement;
  const c = paletteAt(p);
  html.style.setProperty('--c-bg', c.bg);
  html.style.setProperty('--c-fg', c.fg);
  html.style.setProperty('--c-muted', c.muted);
  html.style.setProperty('--c-accent', c.accent);
  html.style.setProperty('--c-line', c.line);
  html.classList.toggle('is-light', isLight(p));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', c.bg);

  const stage = stageAt(p);
  if (stage !== lastStage) {
    lastStage = stage;
    const count = document.querySelector('[data-stage-count]');
    if (count) count.textContent = String(stage).padStart(2, '0');
    document.querySelectorAll('.counter__ticks i').forEach((t, i) => t.classList.toggle('on', i < stage));
  }

  if (line && len) {
    const k = Math.min(9.999, p * 10), i = Math.floor(k);
    const drawn = prefersReducedMotion() ? len : marks[i] + (marks[i + 1] - marks[i]) * (k - i);
    line.style.strokeDashoffset = String(len - drawn);
    const pt = line.getPointAtLength(Math.max(0.01, drawn));
    dot?.setAttribute('cx', String(pt.x)); dot?.setAttribute('cy', String(pt.y));
    halo?.setAttribute('cx', String(pt.x)); halo?.setAttribute('cy', String(pt.y));
  }
}

// The switchback: one horizontal run above each stage, turning at alternate edges,
// with the same round turns as the logo.
function build(body: HTMLElement) {
  const svg = body.querySelector<SVGSVGElement>('[data-path-svg]')!;
  const items = [...body.querySelectorAll<HTMLElement>('.stage')];
  const W = body.clientWidth, H = body.clientHeight;
  const sw = W < 768 ? 8 : 12;
  const edge = sw + (W < 768 ? 6 : 14);
  const ys = items.map((el) => el.offsetTop);
  const gap = ys[1] - ys[0];
  const r = Math.min(W < 768 ? 28 : 56, gap / 2);
  const xl = edge + r, xr = W - edge - r;
  let d = `M${edge},${ys[0]}`;
  ys.forEach((y, i) => {
    const east = i % 2 === 0;
    const next = ys[i + 1];
    if (next === undefined) { d += ` H${east ? W - edge : edge}`; return; }
    if (east) d += ` H${xr} A${r},${r} 0 0 1 ${W - edge},${y + r} V${next - r} A${r},${r} 0 0 1 ${xr},${next}`;
    else d += ` H${xl} A${r},${r} 0 0 0 ${edge},${y + r} V${next - r} A${r},${r} 0 0 0 ${xl},${next}`;
  });
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.setProperty('--sw', `${sw}px`);
  body.querySelector('[data-path-grad]')?.setAttribute('y2', String(ys.at(-1)));
  body.querySelectorAll('[data-path-track], [data-path-line]').forEach((p) => p.setAttribute('d', d));
  line = body.querySelector('[data-path-line]');
  dot = body.querySelector('[data-path-dot]');
  halo = body.querySelector('[data-path-halo]');
  len = line!.getTotalLength();
  const q = (Math.PI * r) / 2;
  marks = [0];
  for (let i = 1; i < ys.length; i++) marks.push(marks[i - 1] + (xr - xl) + (i === 1 ? r : 0) + 2 * q + (ys[i] - ys[i - 1] - 2 * r));
  marks.push(len);
  line!.style.strokeDasharray = `${len} ${len}`;
  apply(current);
}

export function startPath() {
  // Astro replaces <html> attributes on navigation: restore the state before paint.
  document.addEventListener('astro:after-swap', () => { lastStage = 0; apply(pinned() ?? 0); });

  onPage(() => {
    lastStage = 0;
    line = dot = halo = null; len = 0;
    const body = document.querySelector<HTMLElement>('[data-path]');
    const pin = pinned();
    apply(pin ?? 0);
    if (!body) return;

    build(body);
    const ro = new ResizeObserver(() => build(body));
    ro.observe(body);

    ScrollTrigger.create({
      trigger: body,
      start: 'top 55%',
      end: 'bottom 55%',
      invalidateOnRefresh: true,
      toggleClass: { targets: document.documentElement, className: 'in-path' }, // keep the counter in view while walking
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });

    if (!prefersReducedMotion() && halo) {
      // Attention breathes: six breaths a minute.
      gsap.fromTo(halo, { attr: { r: 12 }, opacity: 0.55 }, { attr: { r: 26 }, opacity: 0.15, duration: 5, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }
    return () => ro.disconnect();
  });
}
