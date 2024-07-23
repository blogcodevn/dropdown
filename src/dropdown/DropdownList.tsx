import { FC, MouseEvent, useRef } from "react";
import { DropdownItemData } from "./types";

export interface DropdownListProps {
  items: DropdownItemData[];
  variant?: 'click' | 'hover';
}

export const DropdownList: FC<DropdownListProps> = (props) => {
  const { items, variant = "click" } = props;
  const hoverItem = useRef<HTMLButtonElement>();

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    if (variant === "click") {
      return;
    }

    hoverItem.current = e.currentTarget;
  };

  return (
    <div>
      {items.map((item, index) => (
        <button
          key={index}
          // onClick={() => handleItemClick(item)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          // onMouseEnter={variant === 'hover' && handleItemHover ? () => handleItemHover(item) : undefined}
          onMouseEnter={handleMouseEnter}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};