import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingDown,
  Target,
  ShoppingCart,
  FileText,
  ArrowRight,
  Leaf,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

// Mock data for dashboard
const mockEmissions = {
  current: 12500,
  baseline: 15000,
  target: 5000,
  offset: 2000,
};

const mockRecentPurchases = [
  {
    id: "1",
    name: "Amazon Rainforest Preservation",
    volume: 500,
    date: "2024-01-15",
    status: "retired",
  },
  {
    id: "2",
    name: "Solar Farm Initiative",
    volume: 300,
    date: "2024-01-10",
    status: "verified",
  },
  {
    id: "3",
    name: "Wind Energy Farm",
    volume: 200,
    date: "2024-01-05",
    status: "pending",
  },
];

export default function BuyerDashboard() {
  const { user } = useAuth();

  const netEmissions = mockEmissions.current - mockEmissions.offset;
  const progressToTarget = ((mockEmissions.baseline - netEmissions) / (mockEmissions.baseline - mockEmissions.target)) * 100;
  const remainingOffset = netEmissions - mockEmissions.target;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Welcome back, <span className="text-gradient-primary">{user?.companyName || "Buyer"}</span>
        </h1>
        <p className="text-muted-foreground">
          Track your emissions and offset progress
        </p>
      </div>

      {/* KYC Alert */}
      {user?.kycStatus !== "approved" && (
        <Card variant="glow" className="mb-8 border-warning/50">
          <CardContent className="p-4 flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-warning shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Complete your KYC verification</p>
              <p className="text-sm text-muted-foreground">
                Upload required documents to unlock full marketplace access
              </p>
            </div>
            <Link to="/buyer/onboarding">
              <Button variant="outline" size="sm" className="gap-2">
                Complete KYC
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card variant="gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="outline">2024</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Current Emissions</p>
            <p className="font-display text-3xl font-bold">
              {mockEmissions.current.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">tCO2e</p>
          </CardContent>
        </Card>

        <Card variant="gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-success" />
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Total Offset</p>
            <p className="font-display text-3xl font-bold">
              {mockEmissions.offset.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">tCO2e</p>
          </CardContent>
        </Card>

        <Card variant="gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-accent" />
              </div>
              <Badge variant="verified">Net</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Net Emissions</p>
            <p className="font-display text-3xl font-bold">
              {netEmissions.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">tCO2e</p>
          </CardContent>
        </Card>

        <Card variant="gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-warning" />
              </div>
              <Badge variant="warning">Goal</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Remaining to Offset</p>
            <p className="font-display text-3xl font-bold">
              {remainingOffset.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">tCO2e</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Actions */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Progress to Goal */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Progress to Net-Zero Target
            </CardTitle>
            <CardDescription>
              Your journey from {mockEmissions.baseline.toLocaleString()} tCO2e baseline to {mockEmissions.target.toLocaleString()} tCO2e target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{Math.round(progressToTarget)}%</span>
              </div>
              <Progress value={progressToTarget} className="h-3" />
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-muted-foreground">Baseline</p>
                <p className="font-semibold">{mockEmissions.baseline.toLocaleString()} tCO2e</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Current Net</p>
                <p className="font-semibold text-primary">{netEmissions.toLocaleString()} tCO2e</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Target</p>
                <p className="font-semibold text-success">{mockEmissions.target.toLocaleString()} tCO2e</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/marketplace" className="block">
              <Button variant="hero" className="w-full justify-start gap-3">
                <ShoppingCart className="h-4 w-4" />
                Browse Marketplace
              </Button>
            </Link>
            <Link to="/buyer/emissions" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <BarChart3 className="h-4 w-4" />
                Upload Emissions Data
              </Button>
            </Link>
            <Link to="/buyer/compliance" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <FileText className="h-4 w-4" />
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchases */}
      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Purchases</CardTitle>
            <CardDescription>Your latest carbon credit acquisitions</CardDescription>
          </div>
          <Link to="/buyer/purchases">
            <Button variant="ghost" size="sm" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{purchase.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {purchase.volume} tCO2e • {new Date(purchase.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    purchase.status === "retired"
                      ? "success"
                      : purchase.status === "verified"
                      ? "verified"
                      : "pending"
                  }
                >
                  {purchase.status === "retired" && <CheckCircle className="h-3 w-3 mr-1" />}
                  {purchase.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                  {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
