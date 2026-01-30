import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Shield,
  Zap,
  BarChart3,
  Globe,
  ArrowRight,
  Check,
  TrendingUp,
  Lock,
  TreePine,
} from "lucide-react";
import heroForest from "@/assets/hero-forest.jpg";

const stats = [
  { value: "2.5M+", label: "tCO2e Traded" },
  { value: "500+", label: "Verified Projects" },
  { value: "150+", label: "Companies" },
  { value: "99.9%", label: "Uptime" },
];

const features = [
  {
    icon: Shield,
    title: "Verified & Compliant",
    description:
      "Every credit is verified through ACVA standards and third-party auditors.",
  },
  {
    icon: Zap,
    title: "Instant Trading",
    description:
      "Buy and sell carbon credits instantly with blockchain-powered transactions.",
  },
  {
    icon: Lock,
    title: "Immutable Records",
    description:
      "NFT-based credits ensure full traceability and prevent double-counting.",
  },
  {
    icon: BarChart3,
    title: "AI-Powered Reports",
    description:
      "Generate ACVA-compliant verification reports automatically with AI.",
  },
];

const projectTypes = [
  { name: "Reforestation", icon: TreePine, count: "120+" },
  { name: "Renewable Energy", icon: Zap, count: "85+" },
  { name: "Conservation", icon: Globe, count: "95+" },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroForest}
            alt="Sustainable forest"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 pattern-grid z-10" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="verified" className="mb-6 animate-fade-up">
              <Leaf className="h-3 w-3 mr-1" />
              Blockchain-Verified Carbon Credits
            </Badge>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up stagger-1">
              Trade Carbon Credits
              <span className="block text-gradient-primary">
                With Confidence
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up stagger-2">
              The intelligent B2B marketplace connecting manufacturers with
              verified carbon offset projects. Transparent, compliant, and
              powered by blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up stagger-3">
              <Link to="/auth?mode=signup&role=buyer">
                <Button variant="hero" size="xl" className="gap-2">
                  Start Offsetting
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="hero-outline" size="xl">
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-up stagger-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl md:text-4xl font-bold text-gradient-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float z-20">
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Why CarbonX
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Built for Enterprise
              <span className="text-gradient-primary"> Sustainability</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete platform for buying and selling verified carbon credits
              with full regulatory compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="interactive"
                className={`p-6 animate-fade-up stagger-${index + 1}`}
              >
                <CardContent className="p-0">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              How It Works
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent
              <span className="text-gradient-primary"> Process</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            {/* Buyer Flow */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold">
                  For Buyers
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  "Register your company and complete KYC verification",
                  "Track your emissions through data uploads or integrations",
                  "Set offset targets and browse verified projects",
                  "Purchase carbon credit NFTs with your wallet",
                  "Retire credits and generate compliance reports",
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
              <Link to="/auth?mode=signup&role=buyer" className="mt-6 block">
                <Button variant="default" className="gap-2">
                  Register as Buyer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Seller Flow */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold">
                  For Sellers
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  "Register your organization and upload verification docs",
                  "Create carbon credit projects with full documentation",
                  "Generate AI-powered ACVA verification reports",
                  "Submit for third-party verification approval",
                  "Mint verified credits as NFTs and list on marketplace",
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <p className="text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
              <Link to="/auth?mode=signup&role=seller" className="mt-6 block">
                <Button variant="secondary" className="gap-2">
                  Register as Seller
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Project Categories
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Diverse Carbon Offset
              <span className="text-gradient-primary"> Projects</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {projectTypes.map((type) => (
              <Card
                key={type.name}
                variant="glow"
                className="p-8 text-center group"
              >
                <CardContent className="p-0">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <type.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">
                    {type.name}
                  </h3>
                  <p className="text-2xl font-bold text-primary">{type.count}</p>
                  <p className="text-sm text-muted-foreground">
                    Verified Projects
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <Card variant="glow" className="max-w-3xl mx-auto p-12 text-center">
            <CardContent className="p-0">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Make an Impact?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join the leading B2B carbon credit marketplace. Start trading
                verified credits today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="xl" className="gap-2">
                    Create Account
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" size="xl">
                    View Marketplace
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
