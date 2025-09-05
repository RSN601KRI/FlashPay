import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Wallet, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import flashpayLogo from "@/assets/flashpay-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={flashpayLogo} 
              alt="FlashPay" 
              className="h-8 w-8 animate-pulse-glow"
            />
            <span className="text-xl font-bold text-gradient">FlashPay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#use-cases" className="text-foreground/80 hover:text-primary transition-colors">
              Use Cases
            </a>
            <a href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#integrations" className="text-foreground/80 hover:text-primary transition-colors">
              Integrations
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    <Wallet className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={signOut} className="text-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero" className="hover-glow">
                    <Zap className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg glass"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 glass-card mt-2 rounded-lg animate-slide-up">
            <div className="flex flex-col space-y-4 px-4">
              <a href="#features" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Features
              </a>
              <a href="#use-cases" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Use Cases
              </a>
              <a href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors py-2">
                How It Works
              </a>
              <a href="#integrations" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Integrations
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/20">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="ghost" className="justify-start w-full">
                        <Wallet className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={signOut} className="justify-start w-full text-destructive hover:text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="ghost" className="justify-start w-full">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button variant="hero" className="hover-glow justify-start w-full">
                        <Zap className="h-4 w-4 mr-2" />
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;