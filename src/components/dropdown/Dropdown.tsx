import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

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
}

const Dropdown: React.FC<DropdownProps> = ({ items, portal = false, zIndex, menuWidth = 300, menuHeight = 'auto' }) => {
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
  const panelRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      panelRef.current &&
      !panelRef.current.contains(event.target as Node) &&
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleClickOutside, updatePosition]);

  useEffect(() => {
    if (isOpen && buttonRef.current && panelRef.current) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  const filteredItems = useMemo(() => {
    if (debouncedSearchValue === '') return currentItems;
    return currentItems.filter((item) =>
      item.label.toLowerCase().includes(debouncedSearchValue.toLowerCase())
    );
  }, [debouncedSearchValue, currentItems]);

  const dropdownContent = (
    <div
      ref={panelRef}
      className={classNames(
        "absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-x-hidden",
        {
          "dropdown-enter": !isOpen,
          "dropdown-enter-active": isOpen && isPositioned,
          "dropdown-exit": !isOpen,
          "dropdown-exit-active": !isOpen && isPositioned,
        }
      )}
      style={{
        top: portal ? position.top : 'auto',
        left: portal ? position.left : 'auto',
        opacity: isPositioned ? 1 : 0,
        transformOrigin: 'top',
        width: `${menuWidth}px`,
        zIndex: zIndex,
      }}
    >
      <div className="p-2">
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 text-gray-900"
        />
        {breadcrumb.length > 0 && (
          <div className="flex items-center mb-2">
            {breadcrumb.map((item, index) => (
              <button
                key={index}
                onClick={() => handleBreadcrumbClick(index)}
                className="text-sm text-gray-500 hover:underline mr-2"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        className={classNames("overflow-auto", {
          'transition-transform-left': slideDirection === 'left',
          'transition-transform-right': slideDirection === 'right',
          'no-transition': slideDirection === 'none',
        })}
        style={{ maxHeight: menuHeight }}
      >
        <div style={{ width: '200%', display: 'flex' }}>
          <div className="w-1/2">
            {filteredItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="w-1/2">
            {childItems && childItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
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