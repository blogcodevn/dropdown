import { forwardRef, useMemo } from 'react';
import classNames from 'classnames';

interface DropdownItem {
  label: string;
  children?: DropdownItem[];
}

interface DropdownContentProps {
  currentItems: DropdownItem[];
  breadcrumb: DropdownItem[];
  slideDirection: 'none' | 'left' | 'right';
  isPositioned: boolean;
  searchValue: string;
  debouncedSearchValue: string;
  menuWidth: number;
  menuHeight: string | number;
  portal: boolean;
  position: { top: number; left: number; transformOrigin: string };
  zIndex?: number;
  withArrow?: boolean;
  arrowSize?: number;
  arrowOffset?: number;
  align: 'left' | 'right';
  searchable: boolean;
  handleItemClick: (item: DropdownItem) => void;
  handleBreadcrumbClick: (index: number) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(({
  currentItems,
  breadcrumb,
  slideDirection,
  isPositioned,
  searchValue,
  debouncedSearchValue,
  menuWidth,
  menuHeight,
  portal,
  position,
  zIndex,
  withArrow = false,
  arrowSize = 10,
  arrowOffset = 10,
  align,
  searchable,
  handleItemClick,
  handleBreadcrumbClick,
  handleSearchChange,
}, ref) => {
  const filteredItems = useMemo(() => {
    if (debouncedSearchValue === '') return currentItems;
    return currentItems.filter((item) =>
      item.label.toLowerCase().includes(debouncedSearchValue.toLowerCase())
    );
  }, [debouncedSearchValue, currentItems]);

  const arrowStyle = {
    left: align === 'left' ? arrowOffset : undefined,
    right: align === 'right' ? arrowOffset : undefined,
    top: position.transformOrigin === 'top' ? -arrowSize : undefined,
    bottom: position.transformOrigin === 'bottom' ? -arrowSize : undefined,
    borderTopWidth: position.transformOrigin === 'bottom' ? `${arrowSize}px` : undefined,
    borderBottomWidth: position.transformOrigin === 'top' ? `${arrowSize}px` : undefined,
    borderLeftWidth: `${arrowSize}px`,
    borderRightWidth: `${arrowSize}px`,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: position.transformOrigin === 'top' ? 'white' : 'transparent',
    borderTopColor: position.transformOrigin === 'bottom' ? 'white' : 'transparent',
  };

  return (
    <div
      ref={ref}
      className={classNames(
        "absolute mt-2 rounded-md bg-white ring-1 ring-black ring-opacity-5 transition-transform transition-opacity duration-300 shadow-lg",
        {
          "dropdown-enter": !isPositioned,
          "dropdown-enter-active": isPositioned,
          "dropdown-exit": !isPositioned,
          "dropdown-exit-active": !isPositioned,
        }
      )}
      style={{
        top: portal ? position.top : 'auto',
        left: portal ? position.left : 'auto',
        opacity: isPositioned ? 1 : 0,
        transformOrigin: position.transformOrigin,
        width: `${menuWidth}px`,
        zIndex: zIndex,
        maxHeight: menuHeight,
        transform: isPositioned ? 'scaleX(1) scaleY(1)' : 'scaleX(0) scaleY(0)',
      }}
    >
      {withArrow && (
        <div
          className="absolute"
          style={{
            ...arrowStyle,
            width: 0,
            height: 0,
            zIndex: zIndex ? zIndex + 1 : undefined,
          }}
        />
      )}
      <div className="relative overflow-hidden">
        {searchable && (
          <div className="p-2">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 text-gray-900"
            />
          </div>
        )}
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
              {breadcrumb.length > 0 &&
                breadcrumb[breadcrumb.length - 1].children?.map((item, index) => (
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
    </div>
  );
});

DropdownContent.displayName = 'DropdownContent';

export default DropdownContent;