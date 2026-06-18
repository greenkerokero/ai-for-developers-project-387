import { Outlet, Link } from "react-router-dom";
import { UI } from "@/lib/dictionary";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">{UI.nav.home}</span>
          </Link>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-4">
              <Link
                to="/events"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {UI.nav.events}
              </Link>
              <Link
                to="/owner"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {UI.nav.management}
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container flex-1 py-8">
        <Outlet />
      </main>
    </div>
  );
}
