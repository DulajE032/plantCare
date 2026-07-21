import Link from "next/link"
import { Sprout } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-green-600 dark:text-green-500 font-bold text-xl">
              <Sprout className="h-6 w-6" />
              <span>PlantCare AI</span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Empowering farmers and plant enthusiasts with deep learning plant disease diagnostics and actionable treatment recommendations.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Scan Plant</Link>
              </li>
              <li>
                <Link href="/diseases" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Disease Library</Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Scan History</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Agricultural Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">AI Model Docs</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Support Forum</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>Email: contact@plantcare.ai</li>
              <li>Phone: +1 (555) 019-2834</li>
              <li>Location: Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} PlantCare AI. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Designed for crop protection.
          </p>
        </div>
      </div>
    </footer>
  )
}
