"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ScanLine, BookOpen, Clock, User } from "lucide-react"

export function BottomTabBar() {
  const pathname = usePathname()

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/scan", label: "Scan", icon: ScanLine },
    { href: "/diseases", label: "Library", icon: BookOpen },
    { href: "/history", label: "History", icon: Clock },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-100 dark:border-zinc-800 backdrop-blur-md pb-[safe-area-inset-bottom]">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-green-600 dark:text-green-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Icon
                className={`h-5.5 w-5.5 mb-1 transition-transform ${
                  isActive ? "scale-110 text-green-600 dark:text-green-400 fill-green-50 dark:fill-green-950/20" : "text-zinc-400"
                }`}
              />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
