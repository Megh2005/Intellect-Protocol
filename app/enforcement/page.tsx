"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Scale,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { countries } from "@/lib/countries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWalletContext } from "@/components/wallet-provider";

interface AdvocateDetails {
  name: string;
  email: string;
  country: string;
  experience: string;
  rating: string;
  skills: string;
  description: string;
}

interface EnforcementResponse {
  requestedCountry: string;
  bestMatch: {
    advocateDetails: AdvocateDetails;
    referralReason: string;
    matchConfidence: string;
  };
  remainingCredits?: number;
}

export default function EnforcementPage() {
  const { wallet } = useWalletContext();
  const [country, setCountry] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnforcementResponse | null>(null);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    // Optional: Warn if wallet not connected?
    // For now we proceed, backend handles missing wallet by not limiting (or defaulting behaviors)

    if (!country) {
      setError("Please select a valid jurisdiction.");
      setLoading(false);
      return;
    }

    if (issue.length < 20) {
      setError(
        "Please provide a more detailed description (at least 20 characters)."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/enforcement", {
        country,
        description: issue,
        walletAddress: wallet?.address,
      });
      setResult(response.data);
      setIssue(""); // Reset prompt as requested

      if (response.data.remainingCredits !== undefined) {
        setCredits(response.data.remainingCredits);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Failed to find an advocate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pt-6 pb-12 relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Blobs matching Generator Page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-6 relative z-10"
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9]">
          IP <span className="neo-gradient-text text-glow">ENFORCEMENT</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
          Find the perfect legal representation for your intellectual property
          disputes using our AI-powered matching system.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl w-full mx-auto"
      >
        <Card className="neo-card border-primary/20 bg-gradient-to-br from-white/5 to-primary/5 transition-colors shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-3 text-3xl font-bold">
                  <Scale className="w-8 h-8 text-primary" />
                  Find Advocate
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Describe your issue and jurisdiction to find the best expert.
                </CardDescription>
              </div>
              {credits !== null && (
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Daily Credits
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      credits === 0 ? "text-red-500" : "text-primary"
                    }`}
                  >
                    {credits}/2
                  </p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="country" className="text-xl font-semibold">
                  Jurisdiction (Country)
                </Label>
                <div className="relative">
                  <Select onValueChange={setCountry} value={country}>
                    <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg focus:ring-primary/50 text-white">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                        <SelectValue placeholder="Select a Country" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl text-white max-h-[300px]">
                      {countries.map((c) => (
                        <SelectItem
                          key={c}
                          value={c}
                          className="focus:bg-primary/20 focus:text-white cursor-pointer"
                        >
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="issue" className="text-xl font-semibold">
                  Case Description
                </Label>
                <Textarea
                  id="issue"
                  placeholder="Describe your issue in detail. For example: 'I have a trademark dispute regarding my logo being used by a competitor on their e-commerce website...'"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl px-6 py-4 text-lg min-h-[160px] focus:border-primary/50 transition-colors resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground text-right">
                  {issue.length}/20 characters minimum
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-3 text-red-400 text-sm bg-red-900/10 p-4 rounded-xl border border-red-900/30"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading || (credits !== null && credits === 0)}
                size="lg"
                className="w-full bg-primary text-black border-0 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] text-lg px-12 py-8 h-auto rounded-full font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Analyzing Case & Finding Match...
                  </>
                ) : (
                  <>
                    <Search className="mr-3 h-6 w-6" />
                    Find Best Legal Advocate
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full px-4"
        >
          {/* Main Advocate Profile Card */}
          <Card className="md:col-span-1 border-primary/20 bg-white/5 backdrop-blur-md overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="text-center pb-2 relative z-10">
              <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[3px] mb-4 shadow-xl">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://robohash.org/${
                      result.bestMatch.advocateDetails.name.split(" ")[0]
                    }`}
                    alt={result.bestMatch.advocateDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                {result.bestMatch.advocateDetails.name}
              </CardTitle>
              <CardDescription className="flex items-center justify-center gap-2 mt-2 text-base">
                <MapPin className="w-4 h-4" />{" "}
                {result.bestMatch.advocateDetails.country}
              </CardDescription>
              <Badge
                variant="outline"
                className="mx-auto mt-4 bg-primary/20 text-primary border-primary/30 px-3 py-1 text-sm"
              >
                Top Match {result.bestMatch.matchConfidence}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-6 pt-6 relative z-10">
              <div className="grid grid-cols-2 gap-3 text-sm text-center">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                    Experience
                  </p>
                  <p className="font-bold text-lg text-white">
                    {result.bestMatch.advocateDetails.experience}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                    Rating
                  </p>
                  <p className="font-bold text-lg text-yellow-400">
                    {result.bestMatch.advocateDetails.rating}
                  </p>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Specializations
                </p>
                <div className="text-sm text-white leading-relaxed p-3 rounded-xl bg-white/5 border border-white/5">
                  {result.bestMatch.advocateDetails.skills}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact
                </p>
                <p className="text-sm text-primary break-all font-mono bg-primary/10 p-2 rounded-lg text-center">
                  {result.bestMatch.advocateDetails.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Analysis & Reasoning */}
          <Card className="md:col-span-2 border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-40 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                <SparklesIcon className="w-6 h-6 text-yellow-400" />
                AI Match Analysis
              </CardTitle>
              <CardDescription className="text-lg">
                Why this advocate is the best fit for your case
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="p-8 rounded-2xl bg-black/40 border border-white/10 leading-8 text-gray-200 shadow-inner text-lg">
                <p>{result.bestMatch.referralReason}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20 flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-400 text-base mb-2">
                      Skills Match
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Verified alignment with{" "}
                      <span className="text-green-300">
                        {result.bestMatch.advocateDetails.skills.split(",")[0]}
                      </span>{" "}
                      and other required expertise.
                    </p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-4">
                  <ShieldAlert className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-blue-400 text-base mb-2">
                      Case Type Alignment
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      High probability of success based on advocate's track
                      record in similar disputes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
    </svg>
  );
}
