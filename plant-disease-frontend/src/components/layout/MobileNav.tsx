"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Sprout, Home, ScanLine, BookOpen, Clock } from "lucide-react"

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/scan", label: "Scan Plant", icon: ScanLine },
    { href: "/diseases", label: "Disease Library", icon: BookOpen },
    { href: "/history", label: "Scan History", icon: Clock },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={<button className="md:hidden inline-flex shrink-0 items-center justify-center rounded-md h-9 w-9 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors" />}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between">
        <div>
          <SheetHeader className="pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <SheetTitle className="flex items-center gap-2 text-green-600 dark:text-green-500 font-bold text-xl">
              <Sprout className="h-6 w-6" />
              <span>PlantCare AI</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 mt-6">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => onOpenChange(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                      : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-green-600 dark:text-green-400" : "text-zinc-400"}`} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <p>© {new Date().getFullYear()} PlantCare AI. All rights reserved.</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
