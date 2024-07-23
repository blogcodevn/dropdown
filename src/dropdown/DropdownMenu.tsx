import { forwardRef, PropsWithChildren, RefObject, useEffect, useMemo, useRef } from "react";
import { DROPDOWN_DEFAULT_MENU_WIDTH } from "./utils";

export interface DropdownMenuProps {
  menuWidth?: number;
  menuHeight?: number;
  anchor: RefObject<HTMLElement>;
}

export const DropdownMenu = forwardRef<HTMLDivElement, PropsWithChildren<DropdownMenuProps>>(
  function DropdownMenu(props, ref) {
    const {
      children,
      menuWidth = DROPDOWN_DEFAULT_MENU_WIDTH,
      menuHeight,
    } = props;

    const menuStyle = useMemo(() => ({
      width: menuWidth,
      maxHeight: menuHeight,
    }), [menuWidth, menuHeight]);

    return (
      <div
        ref={ref}
        className="absolute bg-white rounded-md shadow-lg"
        style={{
          opacity: 0,
        }}
      >
        <div className="" style={menuStyle}>
          {children}
        </div>
      </div>
    );
  }
);