import { Outlet, Link } from "react-router";
import { BookOpen } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-dashed border-pencil/30 px-6 py-4">
        <nav className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-heading text-2xl font-bold"
          >
            <div className="wobbly-sm flex h-10 w-10 items-center justify-center border-2 border-pencil bg-postit">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            Logix
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>

      <footer className="border-t-2 border-dashed border-pencil/30 px-6 py-8">
        <p className="text-center text-pencil/50">~ sketched with care ~</p>
      </footer>
    </div>
  );
}
