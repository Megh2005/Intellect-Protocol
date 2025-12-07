"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Scale,
    Globe,
    BookOpen,
    Files,
    AlertOctagon,
    Gavel,
    Lock,
    Copyright,
    Zap
} from "lucide-react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Highlighter } from "@/components/ui/highlighter";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- Data ---

const protocolConcepts = [
    {
        quote: "All IP assets registered on the protocol are cryptographically secured and immutable, ensuring permanent proof of ownership.",
        name: "Immutable Ledger",
        title: "Core Mechanism",
    },
    {
        quote: "License terms are executed automatically via smart contracts, removing the need for intermediaries in royalty distribution.",
        name: "Smart Contract Enforcement",
        title: "Automation",
    },
    {
        quote: "Disputes are resolved through a decentralized consensus mechanism backed by AI-driven evidence analysis.",
        name: "Dispute Resolution",
        title: "Governance",
    },
    {
        quote: "Every registered IP allows for permissionless remixing and derivatives, creating a network of value.",
        name: "Permissionless Innovation",
        title: "Ecosystem",
    },
    {
        quote: "Royalties flow instantly to original creators whenever their work is monetized by a downstream application.",
        name: "Real-time Royalties",
        title: "Monetization",
    },
];

const policies = [
    {
        country: "United States",
        flag: "🇺🇸",
        laws: ["DMCA (Digital Millennium Copyright Act)", "Title 17 U.S. Code"],
        keyPoint: "Fair Use Doctrine allows limited use of copyrighted material without permission for purposes such as criticism, comment, news reporting, teaching, scholarship, or research.",
    },
    {
        country: "European Union",
        flag: "🇪🇺",
        laws: ["GDPR", "Directive on Copyright in the Digital Single Market"],
        keyPoint: "Article 17 requires platforms to make 'best efforts' to obtain authorization from rights holders and prevent unauthorized uploads.",
    },
    {
        country: "United Kingdom",
        flag: "🇬🇧",
        laws: ["Copyright, Designs and Patents Act 1988"],
        keyPoint: "Provides 'fair dealing' exceptions which serve a similar purpose to fair use but are more limited in scope.",
    },
    {
        country: "India",
        flag: "🇮🇳",
        laws: ["Copyright Act, 1957", "Information Technology Act, 2000"],
        keyPoint: "recognizes moral rights of authors (paternity and integrity) which cannot be waived.",
    },
    {
        country: "China",
        flag: "🇨🇳",
        laws: ["Copyright Law of the PRC (2020 Amendment)"],
        keyPoint: "Strengthened punitive damages for infringement and introduced 'technical protection measures' protection.",
    },
    {
        country: "Japan",
        flag: "🇯🇵",
        laws: ["Copyright Act (Act No. 48 of 1970)"],
        keyPoint: "Includes specific provisions for 'private use' and library reproduction.",
    },
];

