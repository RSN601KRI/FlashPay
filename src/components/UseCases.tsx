import { Camera, Code2, Truck, Paintbrush, Headphones, FileText } from "lucide-react";

const useCases = [
  {
    icon: Code2,
    title: "Freelance Developers",
    description: "Automated payments for code commits, feature completions, and project milestones",
    stats: "Average 40% faster payments",
    color: "from-blue-500 to-purple-600"
  },
  {
    icon: Camera,
    title: "Content Creators",
    description: "Instant micropayments for views, likes, and subscriber milestones across platforms",
    stats: "Real-time revenue tracking",
    color: "from-pink-500 to-orange-500"
  },
  {
    icon: Truck,
    title: "Delivery & Rideshare",
    description: "Immediate payment upon delivery confirmation and customer rating",
    stats: "Sub-second settlements",
    color: "from-green-500 to-teal-600"
  },
  {
    icon: Paintbrush,
    title: "Digital Artists",
    description: "Automated royalty distributions and commission payments for NFT sales",
    stats: "Zero processing fees",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Headphones,
    title: "Virtual Assistants",
    description: "Task-based payments with AI verification of work completion quality",
    stats: "95% automation rate",
    color: "from-indigo-500 to-blue-600"
  },
  {
    icon: FileText,
    title: "Writers & Translators",
    description: "Per-word or milestone payments with automated quality assessment",
    stats: "Instant global payments",
    color: "from-yellow-500 to-red-500"
  }
];

const UseCases = () => {
  return (
    <section id="use-cases" className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Built for <span className="text-gradient">Every</span> Gig Worker
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            From freelancers to content creators, FlashPay powers instant payments across all digital work
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-xl hover-glow hover:scale-105 transition-all duration-300 animate-slide-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon with gradient background */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <useCase.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {useCase.title}
              </h3>
              <p className="text-foreground/70 mb-4 leading-relaxed">
                {useCase.description}
              </p>

              {/* Stats badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full glass text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></div>
                {useCase.stats}
              </div>
            </div>
          ))}
        </div>

        {/* Integration Showcase */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-gradient">Seamless</span> Platform Integration
            </h3>
            <p className="text-foreground/80">
              Works with popular freelance and gig economy platforms
            </p>
          </div>

          {/* Platform logos/cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Upwork", "Fiverr", "Uber", "DoorDash"].map((platform, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-lg text-center hover-glow hover:scale-105 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{platform[0]}</span>
                </div>
                <h4 className="font-medium text-foreground">{platform}</h4>
                <p className="text-xs text-foreground/60 mt-1">Integration Ready</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;