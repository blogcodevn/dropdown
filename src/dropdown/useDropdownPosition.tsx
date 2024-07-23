import { useCallback, useEffect, useRef, useState } from "react";

export interface UseDropdownPositionProps {
}

export function useDropdownPosition() {
  const buttonRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current || !menuRef.current || typeof window === 'undefined') {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();

    menuRef.current.style.transform = "scale(0)";
    menuRef.current.style.transition = "transform 0.3s, opacity 0.2s";
    menuRef.current.style.transformOrigin = "top left";
    menuRef.current.style.top = `${rect.bottom + window.scrollY + 10}px`;
    menuRef.current.style.left = `${rect.left}px`;

    setTimeout(() => {
      if (!menuRef.current) {
        return;
      }

      menuRef.current.style.opacity = '1';
      menuRef.current.style.transform = 'scale(1)';
    }, 100);
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  return { buttonRef, menuRef, isOpen, setIsOpen };
}
