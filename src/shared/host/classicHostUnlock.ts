export interface IClassicHostUnlockHandle {
  refresh(): void;
  dispose(): void;
}

export interface IClassicHostUnlockOptions {
  /** Classic body/html background — fills Modern canvas gaps below web part content. */
  pageBackground?: string;
}

interface IStoredStyle {
  el: HTMLElement;
  props: { [key: string]: string };
}

interface IStoredBackground {
  el: HTMLElement;
  value: string;
}

const BACKGROUND_PROP = 'background-color';

const UNLOCK_MARK = 'data-dbs-ffw-host-unlock';

/** CSS properties unlocked on SharePoint canvas ancestors (kebab-case for setProperty). */
const STYLE_PROPS: ReadonlyArray<{ name: string; unlock: string }> = [
  { name: 'max-width', unlock: 'none' },
  { name: 'width', unlock: '100%' },
  { name: 'overflow', unlock: 'visible' },
  { name: 'overflow-x', unlock: 'visible' },
  { name: 'overflow-y', unlock: 'visible' },
  { name: 'height', unlock: 'auto' },
  { name: 'min-height', unlock: 'auto' },
  { name: 'max-height', unlock: 'none' },
  { name: 'padding', unlock: '0' },
  { name: 'padding-left', unlock: '0' },
  { name: 'padding-right', unlock: '0' },
  { name: 'padding-top', unlock: '0' },
  { name: 'padding-bottom', unlock: '0' },
  { name: 'margin-left', unlock: '0' },
  { name: 'margin-right', unlock: '0' }
];

const ANCESTOR_SELECTORS = [
  '#spPageCanvasContent',
  '.CanvasComponent',
  '.CanvasZone--fullWidth',
  '.CanvasZone',
  '.CanvasZoneSectionContainer',
  '[data-automation-id="CanvasZone"]',
  '.CanvasSection',
  '[data-automation-id="CanvasSection"]',
  '.ControlZone--control',
  '.ControlZone',
  '.ms-SPLegacyFabricBlock',
  '[data-automation-id="CanvasControl"]',
  '.sp-canvas-zone'
];

function matchesUnlockTarget(element: HTMLElement): boolean {
  return ANCESTOR_SELECTORS.some((selector) => {
    try {
      return element.matches(selector);
    } catch {
      return false;
    }
  });
}

function readInlineStyle(el: HTMLElement, prop: string): string {
  return el.style.getPropertyValue(prop);
}

function writeInlineStyle(el: HTMLElement, prop: string, value: string): void {
  el.style.setProperty(prop, value);
}

function clearInlineStyle(el: HTMLElement, prop: string): void {
  el.style.removeProperty(prop);
}

function unlockAncestors(host: HTMLElement): IStoredStyle[] {
  const stored: IStoredStyle[] = [];
  let current: HTMLElement | null = host.parentElement;

  while (current && current !== document.body) {
    if (matchesUnlockTarget(current)) {
      const props: { [key: string]: string } = {};

      STYLE_PROPS.forEach(({ name, unlock }) => {
        props[name] = readInlineStyle(current!, name);
        writeInlineStyle(current!, name, unlock);
      });

      current.setAttribute(UNLOCK_MARK, 'true');
      stored.push({ el: current, props });
    }

    current = current.parentElement;
  }

  return stored;
}

function restoreStyles(stored: IStoredStyle[]): void {
  stored.forEach(({ el, props }) => {
    STYLE_PROPS.forEach(({ name }) => {
      const value = props[name];

      if (value) {
        writeInlineStyle(el, name, value);
      } else {
        clearInlineStyle(el, name);
      }
    });

    el.removeAttribute(UNLOCK_MARK);
  });
}

function findFabricBlock(host: HTMLElement): HTMLElement | undefined {
  let current: HTMLElement | null = host.parentElement;

  while (current && current !== document.body) {
    if (current.classList.contains('ms-SPLegacyFabricBlock')) {
      return current;
    }
    current = current.parentElement;
  }

  return undefined;
}

