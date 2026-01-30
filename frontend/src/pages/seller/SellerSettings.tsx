import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SellerSettings() {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState(user?.companyName ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile({ companyName, country });
      toast({ title: "Saved", description: "Profile updated." });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="text-gradient-primary">Settings</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your seller profile
        </p>
      </div>
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Update your company name and country. Email is managed by Firebase Auth.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
