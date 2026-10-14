// Smooth scroll on ONE clock: Lenis is driven by gsap.ticker, ScrollTrigger reads Lenis.
// Reduced motion → native scroll, no Lenis.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './env';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let anchorsBound = false;
const listeners = new Set<(s: ScrollState) => void>();

export type ScrollState = { y: number; velocity: number; progress: number };
const state: ScrollState = { y: 0, velocity: 0, progress: 0 };

export function initScroll() {
  if (!lenis && !prefersReducedMotion()) {
    // Anchors are handled below: ClientRouter preventDefault on in-page hashes, then
    // location.href is already #id so the native jump never runs.
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2 });
    lenis.on('scroll', (l: Lenis) => {
      state.y = l.scroll;
      state.velocity = l.velocity;
      state.progress = l.limit > 0 ? l.scroll / l.limit : 0; // Lenis reports 1 on pages that cannot scroll
      ScrollTrigger.update();
      listeners.forEach((fn) => fn(state));
    });
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else if (!lenis) {
    addEventListener('scroll', nativeTick, { passive: true });
  }
  if (!anchorsBound) {
    anchorsBound = true;
    document.addEventListener('click', onAnchorClick, true);
  }
}

function nativeTick() {
  const max = document.documentElement.scrollHeight - innerHeight;
  state.velocity = scrollY - state.y;
  state.y = scrollY;
  state.progress = max > 0 ? scrollY / max : 0;
  listeners.forEach((fn) => fn(state));
}

function onAnchorClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.('a');
  if (!a || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
  let url: URL;
  try { url = new URL(a.href, location.href); } catch { return; }
  if (url.origin !== location.origin || url.pathname !== location.pathname) return;

  const hash = url.hash;
  const el = elFromHash(hash);
  if (el) {
    e.preventDefault();
    e.stopPropagation();
    if (location.hash !== hash) history.pushState(history.state ?? {}, '', hash);
    scrollToTarget(el);
    return;
  }
  if (hash && hash !== '#') return;

  // Same page, no fragment: scroll home instead of replaying the curtain.
  e.preventDefault();
  e.stopPropagation();
  const next = url.pathname + url.search;
  if (location.hash || location.search !== url.search) history.pushState(history.state ?? {}, '', next);
  scrollToTarget(0);
}

function elFromHash(hash: string) {
  if (!hash || hash === '#') return null;
  return document.getElementById(decodeURIComponent(hash.slice(1)));
}

export const onScroll = (fn: (s: ScrollState) => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const scrollState = () => state;
export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else scrollTo(0, 0);
  state.y = 0;
  state.velocity = 0;
}
export function hashTarget() {
  return elFromHash(location.hash);
}
export function scrollToTarget(target: string | HTMLElement | number, opts: { immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      immediate: opts.immediate,
      force: true,
    });
    return;
  }
  if (typeof target === 'number') {
    scrollTo({ top: target, behavior: opts.immediate ? 'auto' : 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: opts.immediate ? 'auto' : 'smooth' });
}
