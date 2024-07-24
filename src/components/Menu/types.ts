export interface MenuOption {
  label: string;
  value: string | number;
  children?: MenuOption[];
}
