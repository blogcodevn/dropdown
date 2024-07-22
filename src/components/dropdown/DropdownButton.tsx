import { forwardRef } from "react";
import { DropdownValue } from "./DropdownValue";

export const DropdownButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function DropdownButton(props, ref) {
    return (
      <button {...props}>
        <DropdownValue />
      </button>
    );
  }
);