import { forwardRef } from "react";

export interface DropdownValueProps {}

export const DropdownValue = forwardRef<HTMLDivElement, DropdownValueProps>(
  function DropdownValue(props, ref) {
    return (
      <div>
        Dropdown value
      </div>
    );
  }
);