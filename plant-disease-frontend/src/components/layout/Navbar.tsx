"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Sprout, Home, ScanLine, BookOpen, Clock } from "lucide-react"
import { MobileNav } from "./MobileNav"

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/scan", label: "Scan Plant", icon: ScanLine },
    { href: "/diseases", label: "Disease Library", icon: BookOpen },
    { href: "/history", label: "Scan History", icon: Clock },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-green-600 dark:text-green-500 font-bold text-xl">
          <Sprout className="h-6 w-6" />
          <span>PlantCare AI</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
        </div>
      </div>
    </header>
  )
}
