import React, { forwardRef, PropsWithChildren, useMemo } from 'react';

interface Position {
  top: number;
  left: number;
  transformOrigin: string;
}

interface DropdownMenuProps {
  position: Position;
  isPositioned: boolean;
  menuWidth: number;
  menuHeight: string | number;
  zIndex?: number;
  withArrow?: boolean;
  arrowSize?: number;
  arrowOffset?: number;
  align: 'left' | 'right';
  children: React.ReactNode;
}

const DropdownMenu = forwardRef<HTMLDivElement, PropsWithChildren<DropdownMenuProps>>(({
  position,
  isPositioned,
  menuWidth,
  menuHeight,
  zIndex,
  withArrow = false,
  arrowSize = 10,
  arrowOffset = 10,
  align,
  children,
}, ref) => {
  const arrowStyle = useMemo(() => ({
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
  }), [align, arrowOffset, arrowSize, position.transformOrigin]);

  const calculatedMenuHeight = useMemo(() => {
    if (typeof menuHeight === 'number') {
      return `${menuHeight}px`;
    }
    return menuHeight;
  }, [menuHeight]);

  return (
    <div
      ref={ref}
      className="absolute mt-2 rounded-md bg-white ring-1 ring-black ring-opacity-5 transition-transform transition-opacity duration-300 shadow-lg"
      style={{
        top: position.top,
        left: position.left,
        opacity: isPositioned ? 1 : 0,
        transformOrigin: position.transformOrigin,
        width: `${menuWidth}px`,
        zIndex: zIndex,
        maxHeight: calculatedMenuHeight,
        height: calculatedMenuHeight,
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
      <div className="relative overflow-auto">
        {children}
      </div>
    </div>
  );
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;