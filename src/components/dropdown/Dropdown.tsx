import { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import DropdownContent from './DropdownContent';
import findScrollContainers from './findScrollContainers';

interface DropdownItem {
  label: string;
  children?: DropdownItem[];
}

interface DropdownProps {
  items: DropdownItem[];
  portal?: boolean;
  zIndex?: number;
  menuWidth?: number;
  menuHeight?: string | number;
  scrollBehavior?: 'closest' | 'observer';
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  portal = false,
  zIndex,
  menuWidth = 300,
  menuHeight = 'auto',
  scrollBehavior = 'closest',
}) => {
  const [currentItems, setCurrentItems] = useState<DropdownItem[]>(items);
  const [breadcrumb, setBreadcrumb] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<'none' | 'left' | 'right'>('none');
  const [childItems, setChildItems] = useState<DropdownItem[] | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');

  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollContainersRef = useRef<HTMLElement[]>([]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.children) {
      setSlideDirection('left');
      setTimeout(() => {
        setBreadcrumb([...breadcrumb, item]);
        setChildItems(item.children!);
        setCurrentItems(item.children!);
        setSearchValue('');
        setDebouncedSearchValue('');
        setSlideDirection('none');
      }, 300);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setSlideDirection('right');
    setTimeout(() => {
      const newBreadcrumb = breadcrumb.slice(0, index);
      const newCurrentItems = newBreadcrumb.length === 0 ? items : newBreadcrumb[newBreadcrumb.length - 1].children!;
      setBreadcrumb(newBreadcrumb);
      setChildItems(null);
      setCurrentItems(newCurrentItems);
      setSearchValue('');
      setDebouncedSearchValue('');
      setSlideDirection('none');
    }, 300);
  };

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => {
      const nextIsOpen = !prevIsOpen;
      if (!nextIsOpen) setIsPositioned(false);
      return nextIsOpen;
    });
  };

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setIsPositioned(true);
    }
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setIsPositioned(false);
    }
  }, []);

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    return (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, wait);
    };
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearchValue(query);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchValue(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updatePosition);

    const handleScroll = () => {
      updatePosition();
    };

    if (scrollBehavior === 'closest') {
      scrollContainersRef.current = findScrollContainers(buttonRef.current);
      scrollContainersRef.current.forEach((container) => {
        container.addEventListener('scroll', handleScroll);
      });

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', updatePosition);

        scrollContainersRef.current.forEach((container) => {
          container.removeEventListener('scroll', handleScroll);
        });

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else if (scrollBehavior === 'observer') {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            updatePosition();
          }
        },
        { threshold: [0] }
      );

      if (buttonRef.current && observerRef.current) {
        observerRef.current.observe(buttonRef.current);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', updatePosition);

        if (observerRef.current && buttonRef.current) {
          observerRef.current.unobserve(buttonRef.current);
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [handleClickOutside, updatePosition, scrollBehavior]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  const dropdownContent = (
    <DropdownContent
      currentItems={currentItems}
      breadcrumb={breadcrumb}
      slideDirection={slideDirection}
      isPositioned={isPositioned}
      searchValue={searchValue}
      debouncedSearchValue={debouncedSearchValue}
      menuWidth={menuWidth}
      menuHeight={menuHeight}
      portal={portal}
      position={position}
      zIndex={zIndex}
      handleItemClick={handleItemClick}
      handleBreadcrumbClick={handleBreadcrumbClick}
      handleSearchChange={handleSearchChange}
    />
  );

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        type="button"
        onClick={toggleDropdown}
      >
        Dropdown
      </button>
      {isOpen && (portal ? ReactDOM.createPortal(dropdownContent, document.body) : dropdownContent)}
    </div>
  );
};

export default Dropdown;