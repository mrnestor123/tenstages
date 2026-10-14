// Global motion: runs once on the client, before the first page initializes.
import { gsap } from 'gsap';
import { ease, onPage, onScroll, prefersReducedMotion, setTransition } from '../engine';
import { startPath } from './path';

export function setupMotion() {
  startPath();

  // Page transition: the next turn of the path rises from below, led by a gold edge,
  // carrying the name of where you are going.
  let destination = '';
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    destination = a?.dataset.dest || a?.textContent?.trim().replace(/\s+/g, ' ') || '';
  }, true);
  setTransition({
    leave: (c) => {
      const title = c.querySelector('[data-curtain-title]');
      if (title) title.textContent = destination;
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .fromTo(c.querySelector('.curtain__panel'), { yPercent: 102 }, { yPercent: 0, duration: 0.8, ease: ease.inOut })
        .fromTo(title, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: ease.out }, 0.35);
    },
    enter: (c) => gsap.timeline()
      .to(c.querySelector('[data-curtain-title]'), { yPercent: -40, autoAlpha: 0, duration: 0.4, ease: ease.inOut })
      .to(c.querySelector('.curtain__panel'), { yPercent: -102, duration: 0.9, ease: ease.inOut }, 0.1)
      .set(c, { autoAlpha: 0 }),
  });

  // The header steps aside on the way down and returns on the way up.
  let last = 0;
  onScroll(({ y }) => {
    if (Math.abs(y - last) < 4) return;
    document.documentElement.classList.toggle('frame-away', y > 160 && y > last);
    last = y;
  });

  // Hero scene: clouds drift, flags stir, the sun rises with the intro.
  onPage(({ intro }) => {
    if (prefersReducedMotion() || !document.querySelector('.scene')) return;
    intro.add(gsap.from('[data-sun]', { y: 90, duration: 2.4, ease: ease.out }), 0);
    gsap.utils.toArray<SVGGElement>('[data-cloud]').forEach((c, i) => {
      gsap.to(c, { x: i % 2 ? -36 : 44, duration: 18 + i * 6, ease: 'sine.inOut', repeat: -1, yoyo: true });
    });
    gsap.to('[data-flag]', { rotate: 8, transformOrigin: '50% 0%', duration: 1.6, ease: 'sine.inOut', stagger: { each: 0.12, repeat: -1, yoyo: true } });
  });

  // Stage pages: the path continues down the page, drawn as you read.
  onPage(() => {
    const trail = document.querySelector('[data-trail]');
    if (!trail || prefersReducedMotion()) return;
    gsap.fromTo(trail, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.sp', start: 'top top', end: 'bottom bottom', scrub: true } });
  });

  // Hero and stage maps: the switchback draws itself, then the stops light up in order.
  onPage(({ intro }) => {
    if (prefersReducedMotion()) return;
    document.querySelectorAll<SVGSVGElement>('[data-mark].hero__mark, [data-mark].sp__mark').forEach((svg) => {
      const path = svg.querySelector('.mark__path');
      const stops = svg.querySelectorAll('.mark__stop');
      const len = svg.dataset.len;
      intro.add(gsap.fromTo(path, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.2, ease: ease.inOut }), 0.1);
      intro.add(gsap.from(stops, { opacity: 0, duration: 0.6, stagger: 0.12, ease: ease.soft }), 0.9);
      const active = svg.querySelector('.mark__stop.is-active circle');
      if (active) gsap.fromTo(active, { attr: { r: 6 } }, { attr: { r: 9 }, duration: 5, ease: 'sine.inOut', repeat: -1, yoyo: true });
    });
  });
}
