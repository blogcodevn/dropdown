import { forwardRef, Ref } from "react";
import { MenuOption } from "./types";
import { MENU_DEFAULT_PADDING, MENU_DEFAULT_WIDTH } from "./utils";
import { MenuList } from "./MenuList";
import clsx, { ClassValue } from "clsx";

export interface MenuProps<Data extends MenuOption> {
  width?: number;
  options: Data[];
  padding?: number;
  className?: ClassValue;
}

const MenuForward = function Menu<Data extends MenuOption>(props: MenuProps<Data>, ref: Ref<HTMLDivElement>) {
  const { options, width = MENU_DEFAULT_WIDTH, padding = MENU_DEFAULT_PADDING, className } = props;

  return (
    <div ref={ref} className={clsx("bg-white", className)} style={{ width, padding: `${padding}px 0` }}>
      <MenuList options={options} />
    </div>
  );

}

export const Menu = forwardRef(MenuForward);
