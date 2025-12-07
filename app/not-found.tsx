"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, AlertTriangle, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background text-foreground grid-bg selection:bg-primary selection:text-black">
            {/* Background Ambience */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] -z-10 animate-pulse-slow delay-700" />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center space-y-8 p-8 relative z-10"
            >
                {/* 404 Header */}
                <div className="relative inline-block">
                    <motion.h1
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter neo-gradient-text text-glow select-none"
                    >
                        404
                    </motion.h1>

                </div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-bold text-white mb-2">
                        <AlertTriangle className="w-8 h-8 text-yellow-400" />
                        <span>Lost in the Protocol?</span>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                        The page you are looking for has been moved, deleted, or possibly
                        never existed in this dimension.
                    </p>
                </motion.div>

                {/* Countdown & Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-6 mt-8"
                >
                    <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 text-primary font-mono text-sm border-primary/20">
                        <Timer className="w-4 h-4 animate-spin-pulse" />
                        <span>Redirecting to Home in {countdown}s</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Decorative Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20" />
        </div>
    );
}
