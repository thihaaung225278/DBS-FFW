/**
 * Classic common.js anchor scroll — window-level scroll + hash update (not scrollIntoView).
 */
export function scrollToClassicAnchor(href: string): boolean {
  if (!href || href.charAt(0) !== '#') {
    return false;
  }

  const id = href.slice(1);
  const target = document.getElementById(id);

  if (!target) {
    return false;
  }

  const top =
    target.getBoundingClientRect().top +
    (window.pageYOffset || document.documentElement.scrollTop);

  window.scrollTo({ top, behavior: 'smooth' });

  const baseUrl = window.location.href.split('#')[0];
  history.pushState(null, '', `${baseUrl}#${id}`);

  return true;
}
