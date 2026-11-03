import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InstaDown - Instagram Video & Photo Downloader',
  description: 'Download Instagram posts, reels, and IGTV videos without watermark. Fast, free, and no login required.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                </svg>
                <span className="text-xl font-bold">InstaDown</span>
              </div>
              <nav className="hidden md:flex gap-6">
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How it works</a>
                <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t py-12 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold mb-3">InstaDown</h3>
                  <p className="text-sm text-muted-foreground">
                    Free Instagram downloader. No watermarks, no login required.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Legal</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/privacy" className="hover:text-foreground">Privacy Policy</a></li>
                    <li><a href="/terms" className="hover:text-foreground">Terms of Service</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Support</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
                    <li><a href="mailto:support@instadown.example" className="hover:text-foreground">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                <p>© 2026 InstaDown. For personal use only. Respect copyright and Instagram's Terms of Service.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
