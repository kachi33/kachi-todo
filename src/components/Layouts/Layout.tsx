import Link from "next/link";
import ThemeToggle from "../ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }: any) => {
  return (
    <main className="min-h-screen bg-background lg:p-4  transition-colors">
      <header className="flex justify-between items-center p-4 md:p-6 lg:px-8 ">
        <h1 className="md:text-2xl lg:text-3xl text-xl font-bold text-foreground">
          <Link href="/">
            Kachi <span className="text-amber-700 lg:text-4xl">ToDo</span>
          </Link>
        </h1>
        <ThemeToggle />
      </header>
      <div className="flex max-w-2xl mx-auto justify-center items-center gap-2 md:gap-4">
        {children}
      </div>
    </main>
  );
};

export default Layout;
