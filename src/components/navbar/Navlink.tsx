import { type NavItem } from "@/components/types";
import Link from "next/link";

interface NavlinkProps {
  items?: NavItem[];
}

export function Navlink({ items }: NavlinkProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={
                    "flex items-center rounded-lg px-2 py-1 text-lg   font-semibold text-primary hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-80 sm:text-sm"
                  }
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  );
}
