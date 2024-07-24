import { MenuItem } from "./MenuItem";
import { MenuOption } from "./types";

export interface MenuListProps {
  options: MenuOption[];
}

export const MenuList = (props: MenuListProps) => {
  const { options } = props;

  return (
    <div className="w-full">
      {options.map((option) => (
        <MenuItem option={option} key={option.value} />
      ))}
    </div>
  );
};
