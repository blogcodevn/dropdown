import { useState, useCallback, useRef, ReactElement, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import DropdownContent from './DropdownContent';
import useDropdownPosition from './useDropdownPosition';
import DefaultDropdownButton from './DropdownButton';
import DefaultDropdownContainer from './DropdownContainer';
import DefaultDropdownMenu from './DropdownMenu';
import getComponent, { ComponentWithRef } from './getComponent';

interface DropdownItem {
  label: string;
  children?: DropdownItem[];
}

interface Position {
  top: number;
  left: number;
  transformOrigin: string;
}

interface DropdownComponents {
  DropdownButton?: ComponentWithRef<HTMLButtonElement>;
  DropdownContainer?: ComponentWithRef<HTMLDivElement>;
  DropdownMenu?: ComponentWithRef<HTMLDivElement>;
}

interface DropdownProps {
  items: DropdownItem[];
  portal?: boolean;
  zIndex?: number;
  menuWidth?: number;
  menuHeight?: string | number;
  align?: 'left' | 'right';
  withArrow?: boolean;
  arrowSize?: number;
  arrowOffset?: number;
  searchable?: boolean;
  components?: DropdownComponents;
  children?: React.ReactNode;
  variant?: 'click' | 'hover'; // Thêm prop mới cho biến thể
}

const Dropdown: React.FC<PropsWithChildren<DropdownProps>> = ({
  items,
  portal = false,
  zIndex,
  menuWidth = 300,
  menuHeight = 'auto',
  align = 'left',
  withArrow = false,
  arrowSize = 10,
  arrowOffset = 10,
  searchable = false,
  components = {},
  children,
  variant = 'click',
}) => {
  const [currentItems, setCurrentItems] = useState<DropdownItem[]>(items);
  const [breadcrumb, setBreadcrumb] = useState<DropdownItem[]>([]);
  const [slideDirection, setSlideDirection] = useState<'none' | 'left' | 'right'>('none');
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const [hoveredItem, setHoveredItem] = useState<DropdownItem | null>(null);

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

  const handleItemHover = (item: DropdownItem) => {
    if (item.children) {
      setHoveredItem(item);
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

  const ButtonComponent = getComponent(
    components.DropdownButton,
    DefaultDropdownButton as any,
    { onClick: toggleDropdown, children } as any,
    buttonRef
  );

  const ContainerComponent = getComponent(
    components.DropdownContainer,
    DefaultDropdownContainer,
    { children: ButtonComponent },
    dropdownListRef
  );

  const MenuComponent = getComponent(
    components.DropdownMenu,
    DefaultDropdownMenu as any,
    {
      position,
      isPositioned,
      menuWidth,
      menuHeight: calculatedMenuHeight,
      zIndex,
      withArrow,
      arrowSize,
      arrowOffset,
      align,
      children: (
        <>
          <DropdownContent
            currentItems={currentItems}
            breadcrumb={breadcrumb}
            slideDirection={slideDirection}
            searchValue={searchValue}
            debouncedSearchValue={debouncedSearchValue}
            searchable={searchable}
            variant={variant}
            handleItemClick={handleItemClick}
            handleBreadcrumbClick={handleBreadcrumbClick}
            handleSearchChange={handleSearchChange}
            handleItemHover={variant === 'hover' ? handleItemHover : undefined}
          />
          {hoveredItem && hoveredItem.children && variant === 'hover' && (
            <DropdownContent
              currentItems={hoveredItem.children}
              breadcrumb={[...breadcrumb, hoveredItem]}
              slideDirection="none"
              searchValue=""
              debouncedSearchValue=""
              searchable={false}
              variant={variant}
              handleItemClick={handleItemClick}
              handleBreadcrumbClick={handleBreadcrumbClick}
              handleSearchChange={() => {}}
              handleItemHover={handleItemHover}
            />
          )}
        </>
      ),
    } as any,
    dropdownListRef
  );

  return (
    <>
      {ContainerComponent}
      {isOpen && (portal ? ReactDOM.createPortal(MenuComponent, document.body) : MenuComponent)}
    </>
  );
};

export default Dropdown;