function findContentRoot(host: HTMLElement, contentRoot?: HTMLElement): HTMLElement {
  if (contentRoot) {
    return contentRoot;
  }

  const nested = host.querySelector('[class*="Root"]') as HTMLElement | null;
  return nested || host;
}

function collectBackgroundTargets(
  host: HTMLElement,
  fabricBlock?: HTMLElement
): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  const targets: HTMLElement[] = [];

  const add = (el: HTMLElement | null | undefined): void => {
    if (el && !seen.has(el)) {
      seen.add(el);
      targets.push(el);
    }
  };

  let current: HTMLElement | null = host.parentElement;

  while (current) {
    if (matchesUnlockTarget(current)) {
      add(current);
    }
    current = current.parentElement;
  }

  add(fabricBlock);
  add(document.getElementById('spPageCanvasContent'));
  add(document.body);
  add(document.documentElement);

  return targets;
}

function paintPageBackground(
  targets: HTMLElement[],
  color: string
): IStoredBackground[] {
  return targets.map((el) => {
    const value = readInlineStyle(el, BACKGROUND_PROP);
    writeInlineStyle(el, BACKGROUND_PROP, color);
    return { el, value };
  });
}

function restorePageBackground(stored: IStoredBackground[]): void {
  stored.forEach(({ el, value }) => {
    if (value) {
      writeInlineStyle(el, BACKGROUND_PROP, value);
    } else {
      clearInlineStyle(el, BACKGROUND_PROP);
    }
  });
}

/**
 * Unlocks SharePoint canvas ancestors for full-width / full-bleed sections
 * and syncs host min-height to avoid the ~450px Fabric clip.
 */
export function unlockClassicHost(
  host: HTMLElement,
  contentRoot?: HTMLElement,
  options?: IClassicHostUnlockOptions
): IClassicHostUnlockHandle {
  const stored = unlockAncestors(host);
  const observeTarget = findContentRoot(host, contentRoot);
  const fabricBlock = findFabricBlock(host);
  const pageBackground = options?.pageBackground;
  const storedBackground = pageBackground
    ? paintPageBackground(collectBackgroundTargets(host, fabricBlock), pageBackground)
    : [];
  let resizeObserver: ResizeObserver | undefined;

  const syncHeight = (): void => {
    if (!fabricBlock) {
      return;
    }

    const height = observeTarget.scrollHeight;
    if (height > 0) {
      fabricBlock.style.minHeight = `${height}px`;
      fabricBlock.style.overflow = 'visible';
      fabricBlock.style.overflowY = 'visible';
    }
  };

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => syncHeight());
    resizeObserver.observe(observeTarget);
    syncHeight();
  }

  host.style.width = '100%';
  host.style.maxWidth = 'none';
  host.style.boxSizing = 'border-box';
  host.style.marginLeft = '0';
  host.style.marginRight = '0';

  return {
    refresh: syncHeight,
    dispose: () => {
      resizeObserver?.disconnect();

      if (fabricBlock) {
        fabricBlock.style.removeProperty('min-height');
        fabricBlock.style.removeProperty('overflow');
        fabricBlock.style.removeProperty('overflow-y');
      }

      host.style.removeProperty('width');
      host.style.removeProperty('max-width');
      host.style.removeProperty('box-sizing');
      host.style.removeProperty('margin-left');
      host.style.removeProperty('margin-right');
      restorePageBackground(storedBackground);
      restoreStyles(stored);
    }
  };
}

/** Query React content root inside the web part host after render. */
export function findClassicContentRoot(
  host: HTMLElement,
  classSubstring: string
): HTMLElement | undefined {
  const el = host.querySelector(`[class*="${classSubstring}"]`) as HTMLElement | null;
  return el || undefined;
}

export function isFullBleedSection(host: HTMLElement): boolean {
  return host.closest('.CanvasZone--fullWidth') !== null;
}
