import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let lockCount = 0;

/** Locks page scroll while any dialog is open (counted, so stacked dialogs don't unlock early). */
function lockBodyScroll(): () => void {
  if (lockCount++ === 0) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingInlineEnd = `${scrollbar}px`;
  }
  return () => {
    if (--lockCount === 0) {
      document.body.style.overflow = '';
      document.body.style.paddingInlineEnd = '';
    }
  };
}

/**
 * Accessible modal behaviour: traps Tab inside `ref`, closes on Escape,
 * locks body scroll and returns focus to the trigger when the dialog closes.
 */
export function useDialog(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const unlock = lockBodyScroll();
    const node = ref.current;
    // Focus the dialog itself so screen readers announce it, without jumping to a button.
    node?.focus({ preventScroll: true });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      unlock();
      trigger?.focus?.({ preventScroll: true });
    };
  }, [open, ref]);
}
