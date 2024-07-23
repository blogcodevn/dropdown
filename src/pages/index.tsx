import Image from "next/image";
import { Inter } from "next/font/google";
import Dropdown from "@/components/dropdown/Dropdown";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const items = [
  {
    label: 'Item 1',
    children: [
      {
        label: 'Sub Item 1-1',
        children: [
          { label: 'Sub Sub Item 1-1-1' },
          { label: 'Sub Sub Item 1-1-2' },
          { label: 'Sub Sub Item 1-1-3' },
          { label: 'Sub Sub Item 1-1-4' },
          { label: 'Sub Sub Item 1-1-5' },
          { label: 'Sub Sub Item 1-1-6' },
          { label: 'Sub Sub Item 1-1-7' },
          { label: 'Sub Sub Item 1-1-8' },
          { label: 'Sub Sub Item 1-1-9' },
          { label: 'Sub Sub Item 1-1-10' },
        ],
      },
      { label: 'Sub Item 1-2' },
      { label: 'Sub Item 1-3' },
      { label: 'Sub Item 1-4' },
    ],
  },
  { label: 'Item 2' },
  { label: 'Item 3' },
  { label: 'Item 4' },
  { label: 'Item 5' },
  { label: 'Item 6' },
  { label: 'Item 7' },
  { label: 'Item 8' },
  { label: 'Item 9' },
  { label: 'Item 10' },
  { label: 'Item 11' },
  { label: 'Item 12' },
  { label: 'Item 13' },
  { label: 'Item 14' },
  { label: 'Item 15' },
  { label: 'Item 16' },
  { label: 'Item 17' },
  { label: 'Item 18' },
  { label: 'Item 19' },
  { label: 'Item 20' },
  { label: 'Item 21' },
  { label: 'Item 22' },
  { label: 'Item 23' },
  { label: 'Item 24' },
  { label: 'Item 25' },
  { label: 'Item 26' },
  { label: 'Item 27' },
  { label: 'Item 28' },
  { label: 'Item 29' },
];

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 min-h-[200dvh] ${inter.className}`}
    >
      <div className="h-[500px] overflow-y-auto w-full mt-[500px]" style={{ backgroundColor: 'rgba(255, 0, 0, 0.5)' }}>
        <div className="h-[1000px] w-full" style={{ backgroundColor: 'rgba(0, 255, 0, 0.5)' }}>
          <Dropdown items={items} portal={true} zIndex={999} menuWidth={400} withArrow />
        </div>
      </div>
    </main>
  );
}
