import React, { forwardRef, PropsWithChildren } from 'react';

interface DropdownButtonProps {
  onClick: () => void;
}

const DropdownButton = forwardRef<HTMLButtonElement, PropsWithChildren<DropdownButtonProps>>(({ onClick, children }, ref) => {
  return (
    <button
      ref={ref}
      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
});

DropdownButton.displayName = 'DropdownButton';

export default DropdownButton;