/**
 * Classic common.js (2023) menu hash scroll:
 * preventDefault + history.pushState + $('html, body').animate({ scrollTop }, 1000).
 * No jQuery. Overflow-parent fallback for Modern canvas when window cannot scroll.
 */

const CLASSIC_ANCHOR_SCROLL_MS = 1000;

let scrollGeneration = 0;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function getDocumentScrollTop(): number {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function isOverflowScrollable(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  const canScroll = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';

  return canScroll && element.scrollHeight > element.clientHeight + 1;
}

function findOverflowScrollParents(target: HTMLElement): HTMLElement[] {
  const parents: HTMLElement[] = [];
  let current: HTMLElement | null = target.parentElement;

  while (current && current !== document.documentElement && current !== document.body) {
    if (isOverflowScrollable(current)) {
      parents.push(current);
    }

    current = current.parentElement;
  }

  return parents;
}

function windowCanScroll(): boolean {
  const doc = document.documentElement;
  const body = document.body;
  const view = window.innerHeight || doc.clientHeight;

  return Math.max(doc.scrollHeight, body.scrollHeight) > view + 1;
}

interface IScrollJob {
  set: (value: number) => void;
  from: number;
  to: number;
}

function animateScrollJobs(jobs: IScrollJob[], durationMs: number): void {
  const generation = ++scrollGeneration;

  if (durationMs <= 0) {
    jobs.forEach((job) => job.set(job.to));
    return;
  }

  const start = performance.now();

  const tick = (now: number): void => {
    if (generation !== scrollGeneration) {
      return;
    }

    const t = Math.min(1, (now - start) / durationMs);
    const eased = 0.5 - Math.cos(t * Math.PI) / 2;

    jobs.forEach((job) => {
      job.set(job.from + (job.to - job.from) * eased);
    });

    if (t < 1) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
}

export function scrollToClassicAnchor(href: string): boolean {
  if (!href || href.charAt(0) !== '#') {
    return false;
  }

  const id = href.slice(1);

  if (!id) {
    return false;
  }

  const target = document.getElementById(id);

  if (!target) {
    return false;
  }

  const durationMs = prefersReducedMotion() ? 0 : CLASSIC_ANCHOR_SCROLL_MS;
  const html = document.documentElement;
  const body = document.body;
  const documentTop = target.getBoundingClientRect().top + getDocumentScrollTop();
  const jobs: IScrollJob[] = [
    {
      set: (value: number) => {
        html.scrollTop = value;
        body.scrollTop = value;
      },
      from: getDocumentScrollTop(),
      to: documentTop
    }
  ];

  if (!windowCanScroll()) {
    findOverflowScrollParents(target).forEach((parent) => {
      const parentRect = parent.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      jobs.push({
        set: (value: number) => {
          parent.scrollTop = value;
        },
        from: parent.scrollTop,
        to: parent.scrollTop + (targetRect.top - parentRect.top)
      });
    });
  }

  animateScrollJobs(jobs, durationMs);

  const baseUrl = window.location.href.split('#')[0];
  history.pushState(null, '', `${baseUrl}#${id}`);

  return true;
}
