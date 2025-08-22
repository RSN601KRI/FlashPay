import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Globe, Cpu } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-24 pb-16 px-4">
      <div className="container mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-8 animate-slide-up">
          <Cpu className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground/80">Powered by AI & Yellow SDK</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
          <span className="text-gradient">AI-Powered</span><br />
          Micro-Payments for<br />
          <span className="text-primary">Gig Workers</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-8 animate-slide-up">
          Instant, gasless cross-border payments with AI automation. 
          Web2 experience meets Web3 trustlessness for freelancers and gig workers worldwide.
        </p>

        {/* Key Benefits */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-10 animate-slide-up">
          <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm">Instant Payments</span>
          </div>
          <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-sm">Zero Gas Fees</span>
          </div>
          <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-sm">Cross-Border</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up">
          <Button size="lg" variant="hero" className="hover-glow px-8 py-3 text-lg">
            Start Earning Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary px-8 py-3 text-lg">
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slide-up">
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">$50M+</div>
            <div className="text-sm text-foreground/60">Processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">100K+</div>
            <div className="text-sm text-foreground/60">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">&lt;1s</div>
            <div className="text-sm text-foreground/60">Settlement Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">0%</div>
            <div className="text-sm text-foreground/60">Gas Fees</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;