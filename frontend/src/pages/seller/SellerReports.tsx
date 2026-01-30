import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";

export default function SellerReports() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="text-gradient-primary">Reports</span>
        </h1>
        <p className="text-muted-foreground">
          ACVA reports and verification documents
        </p>
      </div>
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reports
          </CardTitle>
          <CardDescription>
            Reports are generated when you submit projects for ACVA verification. View and download from your project details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Go to your projects to see ACVA report status and generate new reports when creating a project.
          </p>
          <Link to="/seller/projects">
            <Button variant="hero" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              View Projects
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
