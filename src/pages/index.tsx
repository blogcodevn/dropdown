import { Menu } from "@/components/Menu/Menu";
import { MenuOption } from "@/components/Menu/types";
import { Dropdown } from "@/dropdown/Dropdown";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const items: MenuOption[] = [
  {
    label: 'Item 1',
    value: 'item-1',
    children: [
      {
        label: 'Sub Item 1-1',
        value: 'sub-item-1-1',
        children: [
          { label: 'Sub Sub Item 1-1-1', value: 'sub-sub-item-1-1-1' },
          { label: 'Sub Sub Item 1-1-2', value: 'sub-sub-item-1-1-2' },
          { label: 'Sub Sub Item 1-1-3', value: 'sub-sub-item-1-1-3' },
          { label: 'Sub Sub Item 1-1-4', value: 'sub-sub-item-1-1-4' },
          { label: 'Sub Sub Item 1-1-5', value: 'sub-sub-item-1-1-5' },
          { label: 'Sub Sub Item 1-1-6', value: 'sub-sub-item-1-1-6' },
          { label: 'Sub Sub Item 1-1-7', value: 'sub-sub-item-1-1-7' },
          { label: 'Sub Sub Item 1-1-8', value: 'sub-sub-item-1-1-8' },
          { label: 'Sub Sub Item 1-1-9', value: 'sub-sub-item-1-1-9' },
          { label: 'Sub Sub Item 1-1-10', value: 'sub-sub-item-1-1-10' },
        ],
      },
      { label: 'Sub Item 1-2', value: 'sub-item-1-2' },
      { label: 'Sub Item 1-3', value: 'sub-item-1-3' },
      { label: 'Sub Item 1-4', value: 'sub-item-1-4' },
    ],
  },
  { label: 'Item 2', value: 'item-2' },
  { label: 'Item 3', value: 'item-3' },
  { label: 'Item 4', value: 'item-4' },
  { label: 'Item 5', value: 'item-5' },
  { label: 'Item 6', value: 'item-6' },
  { label: 'Item 7', value: 'item-7' },
  { label: 'Item 8', value: 'item-8' },
  { label: 'Item 9', value: 'item-9' },
  { label: 'Item 10', value: 'item-10' },
  { label: 'Item 11', value: 'item-11' },
  { label: 'Item 12', value: 'item-12' },
  { label: 'Item 13', value: 'item-13' },
  { label: 'Item 14', value: 'item-14' },
  { label: 'Item 15', value: 'item-15' },
  { label: 'Item 16', value: 'item-16' },
  { label: 'Item 17', value: 'item-17' },
  { label: 'Item 18', value: 'item-18' },
  { label: 'Item 19', value: 'item-19' },
  { label: 'Item 20', value: 'item-20' },
  { label: 'Item 21', value: 'item-21' },
  { label: 'Item 22', value: 'item-22' },
  { label: 'Item 23', value: 'item-23' },
  { label: 'Item 24', value: 'item-24' },
  { label: 'Item 25', value: 'item-25' },
  { label: 'Item 26', value: 'item-26' },
  { label: 'Item 27', value: 'item-27' },
  { label: 'Item 28', value: 'item-28' },
  { label: 'Item 29', value: 'item-29' },
];

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 min-h-[200dvh] ${inter.className}`}
    >
      <Menu options={items} />
      {/* <div className="h-[500px] overflow-y-auto w-full mt-[500px]" style={{ backgroundColor: 'rgba(255, 0, 0, 0.5)' }}>
        <div className="h-[1000px] w-full" style={{ backgroundColor: 'rgba(0, 255, 0, 0.5)' }}>
          <Dropdown items={items}>
            Dropdown
          </Dropdown>
        </div>
      </div> */}
    </main>
  );
}
