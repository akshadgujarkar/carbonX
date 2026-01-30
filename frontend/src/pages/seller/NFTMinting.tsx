import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Coins,
  Wallet,
  CheckCircle,
  ArrowRight,
  Loader2,
  ExternalLink,
  Leaf,
  Shield,
  Sparkles,
} from "lucide-react";

// Mock verified projects ready for NFT minting
const mockVerifiedProjects = [
  {
    id: "1",
    name: "Amazon Rainforest Restoration",
    volume: 2500,
    type: "reforestation",
    verifiedAt: "2024-01-10",
    nftMinted: false,
  },
  {
    id: "2",
    name: "Solar Community Project",
    volume: 1800,
    type: "renewable_energy",
    verifiedAt: "2024-01-05",
    nftMinted: true,
    nftId: "1001",
    listed: true,
  },
];

export default function NFTMinting() {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [price, setPrice] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const handleConnectWallet = async () => {
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setWalletConnected(true);
    toast({
      title: "Wallet connected!",
      description: "MetaMask connected successfully (Mock)",
    });
  };

  const handleMint = async (projectId: string) => {
    setIsMinting(true);
    setSelectedProject(projectId);

    // Simulate minting
    await new Promise((resolve) => setTimeout(resolve, 3000));

    toast({
      title: "NFT Minted!",
      description: "Your carbon credit NFT has been minted on Sepolia testnet",
    });

    setIsMinting(false);
    setSelectedProject(null);
  };

  const handleList = async () => {
    if (!price) {
      toast({
        title: "Price required",
        description: "Please enter a listing price",
        variant: "destructive",
      });
      return;
    }

    setIsListing(true);

    // Simulate listing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "NFT Listed!",
      description: `Your NFT is now listed for ${price} ETH on the marketplace`,
    });

    setIsListing(false);
    setPrice("");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          NFT <span className="text-gradient-primary">Minting</span>
        </h1>
        <p className="text-muted-foreground">
          Mint verified carbon credits as NFTs on the blockchain
        </p>
      </div>

      {/* Wallet Connection */}
      <Card variant="glow" className="mb-8">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {walletConnected ? "Wallet Connected" : "Connect Your Wallet"}
              </p>
              <p className="text-sm text-muted-foreground">
                {walletConnected
                  ? "0x1234...5678 (Sepolia Testnet)"
                  : "Connect MetaMask to mint and list NFTs"}
              </p>
            </div>
          </div>
          {walletConnected ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Connected
            </Badge>
          ) : (
            <Button variant="hero" onClick={handleConnectWallet}>
              Connect Wallet
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card variant="glass">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-xl bg-primary/20 mx-auto flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Verified Only</h3>
            <p className="text-sm text-muted-foreground">
              Only ACVA-verified projects can be minted as NFTs
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-xl bg-accent/20 mx-auto flex items-center justify-center mb-4">
              <Coins className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">ERC-721 Standard</h3>
            <p className="text-sm text-muted-foreground">
              Each credit becomes a unique, tradeable NFT
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-xl bg-success/20 mx-auto flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Auto-Listed</h3>
            <p className="text-sm text-muted-foreground">
              Set your price and list directly on the marketplace
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Verified Projects */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Verified Projects Ready for Minting</CardTitle>
          <CardDescription>
            Select a project to mint as an NFT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockVerifiedProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.volume.toLocaleString()} tCO2e • Verified{" "}
                        {new Date(project.verifiedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                {project.nftMinted ? (
                  <div className="flex items-center justify-between p-3 rounded bg-success/10">
                    <div>
                      <p className="text-sm font-medium">NFT Minted</p>
                      <p className="text-xs text-muted-foreground">
                        Token ID: #{project.nftId}
                      </p>
                    </div>
                    {project.listed ? (
                      <Badge variant="verified">Listed on Marketplace</Badge>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`price-${project.id}`} className="text-sm">
                            Price:
                          </Label>
                          <Input
                            id={`price-${project.id}`}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-24 h-8"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                          <span className="text-sm">ETH</span>
                        </div>
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={handleList}
                          disabled={isListing}
                        >
                          {isListing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "List"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="hero"
                    className="w-full gap-2"
                    disabled={!walletConnected || isMinting}
                    onClick={() => handleMint(project.id)}
                  >
                    {isMinting && selectedProject === project.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4" />
                        Mint NFT
                      </>
                    )}
                  </Button>
                )}
              </div>
            ))}

            {mockVerifiedProjects.length === 0 && (
              <div className="text-center py-12">
                <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No verified projects</h3>
                <p className="text-muted-foreground mb-4">
                  Submit your projects for verification to mint NFTs
                </p>
                <Link to="/seller/projects/new">
                  <Button variant="hero" className="gap-2">
                    Create Project
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
