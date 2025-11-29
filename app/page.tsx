"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Coins,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Brain,
  ChartBar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { FaTwitter, FaDiscord, FaGithub } from "react-icons/fa";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const testimonials = [
  {
    quote:
      "Intellect Protocol has completely transformed how I manage my digital art portfolio. The ability to instantly register IP and set licensing terms has opened up revenue streams I didn't know existed.",
    name: "Sarah Chen",
    title: "Digital Artist & Illustrator",
  },
  {
    quote:
      "As an AI developer, ensuring the provenance of my training data and models is crucial. This platform provides the transparency and security we've been waiting for in the generative AI space.",
    name: "Marcus Rodriguez",
    title: "Senior AI Engineer",
  },
  {
    quote:
      "The licensing automation is a lifesaver. I used to spend hours negotiating contracts, but now everything is handled via smart contracts. It's seamless, fast, and incredibly reliable.",
    name: "Emily Watson",
    title: "Freelance Graphic Designer",
  },
  {
    quote:
      "Finally, a platform that truly understands the needs of modern creators. The interface is intuitive, and the protection it offers for my intellectual property gives me total peace of mind.",
    name: "David Kim",
    title: "Concept Artist",
  },
  {
    quote:
      "I was skeptical about blockchain for IP, but Intellect Protocol makes it invisible. I just focus on creating, and the system handles the ownership and royalties in the background.",
    name: "Jessica Alverez",
    title: "Music Producer",
  },
  {
    quote:
      "The global marketplace feature is a game-changer. I've sold licenses to creators in countries I've never even visited. It's truly connecting the creative world.",
    name: "Thomas Mueller",
    title: "3D Modeler",
  },
  {
    quote:
      "Tracking asset usage has always been a nightmare, but not anymore. The dashboard gives me a clear view of where my work is being used and how much I'm earning in real-time.",
    name: "Olivia Parker",
    title: "Stock Photographer",
  },
  {
    quote:
      "For a small studio like ours, legal fees for IP protection were prohibitive. Intellect Protocol democratizes access to high-level IP management tools.",
    name: "James Wilson",
    title: "Indie Game Developer",
  },
  {
    quote:
      "The integration with existing AI tools is flawless. I can generate assets and register them in a single workflow. It's efficient and keeps my creative process uninterrupted.",
    name: "Sophie Dubois",
    title: "Generative AI Artist",
  },
  {
    quote:
      "I love how the platform handles royalties. It's transparent and automatic. No more chasing payments or wondering if I'm being compensated fairly for my work.",
    name: "Ryan O'Connor",
    title: "Sound Designer",
  },
  {
    quote:
      "Security is my top priority, and Intellect Protocol delivers. Knowing my work is cryptographically secured on the blockchain allows me to share it with confidence.",
    name: "Anita Patel",
    title: "VR Content Creator",
  },
  {
    quote:
      "The community support is fantastic. Whenever I have a question about licensing terms or the protocol, the team and community are there to help instantly.",
    name: "Kevin Chang",
    title: "UI/UX Designer",
  },
  {
    quote:
      "This isn't just a tool; it's an ecosystem. Connecting with other creators and collaborating on licensed assets has led to some of my best projects yet.",
    name: "Maria Santos",
    title: "Creative Director",
  },
  {
    quote:
      "The speed of transaction is impressive. Buying a license for an asset takes seconds, allowing me to keep my project momentum going without administrative delays.",
    name: "Robert Taylor",
    title: "Video Editor",
  },
  {
    quote:
      "I've tried other IP platforms, but none offer the user experience and depth of features that Intellect Protocol does. It's the gold standard for the industry.",
    name: "Lisa Wong",
    title: "NFT Artist",
  },
  {
    quote:
      "Being able to prove ownership of my AI-assisted writing is huge. It validates my work and allows me to monetize it in ways that weren't possible before.",
    name: "Daniel Greene",
    title: "Technical Writer",
  },
  {
    quote:
      "The fractional ownership features are innovative. It allows fans to invest in my work and share in the success, building a stronger community around my art.",
    name: "Amanda White",
    title: "Digital Painter",
  },
  {
    quote:
      "Scalability is key for my business. Whether I'm registering one asset or a thousand, the protocol handles it effortlessly. It grows with my needs.",
    name: "Chris Black",
    title: "Asset Store Manager",
  },
  {
    quote:
      "The transparency of the ledger is invaluable. I can prove the history and originality of every piece I create, which adds significant value for my collectors.",
    name: "Patricia Lee",
    title: "Fine Art Photographer",
  },
  {
    quote:
      "Intellect Protocol is building the infrastructure for the next generation of the internet. It's exciting to be part of a movement that empowers creators first.",
    name: "Michael Ross",
    title: "Web3 Developer",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsSubscribing(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setEmail("");
      } else if (response.status === 409) {
        toast.warning(data.message);
      } else {
        throw new Error(data.error || "Something went wrong.");
      }
    } catch (error: any) {
      toast.error("Subscription failed.", { description: error.message });
    } finally {
      setIsSubscribing(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto space-y-12 pt-6 pb-12 relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-primary animate-float">
          <Zap className="w-4 h-4 fill-current" />
          <TypingAnimation text="The Future of AI Powered IP is Here" />
        </div>

        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9]">
          OWN YOUR <br />
          <span className="neo-gradient-text text-glow">DIGITAL MIND</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
          Stop letting platforms own your creativity.{" "}
          <span className="text-white font-bold">
            Mint, Protect, and Monetize
          </span>{" "}
          your AI assets on the blockchain
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Button
            asChild
            size="lg"
            className="bg-primary text-black border-0 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] text-lg px-12 py-4 h-auto rounded-full"
          >
            <Link href="/generate" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Start Creating
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* Features Section - 3 Column Grid */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4"
      >
        {/* Card 1: Generate */}
        <motion.div variants={item} whileHover={{ scale: 1.02 }}>
          <Card className="neo-card h-full border-primary/20 bg-gradient-to-br from-white/5 to-primary/5 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Brain className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-3xl font-bold">
                Generate with AI
              </CardTitle>
              <CardDescription className="text-lg">
                Create stunning, commercial-ready visuals in seconds with
                advanced AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-20 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2: Protect */}
        <motion.div variants={item} whileHover={{ scale: 1.02 }}>
          <Card className="neo-card h-full border-primary/20 bg-gradient-to-br from-white/5 to-primary/5 hover:border-primary/50 transition-colors">
            <CardHeader>
              <ShieldCheck className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-3xl font-bold">
                IP Protection
              </CardTitle>
              <CardDescription className="text-lg">
                Register your work on Intellect Protocol. It's yours, forever
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-20 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 3: Monetize */}
        <motion.div variants={item} whileHover={{ scale: 1.02 }}>
          <Card className="neo-card h-full border-primary/20 bg-gradient-to-br from-white/5 to-primary/5 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Coins className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-3xl font-bold">Monetize</CardTitle>
              <CardDescription className="text-lg">
                Set licensing terms and earn royalties automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-20 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                <ChartBar className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          How <span className="text-primary">Intellect Protocol</span> Works
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4"
        >
          {/* Step 1 */}
          <motion.div variants={item} className="flex flex-col items-center">
            <div className="p-6 bg-white/5 rounded-full border border-white/10 mb-4">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Create</h3>
            <p className="text-muted-foreground">
              Use our AI tools or bring your own creations to the platform
            </p>
          </motion.div>
          {/* Step 2 */}
          <motion.div variants={item} className="flex flex-col items-center">
            <div className="p-6 bg-white/5 rounded-full border border-white/10 mb-4">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Register</h3>
            <p className="text-muted-foreground">
              Mint your creation as an IP Asset on the Story Protocol
            </p>
          </motion.div>
          {/* Step 3 */}
          <motion.div variants={item} className="flex flex-col items-center">
            <div className="p-6 bg-white/5 rounded-full border border-white/10 mb-4">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">License</h3>
            <p className="text-muted-foreground">
              Define permissions and set terms for others to use your IP
            </p>
          </motion.div>
          {/* Step 4 */}
          <motion.div variants={item} className="flex flex-col items-center">
            <div className="p-6 bg-white/5 rounded-full border border-white/10 mb-4">
              <Coins className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Earn</h3>
            <p className="text-muted-foreground">
              Receive royalties automatically whenever your IP is used
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="text-primary">Intelligent{" "}</span>Creators
          </h2>
        </div>
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto pt-24 pb-12 text-center"
      >
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stay Updated with{" "}
            <span className="text-primary">Intellect Protocol</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join our newsletter to get the latest updates on AI IP ownership and
            monetization
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            onSubmit={handleSubscription}
          >
            <input
              type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      disabled={isSubscribing}
      className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
    />
    <Button
      type="submit"
      size="lg"
      disabled={isSubscribing}
      className="rounded-full bg-primary text-black hover:bg-primary/90 font-bold"
    >
      {isSubscribing ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        "Subscribe"
      )}
    </Button>
  </form>
  
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent blur-3xl -z-10" />
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto space-y-4 text-left"
        >
          <motion.div variants={item}>
            <details className="group neo-card p-6 rounded-xl border border-white/10 bg-white/5">
              <summary className="font-bold text-xl cursor-pointer list-none flex justify-between items-center">
                What is Intellect Protocol?
                <span className="transform transition-transform duration-300 group-open:rotate-45">
                  <Zap className="w-6 h-6 text-primary" />
                </span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Intellect Protocol is a decentralized network that allows creators to register, license, and manage their AI-generated and traditional intellectual property on the blockchain, ensuring transparent and automated royalty distribution.
              </p>
            </details>
          </motion.div>
          <motion.div variants={item}>
            <details className="group neo-card p-6 rounded-xl border border-white/10 bg-white/5">
              <summary className="font-bold text-xl cursor-pointer list-none flex justify-between items-center">
                How do I get started?
                <span className="transform transition-transform duration-300 group-open:rotate-45">
                  <Zap className="w-6 h-6 text-primary" />
                </span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Simply connect your wallet, go to the "Start Creating" section, and either use our integrated AI tools to generate new assets or upload your existing work to register it on the protocol.
              </p>
            </details>
          </motion.div>
          <motion.div variants={item}>
            <details className="group neo-card p-6 rounded-xl border border-white/10 bg-white/5">
              <summary className="font-bold text-xl cursor-pointer list-none flex justify-between items-center">
                What kind of assets can I register?
                <span className="transform transition-transform duration-300 group-open:rotate-45">
                  <Zap className="w-6 h-6 text-primary" />
                </span>
              </summary>
              <p className="text-muted-foreground mt-4">
                You can register a wide variety of digital assets, including AI-generated images, music, text, 3D models, and code. The protocol is designed to be flexible and support future creative formats.
              </p>
            </details>
          </motion.div>
          <motion.div variants={item}>
            <details className="group neo-card p-6 rounded-xl border border-white/10 bg-white/5">
              <summary className="font-bold text-xl cursor-pointer list-none flex justify-between items-center">
                How are royalties handled?
                <span className="transform transition-transform duration-300 group-open:rotate-45">
                  <Zap className="w-6 h-6 text-primary" />
                </span>
              </summary>
              <p className="text-muted-foreground mt-4">
                Royalties are defined by you when you set the licensing terms for your IP. Payments are executed automatically via smart contracts whenever your asset is licensed or used, with funds deposited directly into your connected wallet.
              </p>
            </details>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 text-center border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTwitter className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaDiscord className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaGithub className="w-6 h-6" />
            </Link>
          </div>
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Intellect Protocol. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
