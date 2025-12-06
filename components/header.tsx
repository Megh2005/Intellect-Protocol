import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/components/wallet-provider";
import {
  Home,
  Upload,
  PlusSquare,
  Wallet,
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons/logo";

export function Header() {
  const { wallet, connectWallet } = useWalletContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setAvatarUrl(userDoc.data().avatarUrl);
        }
      } else {
        setUser(null);
        setAvatarUrl(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/generate", label: "Generate", icon: PlusSquare },
    { href: "/mint", label: "Mint", icon: Upload },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    {
      href: "/prompt-generator",
      label: "Prompter",
      icon: Sparkles,
    },
    {
      href: "/ipr-repository",
      label: "IPR Hub",
      icon: Wallet,
    },
  ];

  if (user) {
    navLinks.push({ href: "/profile", label: "Profile", icon: UserIcon });
  }

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: { opacity: 1, y: "0%" },
  };

  return (
    <>
      <header className="sticky top-4 z-50 w-[95%] max-w-7xl mx-auto rounded-full glass mt-4 mb-8 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md bg-black/40">
        <div className="px-6 h-16 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <img
              src="https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png"
              alt="Intellect Protocol Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-primary">Intellect Protocol</span>
          </Link>

          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              {wallet.isConnected ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-mono text-muted-foreground">
                      {wallet.address?.slice(0, 6)}...
                      {wallet.address?.slice(-4)}
                    </span>
                  </div>
                  {avatarUrl && (
                    <Link href="/profile">
                      <Avatar className="w-10 h-10 border-2 border-primary">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>
                          <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  )}
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  size="sm"
                  className="rounded-full bg-primary text-black hover:bg-primary/90 transition-all duration-300"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col gap-10 text-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-3xl font-bold transition-colors flex items-center gap-4 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="w-8 h-8" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-12">
              {wallet.isConnected ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-mono text-muted-foreground">
                    {wallet.address?.slice(0, 6)}...
                    {wallet.address?.slice(-4)}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    connectWallet();
                    setIsMenuOpen(false);
                  }}
                  size="lg"
                  className="rounded-full bg-primary text-black hover:bg-primary/90 transition-all duration-300"
                >
                  <Wallet className="w-6 h-6 mr-3" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
