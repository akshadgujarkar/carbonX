import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ArrowRight, FolderPlus, CheckCircle, Clock, Eye, Loader2 } from "lucide-react";
import { getProjectsBySeller } from "@/lib/firestore-projects";
import { getListingsBySeller } from "@/lib/firestore-listings";
import type { CarbonProject } from "@/types";
import type { VerificationStatus } from "@/types";

const projectTypeLabels: Record<string, string> = {
  reforestation: "Reforestation",
  renewable_energy: "Renewable Energy",
  methane_capture: "Methane Capture",
  ocean_conservation: "Ocean Conservation",
  soil_carbon: "Soil Carbon",
  avoided_deforestation: "Avoided Deforestation",
  clean_cookstoves: "Clean Cookstoves",
  other: "Other",
};

export default function SellerProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<CarbonProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || user.role !== "seller") {
      setLoading(false);
      return;
    }
    getProjectsBySeller(user.id)
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [user?.id, user?.role]);

  const [listingsByProject, setListingsByProject] = useState<Record<string, "listed" | "sold">>({});
  useEffect(() => {
    if (!user?.id) return;
    getListingsBySeller(user.id)
      .then((list) => {
        const map: Record<string, "listed" | "sold"> = {};
        list.forEach((l) => {
          map[l.projectId] = l.status;
        });
        setListingsByProject(map);
      })
      .catch(() => setListingsByProject({}));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">
            Your <span className="text-gradient-primary">Projects</span>
          </h1>
          <p className="text-muted-foreground">
            All carbon credit projects. Create new or manage existing.
          </p>
        </div>
        <Link to="/seller/projects/new">
          <Button variant="hero" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Leaf className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">No projects yet</p>
              <p className="text-sm mb-4">
                Create your first carbon credit project to get verified and mint NFTs.
              </p>
              <Link to="/seller/projects/new">
                <Button variant="hero" className="gap-2">
                  <FolderPlus className="h-4 w-4" />
                  Create Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => {
                const status = project.verificationStatus as VerificationStatus;
                const nftStatus = listingsByProject[project.id];
                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {projectTypeLabels[project.type] || project.type} •{" "}
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
                        {status === "verified" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {status === "under_review" && <Eye className="h-3 w-3 mr-1" />}
                        {status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {status.replace("_", " ")}
                      </Badge>
                      {nftStatus && (
                        <Badge variant={nftStatus === "sold" ? "success" : "verified"}>
                          NFT {nftStatus}
                        </Badge>
                      )}
                      <Link to="/seller/nfts">
                        <Button variant="ghost" size="sm" className="gap-2">
                          Mint / List
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
