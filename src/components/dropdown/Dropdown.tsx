import { useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import DropdownContent from './DropdownContent';
import useDropdownPosition from './useDropdownPosition';

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
  align?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  portal = false,
  zIndex,
  menuWidth = 300,
  menuHeight = 'auto',
  align = 'left',
}) => {
  const [currentItems, setCurrentItems] = useState<DropdownItem[]>(items);
  const [breadcrumb, setBreadcrumb] = useState<DropdownItem[]>([]);
  const [slideDirection, setSlideDirection] = useState<'none' | 'left' | 'right'>('none');
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');

  const handleItemClick = (item: DropdownItem) => {
    if (item.children) {
      setSlideDirection('left');
      setTimeout(() => {
        setBreadcrumb([...breadcrumb, item]);
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
      setCurrentItems(newCurrentItems);
      setSearchValue('');
      setDebouncedSearchValue('');
      setSlideDirection('none');
    }, 300);
  };

  const {
    buttonRef,
    dropdownListRef,
    position,
    isPositioned,
    calculatedMenuHeight,
    isOpen,
    setIsOpen,
  } = useDropdownPosition({ menuHeight, align });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const dropdownContent = (
    <DropdownContent
      currentItems={currentItems}
      breadcrumb={breadcrumb}
      slideDirection={slideDirection}
      isPositioned={isPositioned}
      searchValue={searchValue}
      debouncedSearchValue={debouncedSearchValue}
      menuWidth={menuWidth}
      menuHeight={calculatedMenuHeight}
      portal={portal}
      position={position}
      zIndex={zIndex}
      handleItemClick={handleItemClick}
      handleBreadcrumbClick={handleBreadcrumbClick}
      handleSearchChange={handleSearchChange}
      ref={dropdownListRef}
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