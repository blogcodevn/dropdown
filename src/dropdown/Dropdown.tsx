import { FC, PropsWithChildren, RefObject } from "react";
import { useDropdownPosition } from "./useDropdownPosition";
import { createPortal } from "react-dom";
import { DropdownMenu, DropdownMenuProps } from "./DropdownMenu";
import { createDropdownMenu, DROPDOWN_DEFAULT_MENU_WIDTH } from "./utils";
import { DropdownList, DropdownListProps } from "./DropdownList";



export interface DropdownProps extends DropdownListProps, Omit<DropdownMenuProps, 'anchor'> {}

export const Dropdown: FC<PropsWithChildren<DropdownProps>> = (props) => {
  const {
    menuWidth = DROPDOWN_DEFAULT_MENU_WIDTH,
    items,
  } = props;

  const { buttonRef, menuRef, isOpen, setIsOpen } = useDropdownPosition();
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          ref={buttonRef as RefObject<HTMLButtonElement>}
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={toggleDropdown}
        >
          Dropdown
        </button>
      </div>
      {isOpen && typeof document !== "undefined" && createDropdownMenu({
        items,
        anchor: document.body,
        menuProps: {
          ref: menuRef,
          menuWidth,
          anchor: buttonRef,
        },
      })}
    </>
  );
};
