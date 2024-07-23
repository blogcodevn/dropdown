import { useState, useEffect, useRef, useCallback } from 'react';
import findScrollContainers from './findScrollContainers';

interface Position {
  top: number;
  left: number;
  transformOrigin: string;
}

interface UseDropdownPositionProps {
  menuHeight: string | number;
  align: 'left' | 'right';
}

const useDropdownPosition = ({ menuHeight, align }: UseDropdownPositionProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, transformOrigin: 'top' });
  const [isPositioned, setIsPositioned] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownListRef = useRef<HTMLDivElement>(null);
  const scrollContainersRef = useRef<(HTMLElement | Document)[]>([]);
  const [calculatedMenuHeight, setCalculatedMenuHeight] = useState<string | number>(menuHeight);

  const updatePosition = useCallback(() => {
    if (buttonRef.current && dropdownListRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;
      const listHeight = dropdownListRef.current.scrollHeight;

      let calculatedHeight: number;
      let topPosition: number;
      let leftPosition: number;
      let transformOrigin: string;

      if (typeof menuHeight === 'string' && menuHeight === 'auto') {
        if (listHeight <= spaceBelow) {
          calculatedHeight = listHeight;
          topPosition = rect.bottom + window.scrollY;
          transformOrigin = 'top';
        } else if (listHeight <= spaceAbove) {
          calculatedHeight = listHeight;
          topPosition = rect.top + window.scrollY - listHeight;
          transformOrigin = 'bottom';
        } else if (spaceBelow >= spaceAbove) {
          calculatedHeight = spaceBelow;
          topPosition = rect.bottom + window.scrollY;
          transformOrigin = 'top';
        } else {
          calculatedHeight = spaceAbove;
          topPosition = rect.top + window.scrollY - spaceAbove;
          transformOrigin = 'bottom';
        }
      } else {
        calculatedHeight = typeof menuHeight === 'number' ? menuHeight : 0;
        if (calculatedHeight <= spaceBelow) {
          topPosition = rect.bottom + window.scrollY;
          transformOrigin = 'top';
        } else {
          topPosition = rect.top + window.scrollY - calculatedHeight;
          transformOrigin = 'bottom';
        }
      }

      leftPosition = align === 'right' ? rect.right + window.scrollX - dropdownListRef.current.offsetWidth : rect.left + window.scrollX;

      setCalculatedMenuHeight(calculatedHeight);
      setPosition({
        top: topPosition,
        left: leftPosition,
        transformOrigin: transformOrigin,
      });
      setIsPositioned(true);
    }
  }, [menuHeight, align]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setIsPositioned(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updatePosition);

    const handleScroll = () => {
      updatePosition();
    };

    scrollContainersRef.current = findScrollContainers(buttonRef.current);
    scrollContainersRef.current.push(document, document.documentElement, document.body);
    scrollContainersRef.current.forEach((container) => {
      container.addEventListener('scroll', handleScroll);
    });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);

      scrollContainersRef.current.forEach((container) => {
        container.removeEventListener('scroll', handleScroll);
      });
    };
  }, [handleClickOutside, updatePosition]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  return { buttonRef, dropdownListRef, position, isPositioned, calculatedMenuHeight, isOpen, setIsOpen };
};

export default useDropdownPosition;