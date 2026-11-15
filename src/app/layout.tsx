import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Buddy - Person-First Roommate & Flatmate Discovery',
  description:
    'Find compatible roommates and flatmates in Trivandrum based on lifestyle habits, daily routines, and verified affiliations.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D9488',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        {/* WCAG Skip to Main Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:font-bold"
        >
          Skip to main content
        </a>

        {/* Desktop Sticky Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <Link href="/discover" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                B
              </span>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Buddy
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Trivandrum
              </span>
            </Link>

            <nav className="flex items-center gap-1" aria-label="Main navigation">
              <Link
                href="/discover"
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-100 transition-colors"
              >
                Discovery
              </Link>
              <Link
                href="/matches"
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-100 transition-colors"
              >
                Matches &amp; Chats
              </Link>
              <Link
                href="/profile"
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-100 transition-colors"
              >
                My Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Mathews Varghese (Infosys)
            </span>
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center font-bold text-teal-800 text-xs shadow-xs"
            >
              MV
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 flex flex-col pb-20 md:pb-6">
          {children}
        </main>

        {/* Mobile Thumb-Zone Bottom Navigation Bar */}
        <nav
          aria-label="Mobile Bottom Navigation"
          className="fixed bottom-0 inset-x-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-40 md:hidden shadow-floating"
        >
          <Link
            href="/discover"
            className="flex flex-col items-center justify-center flex-1 h-full text-slate-600 hover:text-teal-600 active:text-teal-700 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span className="text-[10px] font-bold mt-0.5">Discover</span>
          </Link>

          <Link
            href="/matches"
            className="flex flex-col items-center justify-center flex-1 h-full text-slate-600 hover:text-teal-600 active:text-teal-700 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="text-[10px] font-bold mt-0.5">Matches</span>
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center justify-center flex-1 h-full text-slate-600 hover:text-teal-600 active:text-teal-700 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
            <span className="text-[10px] font-bold mt-0.5">Profile</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
