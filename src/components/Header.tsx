import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, History, Gift, Trash2 } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Gift className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">GiftGenius</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="default" size="default" className="hidden md:inline-flex items-center gap-2">
                <Search size={20} />
                New Search
              </Button>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/results-history" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                <History size={20} />
                Results History
              </Link>
              <Link to="/lists" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Gift size={20} />
                Saved Lists
              </Link>
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>

            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            <Link to="/" className="block" onClick={() => setIsMenuOpen(false)}>
              <Button variant="default" size="default" className="w-full flex items-center justify-center gap-2">
                <Search size={20} />
                New Search
              </Button>
            </Link>
            <Link 
              to="/results-history" 
              className="block text-foreground hover:text-primary py-2 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <History size={20} />
              Results History
            </Link>
            <Link 
              to="/lists" 
              className="block text-foreground hover:text-primary py-2 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Gift size={20} />
              Saved Lists
            </Link>
            <div className="pt-4">
              <ThemeToggle />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;