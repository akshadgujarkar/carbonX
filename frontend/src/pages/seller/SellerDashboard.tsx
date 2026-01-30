import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FolderPlus,
  FileText,
  Coins,
  TrendingUp,
  ArrowRight,
  Leaf,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";

// Mock data
const mockStats = {
  totalProjects: 5,
  verifiedProjects: 3,
  pendingProjects: 2,
  totalCredits: 8500,
  listedNFTs: 3,
  soldNFTs: 2,
  totalRevenue: 4.5,
};

const mockProjects = [
  {
    id: "1",
    name: "Amazon Rainforest Restoration",
    type: "reforestation",
    volume: 2500,
    status: "verified",
    nftStatus: "listed",
  },
  {
    id: "2",
    name: "Solar Community Project",
    type: "renewable_energy",
    volume: 1800,
    status: "verified",
    nftStatus: "sold",
  },
  {
    id: "3",
    name: "Mangrove Conservation",
    type: "ocean_conservation",
    volume: 1200,
    status: "under_review",
    nftStatus: null,
  },
  {
    id: "4",
    name: "Wind Farm Initiative",
    type: "renewable_energy",
    volume: 3000,
    status: "pending",
    nftStatus: null,
  },
];

export default function SellerDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Welcome back, <span className="text-gradient-primary">{user?.companyName || "Seller"}</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your carbon credit projects and NFTs
        </p>
      </div>

      {/* KYC Alert */}
      {user?.kycStatus !== "approved" && (
        <Card variant="glow" className="mb-8 border-warning/50">
          <CardContent className="p-4 flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-warning shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Complete your verification</p>
              <p className="text-sm text-muted-foreground">
                Upload ACVA certificates and ownership documents to list projects
              </p>
            </div>
            <Link to="/seller/onboarding">
              <Button variant="outline" size="sm" className="gap-2">
                Complete Verification
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
                <FolderPlus className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="verified">{mockStats.verifiedProjects} Verified</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Total Projects</p>
            <p className="font-display text-3xl font-bold">
              {mockStats.totalProjects}
            </p>
          </CardContent>
        </Card>

        <Card variant="gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-success" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="font-display text-3xl font-bold">
              {mockStats.totalCredits.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">tCO2e</p>
          </CardContent>
        </Card>

        <Card variant="gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Coins className="h-6 w-6 text-accent" />
              </div>
              <Badge variant="success">{mockStats.soldNFTs} Sold</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Listed NFTs</p>
            <p className="font-display text-3xl font-bold">
              {mockStats.listedNFTs}
            </p>
          </CardContent>
        </Card>

        <Card variant="gradient">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="font-display text-3xl font-bold">
              {mockStats.totalRevenue}
            </p>
            <p className="text-sm text-muted-foreground">ETH</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions + Projects */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/seller/projects/new" className="block">
              <Button variant="hero" className="w-full justify-start gap-3">
                <FolderPlus className="h-4 w-4" />
                Create New Project
              </Button>
            </Link>
            <Link to="/seller/reports" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
            </Link>
            <Link to="/seller/nfts" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Coins className="h-4 w-4" />
                Mint NFT
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Projects</CardTitle>
              <CardDescription>Recent carbon credit projects</CardDescription>
            </div>
            <Link to="/seller/projects">
              <Button variant="ghost" size="sm" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.volume.toLocaleString()} tCO2e
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        project.status === "verified"
                          ? "success"
                          : project.status === "under_review"
                          ? "warning"
                          : "pending"
                      }
                    >
                      {project.status === "verified" && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {project.status === "under_review" && (
                        <Eye className="h-3 w-3 mr-1" />
                      )}
                      {project.status === "pending" && (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {project.status.replace("_", " ")}
                    </Badge>
                    {project.nftStatus && (
                      <Badge
                        variant={project.nftStatus === "sold" ? "success" : "verified"}
                      >
                        NFT {project.nftStatus}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Progress */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Verification Pipeline</CardTitle>
          <CardDescription>Track your projects through the verification process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-3xl font-bold text-muted-foreground">2</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-warning/10">
              <p className="text-3xl font-bold text-warning">1</p>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <p className="text-3xl font-bold text-success">3</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <p className="text-3xl font-bold text-primary">2</p>
              <p className="text-sm text-muted-foreground">NFTs Listed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