const blackBookChapters = [
    {
        title: "Copyright",
        icon: <Copyright className="w-6 h-6 text-blue-400" />,
        content: "Copyright is a legal right that grants the creator of an original work exclusive rights for its use and distribution. This is usually only for a limited time. The exclusive rights are not absolute but limited by limitations and exceptions to copyright law, including fair use. A major limitation on copyright on ideas is that copyright protects only the original expression of ideas, and not the underlying ideas themselves.",
        details: ["Protection Term: Life of author + 70 years (typically)", "Scope: Literary, musical, dramatic, and artistic works", "Key Treaties: Berne Convention, WIPO Copyright Treaty"]
    },
    {
        title: "Patents",
        icon: <Zap className="w-6 h-6 text-yellow-400" />,
        content: "A patent is a type of intellectual property that gives its owner the legal right to exclude others from making, using, or selling an invention for a limited period of years in exchange for publishing an enabling public disclosure of the invention. In most countries, patent rights fall under private law and the patent holder must sue someone infringing the patent in order to enforce their rights.",
        details: ["Protection Term: 20 years from filing date", "Requirements: Novelty, Non-obviousness, Utility", "Key Treaties: Paris Convention, PCT"]
    },
    {
        title: "Trademarks",
        icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
        content: "A trademark is a recognizable sign, design, or expression which identifies products or services of a particular source from those of others, although trademarks used to identify services are usually called service marks. The trademark owner can be an individual, business organization, or any legal entity.",
        details: ["Protection Term: Indefinite (renewed every 10 years)", "Types: Word marks, logos, shapes, sounds", "Key Treaties: Madrid Protocol"]
    },
    {
        title: "Trade Secrets",
        icon: <Lock className="w-6 h-6 text-red-400" />,
        content: "Trade secrets are a type of intellectual property that comprise formulas, practices, processes, designs, instruments, patterns, or compilations of information that have inherent economic value because they are not generally known or readily ascertainable by others, and which the owner takes reasonable measures to keep secret.",
        details: ["Protection Term: Indefinite (as long as secret)", "Requirement: Reasonable steps to maintain secrecy", "Example: The Coca-Cola Formula"]
    },
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />

                <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
                    <Badge className="bg-white/10 text-primary border-primary/20 backdrop-blur-md px-4 py-1 text-sm uppercase tracking-widest hover:text-black mb-4">
                        Official Documentation
                    </Badge>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter leading-tight"
                    >
                        TERMS OF <span className="neo-gradient-text text-glow">SERVICE</span> <br />
                        & IP <span className="text-white">BLACK BOOK</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        The definitive guide to your rights, obligations, and the <span className="neo-gradient-text text-glow">immutable laws</span> that govern the Story Protocol ecosystem.
                    </motion.p>
                </div>
            </section>

            {/* --- INFINITE CARDS SECTION --- */}
            <section className="py-10 border-y border-white/5 bg-white/[0.02]">
                <InfiniteMovingCards items={protocolConcepts} direction="left" speed="normal" />
            </section>

            {/* --- BENTO GRID: TERMS & CONDITIONS --- */}
            <section className="py-24 px-6 max-w-7xl mx-auto space-y-12">
                <div className="space-y-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold">Terms of Use</h2>
                    <p className="text-muted-foreground text-lg">By accessing the Story Protocol, you agree to bound by these terms.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
                    {/* Card 1: Main Agreement */}
                    <Card className="md:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm group hover:border-primary/30 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Scale className="w-6 h-6 text-primary" />
                                User Agreement & Acceptance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                This App is a user interface to the Protocol. The Protocol is a decentralized Layer 1 intellectual property blockchain.
                                By using the Interface, you understand that you are interacting with smart contracts that run on a decentralized network.
                            </p>
                            <p>
                                <strong className="text-white">We do not control the Protocol.</strong> We provide this Interface as a convenience.
                                We are not responsible for any issues arising from the underlying blockchain, including but not limited to network congestion,
                                gas fees, or smart contract bugs at the protocol layer.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 2: Prohibited */}
                    <Card className="md:col-span-1 bg-white/5 border-white/10 backdrop-blur-sm group hover:border-red-500/30 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl text-red-400">
                                <AlertOctagon className="w-5 h-5" />
                                Prohibited Activities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-gray-400">
                            <ul className="list-disc pl-4 space-y-2">
                                <li>Upload infringing content.</li>
                                <li>Reverse engineer the Interface.</li>
                                <li>Use the protocol for money laundering.</li>
                                <li>Manipulate royalty streams.</li>
                                <li>Launch DDoS attacks on nodes.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Card 3: Disclaimers */}
                    <Card className="md:col-span-1 bg-white/5 border-white/10 backdrop-blur-sm group hover:border-yellow-500/30 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl text-yellow-400">
                                <AlertOctagon className="w-5 h-5" />
                                No Warranties
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400 leading-relaxed">
                            The Interface and Protocol are provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis.
                            We make no warranties, express or implied, regarding the correctness of the IP data or the profitability of any asset registered.
                        </CardContent>
                    </Card>

                    {/* Card 4: Liability */}
                    <Card className="md:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm group hover:border-primary/30 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Gavel className="w-6 h-6 text-primary" />
                                Limitation of Liability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                To the fullest extent permitted by law, the developers and contributors of Story Protocol shall not be liable for any indirect, incidental,
                                special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                            <p className="text-sm text-muted-foreground border-l-2 border-primary/50 pl-4">
                                YOU EXPRESSLY ACKNOWLEDGE THAT THE PROTOCOL IS EXPERIMENTAL TECHNOLOGY AND YOU ASSUME ALL RISKS ASSOCIATED WITH YOUR USE OF IT.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* --- BLACK BOOK SECTION --- */}
            <section className="py-24 px-6 bg-white/[0.02]">
                <div className="max-w-5xl mx-auto">
                    <div className="space-y-4 mb-16">
                        <Badge variant="outline" className="border-primary text-primary">Educational Resources</Badge>
                        <h2 className="text-3xl md:text-6xl font-black uppercase">The IP <span className="text-primary text-glow">Black Book</span></h2>
                        <p className="text-xl text-muted-foreground">Understanding the four pillars of Property Rights in the Digital Age.</p>
                    </div>

                    <div className="grid gap-8">
                        {blackBookChapters.map((chapter, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                            >
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 hover:border-primary/30 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 shrink-0">
                                            {chapter.icon}
                                        </div>
                                        <div className="space-y-4 grow">
                                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                                {chapter.title}
                                            </h3>
                                            <p className="text-gray-300 leading-relaxed text-lg">
                                                {chapter.content}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                                {chapter.details.map((detail, i) => (
                                                    <div key={i} className="text-xs font-mono text-primary/80 bg-primary/5 px-3 py-2 rounded border border-primary/10">
                                                        {detail}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- COUNTRY POLICIES GRID --- */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl md:text-5xl font-bold">Global Jurisdiction Policies</h2>
                    <p className="text-muted-foreground">Regional specifics for IP enforcement and protection.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {policies.map((policy, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="h-full bg-black border-white/10 hover:border-primary/50 transition-colors group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                            {policy.country}
                                        </CardTitle>
                                        <span className="text-4xl">{policy.flag}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Key Legislation</p>
                                        <ul className="text-sm text-gray-300 space-y-1">
                                            {policy.laws.map((law, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <BookOpen className="w-3 h-3 text-primary" />
                                                    {law}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Separator className="bg-white/10" />
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Policy Highlight</p>
                                        <p className="text-sm text-gray-400 leading-relaxed italic border-l-2 border-primary/20 pl-3">
                                            "{policy.keyPoint}"
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-20 text-center border-t border-white/5">
                <p className="text-muted-foreground text-sm">
                    Last updated: December 7, 2025. These terms may be updated at any time.
                </p>
            </section>
        </div>
    );
}
