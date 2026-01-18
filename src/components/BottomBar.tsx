"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Users,
  PlusCircle,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const bottomNavItems = [
  { name: "Groups", href: "/dashboard", icon: Users },
  { name: "Activity", href: "/activity", icon: History },
  { name: "Add", href: "/add-expense", icon: PlusCircle, isAction: true },
  { name: "Friends", href: "/friends", icon: LayoutDashboard },
  { name: "Account", href: "/profile", icon: UserCircle },
];

export function BottomBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background/95 backdrop-blur border-t border-white/10 md:hidden">
      <div className="grid h-full grid-cols-5 mx-auto">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center group"
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-white",
                )}
              >
                {/* Special styling for the 'Add' action button */}
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    item.isAction && "h-7 w-7 text-primary mb-1",
                  )}
                />
                {!item.isAction && (
                  <span className="text-[10px] font-medium tracking-wide">
                    {item.name}
                  </span>
                )}
              </div>

              {/* Active Indicator Dot */}
              {isActive && !item.isAction && (
                <div className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
