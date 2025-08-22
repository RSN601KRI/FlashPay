import { Bot, Zap, Shield, Globe, Clock, Wallet, Code, Users } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Automation",
    description: "Smart milestone detection and automated payments based on task completion verification",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Instant Settlements",
    description: "Real-time payments without traditional banking delays or high fees",
    color: "text-accent"
  },
  {
    icon: Shield,
    title: "Gasless Transactions",
    description: "Zero gas fees with ERC-7824 state channels and Yellow SDK integration",
    color: "text-primary"
  },
  {
    icon: Globe,
    title: "Cross-Border Ready",
    description: "Seamless international payments for global freelance marketplaces",
    color: "text-accent"
  },
  {
    icon: Clock,
    title: "Milestone-Based",
    description: "Automated escrow and release based on predefined work milestones",
    color: "text-primary"
  },
  {
    icon: Wallet,
    title: "Chain Agnostic",
    description: "Works across multiple blockchains for maximum flexibility and reach",
    color: "text-accent"
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Easy API integration for existing platforms and marketplaces",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Web2 UX",
    description: "Familiar user experience hiding blockchain complexity from end users",
    color: "text-accent"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Revolutionary</span> Features
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Built with cutting-edge AI and blockchain technology to solve real problems for gig workers
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-xl hover-glow hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg gradient-primary mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;