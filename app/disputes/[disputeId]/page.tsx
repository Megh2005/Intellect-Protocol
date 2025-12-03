"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  ShieldAlert,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface DisputeData {
  disputeId: string;
  targetIpId: string;
  targetTag: string;
  evidence: string;
  evidenceCid: string;
  raiserAddress: string;
  creatorAddress: string;
  txHash: string;
  createdAt: string;
  status: string;
}

export default function DisputeDetailsPage() {
  const params = useParams();
  const disputeId = params.disputeId as string;
  const [dispute, setDispute] = useState<DisputeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDispute = async () => {
      if (!disputeId) return;

      try {
        const q = query(
          collection(db, "disputes"),
          where("disputeId", "==", disputeId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setDispute(querySnapshot.docs[0].data() as DisputeData);
        } else {
          console.error("Dispute not found");
        }
      } catch (error) {
        console.error("Error fetching dispute:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDispute();
  }, [disputeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Dispute Not Found</h1>
        <p className="text-gray-400 mb-6">
          The dispute with ID {disputeId} could not be found.
        </p>
        <Link href="/gallery">
          <Button variant="outline">Return to Gallery</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/gallery">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                ← Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-red-500" />
              Dispute Details
            </h1>
          </div>
          <Badge
            variant={dispute.status === "Raised" ? "destructive" : "secondary"}
            className="text-lg px-4 py-1"
          >
            {dispute.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Dispute Info */}
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Dispute Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Dispute ID
                  </label>
                  <p className="font-mono text-lg">{dispute.disputeId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Target IP Asset
                  </label>
                  <Link
                    href={`https://explorer.story.foundation/ipa/${dispute.targetIpId}`}
                    target="_blank"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span className="font-mono">{dispute.targetIpId}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Violation Type
                  </label>
                  <Badge
                    variant="outline"
                    className="border-red-500/50 text-red-400"
                  >
                    {dispute.targetTag}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Created At
                  </label>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    {new Date(dispute.createdAt).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Parties Involved
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Raiser Address
                  </label>
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <span className="font-mono text-sm truncate">
                      {dispute.raiserAddress}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Creator (Target) Address
                  </label>
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <span className="font-mono text-sm truncate">
                      {dispute.creatorAddress || "Unknown"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Evidence */}
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 h-full">
              <CardHeader>
                <CardTitle className="text-xl text-white">Evidence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Description
                  </label>
                  <div className="bg-black/50 p-4 rounded-lg border border-zinc-800 text-gray-200 min-h-[100px] whitespace-pre-wrap">
                    {dispute.evidence}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    On-Chain Data
                  </label>
                  <div className="space-y-2">
                    <Link
                      href={`https://explorer.story.foundation/transactions/${dispute.txHash}`}
                      target="_blank"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-between border-zinc-700 hover:bg-zinc-800"
                      >
                        <span>View Transaction</span>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>

                    {dispute.evidenceCid && (
                      <Link
                        href={`https://gateway.pinata.cloud/ipfs/${dispute.evidenceCid}`}
                        target="_blank"
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-between border-zinc-700 hover:bg-zinc-800"
                        >
                          <span>View Evidence on IPFS</span>
                          <FileText className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
