import { FC } from "react";
import { MenuOption } from "./types";

export interface MenuItemProps {
  option: MenuOption;

}

export const MenuItem: FC<MenuItemProps> = (props) => {
  const { option } = props;

  return (
    <div className="relative">
      <button type="button">
        {option.label}
      </button>
    </div>
  );
};