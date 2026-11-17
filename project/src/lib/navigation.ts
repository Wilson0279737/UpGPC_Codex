import type { MouseEvent } from 'react';

/** Put keyboard navigation at the destination without changing its scroll position. */
export function focusContent(target: HTMLElement | null) {
  if (!target) return;
  if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
}

/** A link to the page already open should work from either navigation bar. */
export function returnToPageStart(event: MouseEvent<HTMLAnchorElement>, currentPath: string, destination: string) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || currentPath !== destination) return;
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  focusContent(document.getElementById('main-content'));
}
