"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletContext } from "@/components/wallet-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Type,
  User as UserIcon,
  Percent,
  FileText,
  Plus,
  X,
  Sparkles,
  Loader2,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function GeneratePage() {
  const { wallet } = useWalletContext();
  const [user, setUser] = useState<User | null>(null);

  const [prompt, setPrompt] = useState("");
  const [imageName, setImageName] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null);
  const [remainingImages, setRemainingImages] = useState<number | null>(null);

  const fetchUsage = async (address: string, email?: string | null) => {
    try {
      const params = new URLSearchParams();
      if (address) params.append("walletAddress", address);
      if (email) params.append("email", email);

      const response = await fetch(`/api/user-usage?${params.toString()}`);
      const data = await response.json();
      if (data.remaining !== undefined) {
        setRemainingImages(data.remaining);
      }
    } catch (error) {
      console.error("Error fetching usage:", error);
    }
  };

  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      fetchUsage(wallet.address, user?.email);
    } else {
      setRemainingImages(null);
    }
  }, [wallet.isConnected, wallet.address, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (user.displayName) {
          setCreatorName(user.displayName);
        }
      } else {
        setUser(null);
        setCreatorName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!wallet.isConnected) {
      toast.error("Please connect your wallet first.", {
        description:
          "A wallet connection is required to generate images and interact with the protocol.",
      });
      return;
    }

    if (!prompt.trim()) {
      toast.error("Your imagination is the first step!", {
        description: "Please enter a prompt to bring your vision to life.",
      });
      return;
    }

    const fullPrompt = prompt.trim();

    setIsGenerating(true);
    toast.loading("Generating your masterpiece...", {
      description: "The AI is warming up. This may take a moment.",
    });

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          walletAddress: wallet.address,
          email: user?.email,
        }),
      });

      const data = await response.json();
      toast.dismiss();

      if (data.success) {
        setGeneratedImage(`data:image/png;base64,${data.imageBuffer}`);
        toast.success("Creation complete!", {
          description: "Your new image has been successfully generated.",
        });
        // Refresh usage count
        if (wallet.address) {
          fetchUsage(wallet.address, user?.email);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Generation failed.", {
        description:
          "Something went wrong while generating the image. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const [description, setDescription] = useState("");
  const [traits, setTraits] = useState<{ key: string; value: string }[]>([]);
  const [newTraitKey, setNewTraitKey] = useState("");
  const [newTraitValue, setNewTraitValue] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [contributionPercent, setContributionPercent] = useState<
    number | string
  >(100);
  const [licenseType, setLicenseType] = useState("commercial");

  const addTrait = () => {
    if (newTraitKey && newTraitValue) {
      setTraits([...traits, { key: newTraitKey, value: newTraitValue }]);
      setNewTraitKey("");
      setNewTraitValue("");
    } else {
      toast.info("Please provide both a trait name and a value.");
    }
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const handleRegisterIP = async () => {
    if (!generatedImage || !imageName.trim()) {
      toast.error("Missing essential details.", {
        description:
          "Please provide a name for your creation before registering it.",
      });
      return;
    }

    if (!creatorName.trim()) {
      toast.error("Who is the creator?", {
        description: "Please enter a creator name to assign ownership.",
      });
      return;
    }

    if (!user) {
      toast.error("You must be logged in to register an IP.");
      return;
    }

    setIsRegistering(true);
    toast.loading("Registering your IP on the blockchain...", {
      description: "This will permanently record your ownership. Please wait.",
    });

    try {
      const base64Data = generatedImage.split(",")[1];
      const fullPrompt = prompt.trim();

      const response = await fetch("/api/register-ip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBuffer: base64Data,
          imageName: imageName.trim(),
          prompt: fullPrompt,
          walletAddress: wallet.address,
          existingImageUrl: cachedImageUrl,
          description: description.trim(),
          attributes: traits,
          creatorName: creatorName.trim(),
          contributionPercent: Number(contributionPercent),
          licenseType,
          userId: user.uid,
        }),
      });

      const data = await response.json();
      toast.dismiss();

      if (data.success) {
        toast.success("Registration successful!", {
          description: `Your IP has been minted on the blockchain.`,
          action: {
            label: "View on Story",
            onClick: () => window.open(data.explorerUrl, "_blank"),
          },
        });

        if (data.imageUrl) {
          setCachedImageUrl(data.imageUrl);
        }

        // Reset form fields
        setPrompt("");
        setImageName("");
        setGeneratedImage(null);
        setDescription("");
        setTraits([]);
        setNewTraitKey("");
        setNewTraitValue("");
        setCreatorName(user?.displayName || ""); // Reset to pre-filled if user is logged in
        setContributionPercent(100);
        setLicenseType("commercial");
        const router = useRouter();
        router.refresh(); // Reload the page
      } else {
        throw new Error(data.error || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error registering IP:", error);
      toast.error("Registration failed.", { description: error.message });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pt-6 pb-12 relative overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-6 relative z-10"
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9]">
          CREATE <br />
          <span className="neo-gradient-text text-glow">YOUR LEGACY</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
          Use cutting-edge AI to generate unique visuals and instantly register
          them as immutable IP on the Intellect Protocol.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl w-full mx-auto"
      >
        <Card className="neo-card border-primary/20 bg-gradient-to-br from-white/5 to-primary/5 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl font-bold">
              <Sparkles className="w-8 h-8 text-primary" />
              Generator
            </CardTitle>
            <CardDescription className="text-lg">
              Step 1: Describe the image you want to create with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="prompt" className="text-xl font-semibold">
                AI Prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="e.g., A futuristic city skyline at dusk, with flying cars and neon lights, in a synthwave style."
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPrompt(e.target.value)
                }
                disabled={isGenerating}
                className="bg-white/5 border-white/10 rounded-xl px-6 py-4 text-lg min-h-[140px] focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Progress Bar for Credits */}
            {remainingImages !== null && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Daily Credits</span>
                  <span
                    className={
                      remainingImages === 0 ? "text-red-500" : "text-primary"
                    }
                  >
                    {remainingImages}/2 Remaining
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(remainingImages / 2) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      remainingImages === 0 ? "bg-red-500" : "bg-primary"
                    }`}
                  />
                </div>
                {remainingImages === 0 && (
                  <p className="text-xs text-red-400 mt-1">
                    You have reached your daily limit of 2 images.
                  </p>
                )}
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={
                isGenerating || !wallet.isConnected || remainingImages === 0
              }
              size="lg"
              className="w-full bg-primary text-black border-0 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] text-lg px-12 py-8 h-auto rounded-full font-bold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate Image</>
              )}
            </Button>

            <AnimatePresence>
              {generatedImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-10 pt-10 border-t border-primary/20"
                >
                  <div className="flex justify-center">
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      src={generatedImage}
                      alt="Generated"
                      className="max-w-lg w-full rounded-2xl shadow-2xl border-2 border-primary/30"
                    />
                  </div>

                  <div className="space-y-4 text-center">
                    <h3 className="text-3xl font-bold">Register Your IP</h3>
                    <p className="text-muted-foreground text-lg">
                      Step 2: Add details and mint your creation on the
                      blockchain.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="imageName"
                        className="text-xl font-semibold"
                      >
                        Image Name
                      </Label>
                      <Input
                        id="imageName"
                        placeholder="My Awesome Creation"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="creatorName"
                        className="text-xl font-semibold"
                      >
                        Creator Name
                      </Label>
                      <Input
                        id="creatorName"
                        placeholder="Your Name"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        required
                        className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-xl font-semibold"
                      >
                        NFT Description (Optional)
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="A short story about your artwork..."
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setDescription(e.target.value)
                        }
                        className="bg-white/5 border-white/10 rounded-xl px-6 py-4 text-lg min-h-[120px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xl font-semibold">
                      Traits (Optional)
                    </Label>
                    <div className="flex gap-4">
                      <Input
                        placeholder="Trait Name (e.g., Style)"
                        value={newTraitKey}
                        onChange={(e) => setNewTraitKey(e.target.value)}
                        className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg flex-1"
                      />
                      <Input
                        placeholder="Value (e.g., Synthwave)"
                        value={newTraitValue}
                        onChange={(e) => setNewTraitValue(e.target.value)}
                        className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg flex-1"
                      />
                      <Button
                        onClick={addTrait}
                        type="button"
                        className="h-14 w-14 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary shrink-0"
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>

                    {traits.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                        {traits.map((trait, index) => (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={index}
                            className="flex justify-between items-center p-3 rounded-lg text-base bg-white/5"
                          >
                            <span className="font-medium">
                              <span className="text-muted-foreground mr-2">
                                {trait.key}:
                              </span>
                              {trait.value}
                            </span>
                            <button
                              onClick={() => removeTrait(index)}
                              className="text-red-500 hover:text-red-400 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label
                      htmlFor="licenseType"
                      className="text-xl font-semibold"
                    >
                      License Type
                    </Label>
                    <Select
                      onValueChange={setLicenseType}
                      defaultValue={licenseType}
                    >
                      <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                        <SelectValue placeholder="Select a license" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commercial">
                          Commercial Remix
                        </SelectItem>
                        <SelectItem value="creative-commons">
                          Creative Commons
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 mt-4">
                      <h4 className="font-semibold text-primary">
                        License Terms:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        {licenseType === "commercial" ? (
                          <>
                            <li>Commercial Use: Allowed</li>
                            <li>Attribution: Required</li>
                            <li>Derivatives: Allowed (Reciprocal)</li>
                            <li>Minting Fee: 1 Token (example)</li>
                            <li>Revenue Share: 50%</li>
                          </>
                        ) : (
                          <>
                            <li>Commercial Use: Allowed</li>
                            <li>Attribution: Required</li>
                            <li>Derivatives: Allowed (Reciprocal)</li>
                            <li>Minting Fee: Free</li>
                            <li>Revenue Share: 0%</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={handleRegisterIP}
                    disabled={isRegistering || !imageName.trim()}
                    size="lg"
                    className="w-full bg-primary text-black border-0 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] text-lg px-12 py-4 h-auto rounded-full font-bold"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Registering on Blockchain...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-6 h-6 mr-3" />
                        Register on Intellect Protocol
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
