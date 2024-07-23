import React, { forwardRef, PropsWithChildren } from 'react';

const DropdownContainer = forwardRef<HTMLDivElement, PropsWithChildren<{}>>(({ children, ...rest }, ref) => {
  return (
    <div ref={ref} {...rest} className="relative inline-block text-left">
      {children}
    </div>
  );
});

DropdownContainer.displayName = 'DropdownContainer';

export default DropdownContainer;