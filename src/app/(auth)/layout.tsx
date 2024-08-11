import ArrowChevronBack from '@/svg_components/ArrowChevronBack';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto xl:px-0">
      <div className="pt-8 mx:auto">
        <Link href="/" className="group flex items-center gap-2 sm:gap-4">
          <ArrowChevronBack className="stroke-foreground group-hover:stroke-muted-foreground" />
          <span className="group-hover:text-muted-foreground">Back to Home</span>
        </Link>
      </div>
      <div className="flex flex-grow items-center justify-center">
        <div className="w-[320px] md:w-[428px]">{children}</div>
      </div>
    </div>
  );
}
