import type { MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Put keyboard navigation at the destination without changing its scroll position. */
export function focusContent(target: HTMLElement | null) {
  if (!target) return;
  if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
}

/** Keep same-page navigation consistent without overwriting the departing scroll entry. */
export function usePageNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  return (event: MouseEvent<HTMLAnchorElement>, destination: string) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || location.pathname !== destination) return;
    event.preventDefault();
    if (location.search || location.hash) {
      // Layout scrolls after navigation commits and saves the departing position.
      void navigate(destination, { state: { returnToStart: true } });
    } else {
      // Nothing changes in the URL, so avoid adding a duplicate history entry.
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      focusContent(document.getElementById('main-content'));
    }
  };
}
