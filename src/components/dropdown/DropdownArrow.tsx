import { forwardRef } from "react";

export interface DropdownArrowProps {}

export const DropdownArrow = forwardRef<HTMLDivElement, DropdownArrowProps>(
  function DropdownArrow(props, ref) {
    return (
      <div>
        <span className="-rotate-90">&lsaquo;</span>
      </div>
    );
  }
);
