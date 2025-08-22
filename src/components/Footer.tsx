import { Github, Twitter, Linkedin, Mail, Globe, Shield, Zap } from "lucide-react";
import flashpayLogo from "@/assets/flashpay-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/20">
      {/* Main Footer */}
      <div className="glass py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src={flashpayLogo} 
                  alt="FlashPay" 
                  className="h-8 w-8 animate-pulse-glow"
                />
                <span className="text-xl font-bold text-gradient">FlashPay</span>
              </div>
              <p className="text-foreground/70 mb-6 max-w-md">
                AI-powered micro-payments wallet revolutionizing how gig workers get paid. 
                Instant, gasless, and secure cross-border transactions.
              </p>
              
              {/* Key features */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2 glass-card px-3 py-1 rounded-full">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-xs">Instant</span>
                </div>
                <div className="flex items-center space-x-2 glass-card px-3 py-1 rounded-full">
                  <Shield className="h-3 w-3 text-accent" />
                  <span className="text-xs">Secure</span>
                </div>
                <div className="flex items-center space-x-2 glass-card px-3 py-1 rounded-full">
                  <Globe className="h-3 w-3 text-primary" />
                  <span className="text-xs">Global</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover-glow hover:scale-105 transition-all duration-300">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover-glow hover:scale-105 transition-all duration-300">
                  <Github className="h-4 w-4" />
                </a>
                <a href="#" className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover-glow hover:scale-105 transition-all duration-300">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover-glow hover:scale-105 transition-all duration-300">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-foreground/70 hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="text-foreground/70 hover:text-primary transition-colors">
                    Use Cases
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    SDKs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    About Innovax
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    Press Kit
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="glass-card border-t border-border/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-foreground/60 text-sm mb-4 md:mb-0">
              © 2025 FlashPay by Innovax. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;