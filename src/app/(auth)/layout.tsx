import Link from 'next/link';
import { ReactNode } from 'react';
import { ChevronLeft } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto xl:px-0">
      <div className="p-5 mx:auto">
        <Link href="/" className="group flex items-center gap-2 sm:gap-4 ">
          <ChevronLeft className="" />
          <span>Back to Home</span>
        </Link>
      </div>
      <div className="flex flex-grow items-center justify-center">
        <div className="w-[320px] md:w-[428px]">{children}</div>
      </div>
    </div>
  );
}
