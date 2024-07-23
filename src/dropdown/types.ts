export interface DropdownItemData {
  label: string;
  children?: DropdownItemData[];
}

export type DropdownAnchorOrigin =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type DropdownTransformOrigin =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
