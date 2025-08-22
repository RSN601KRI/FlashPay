import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Wallet } from "lucide-react";
import flashpayLogo from "@/assets/flashpay-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={flashpayLogo} 
              alt="FlashPay" 
              className="h-8 w-8 animate-pulse-glow"
            />
            <span className="text-xl font-bold text-gradient">FlashPay</span>
          </div>

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
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
            <Button variant="hero" className="hover-glow">
              <Zap className="h-4 w-4 mr-2" />
              Get Started
            </Button>
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
                <Button variant="ghost" className="justify-start">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
                <Button variant="hero" className="hover-glow justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;