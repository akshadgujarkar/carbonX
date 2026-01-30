import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
} from "lucide-react";
import { getProjectsBySeller } from "@/lib/firestore-projects";
import { getListingsBySeller } from "@/lib/firestore-listings";
import type { CarbonProject } from "@/types";
import type { MarketplaceListing } from "@/lib/firestore-listings";
import type { VerificationStatus } from "@/types";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<CarbonProject[]>([]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || user.role !== "seller") {
      setLoading(false);
      return;
    }
    Promise.all([
      getProjectsBySeller(user.id),
      getListingsBySeller(user.id),
    ])
      .then(([projs, list]) => {
        setProjects(projs);
        setListings(list);
      })
      .catch(() => {
        setProjects([]);
        setListings([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id, user?.role]);

  const listedNFTs = listings.filter((l) => l.status === "listed");
  const soldNFTs = listings.filter((l) => l.status === "sold");
  const totalRevenue = soldNFTs.reduce((sum, l) => sum + (l.priceETH ?? 0), 0);
  const totalCredits = projects.reduce((sum, p) => sum + (p.volumeTCO2e ?? 0), 0);
  const verifiedProjects = projects.filter((p) => p.verificationStatus === "verified");
  const pendingProjects = projects.filter((p) => p.verificationStatus === "pending");
  const underReviewProjects = projects.filter((p) => p.verificationStatus === "under_review");
  const nftsListedCount = listings.filter((l) => l.status === "listed").length;

  const projectNftStatus = (project: CarbonProject): "listed" | "sold" | null => {
    const listing = listings.find(
      (l) => l.projectId === project.id
    );
    if (!listing) return null;
    return listing.status === "sold" ? "sold" : "listed";
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

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
              <Badge variant="verified">{verifiedProjects.length} Verified</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Total Projects</p>
            <p className="font-display text-3xl font-bold">
              {projects.length}
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
              {totalCredits.toLocaleString()}
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
              <Badge variant="success">{soldNFTs.length} Sold</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Listed NFTs</p>
            <p className="font-display text-3xl font-bold">
              {listedNFTs.length}
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
              {totalRevenue.toFixed(4)}
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
              {projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Leaf className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No projects yet. Create your first carbon credit project.</p>
                  <Link to="/seller/projects/new">
                    <Button variant="hero" size="sm" className="mt-3 gap-2">
                      Create Project
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                projects.slice(0, 5).map((project) => {
                  const status = project.verificationStatus as VerificationStatus;
                  const nftStatus = projectNftStatus(project);
                  return (
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
                            {(project.volumeTCO2e ?? 0).toLocaleString()} tCO2e
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            status === "verified"
                              ? "success"
                              : status === "under_review"
                                ? "warning"
                                : "pending"
                          }
                        >
                          {status === "verified" && (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {status === "under_review" && (
                            <Eye className="h-3 w-3 mr-1" />
                          )}
                          {status === "pending" && (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {status.replace("_", " ")}
                        </Badge>
                        {nftStatus && (
                          <Badge
                            variant={nftStatus === "sold" ? "success" : "verified"}
                          >
                            NFT {nftStatus}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
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
              <p className="text-3xl font-bold text-muted-foreground">{pendingProjects.length}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-warning/10">
              <p className="text-3xl font-bold text-warning">{underReviewProjects.length}</p>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <p className="text-3xl font-bold text-success">{verifiedProjects.length}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <p className="text-3xl font-bold text-primary">{nftsListedCount}</p>
              <p className="text-sm text-muted-foreground">NFTs Listed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
