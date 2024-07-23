import { RefAttributes } from "react";
import { createPortal } from "react-dom";
import { DropdownMenu, DropdownMenuProps } from "./DropdownMenu";
import { DropdownList, DropdownListProps } from "./DropdownList";
import { DropdownItemData } from "./types";

export const DROPDOWN_DEFAULT_MENU_WIDTH = 300;

export interface CreateDropdownMenuOptions {
  items: DropdownItemData[];
  anchor: Element | DocumentFragment;
  key?: string | null;
  menuProps?: DropdownMenuProps & RefAttributes<HTMLDivElement>;
  listProps?: Omit<DropdownListProps, 'items'>;
}

export function createDropdownMenu(options: CreateDropdownMenuOptions) {
  const { items, anchor, key, menuProps = {}, listProps = {} } = options;

  return createPortal((
    <DropdownMenu {...menuProps as DropdownMenuProps}>
      <DropdownList {...listProps} items={items} />
    </DropdownMenu>
  ), anchor, key);
}
