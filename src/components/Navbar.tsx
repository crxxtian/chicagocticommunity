import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "@/components/Logo";

const navItems = [
  { name: "Home", href: "/" },
  { name: "News", href: "/news" },
  { name: "Mini-Reports", href: "/mini-reports" },
  { name: "Discussions", href: "/discussions" },
  { name: "Resources", href: "/resources" },
  { name: "Research", href: "/research" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="border-b border-border sticky top-0 bg-background z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>

          {!isMobile ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="px-3 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <ThemeToggle />
            </div>
          ) : (
            <div className="flex items-center">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="ml-2"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 pb-4">
          <div className="flex flex-col gap-2 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm font-medium hover:bg-secondary rounded-md px-3 py-2 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
