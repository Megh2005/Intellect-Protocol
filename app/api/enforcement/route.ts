import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db as firebaseDb } from "@/lib/firebase"; // Import Firebase DB
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";


const MONGO_URI = process.env.MONGODB_URI!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const dbName = "intellect";
const collectionName = "advocates";

interface Advocate {
    sl_no: number;
    name: string;
    short_description: string;
    skills: string;
    experience: number;
    gender: string;
    rating: number;
    email: string;
    country: string;
}

interface SelectedAdvocate extends Advocate {
    reason: string;
    confidenceScore: number;
}

interface MatchResult {
    selectedAdvocate: SelectedAdvocate | null;
    confidence: number;
}

// Initialize Gemini AI with 2.5 Flash
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.5-flash";
const TEMPERATURE = 0.8;

let cachedClient: MongoClient | null = null;

async function getMongoClient(): Promise<MongoClient> {
    if (cachedClient) {
        return cachedClient;
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    cachedClient = client;
    return client;
}

async function getAdvocates(country?: string): Promise<Advocate[]> {
    try {
        const client = await getMongoClient();
        const db = client.db(dbName);
        const collection = db.collection<Advocate>(collectionName);

        // Filter by country if provided
        const query = country
            ? { country: { $regex: new RegExp(country, "i") } }
            : {};

        return await collection.find(query).toArray();
    } catch (error) {
        console.error(`Error fetching advocates: ${error}`);
        return [];
    }
}

function formatAdvocateData(advocates: Advocate[]): string {
    return advocates
        .map((advocate, i) => {
            return `Advocate ${i + 1}:
Name: ${advocate.name}
Description: ${advocate.short_description}
Skills: ${advocate.skills}
Experience: ${advocate.experience} years
Gender: ${advocate.gender}
Rating: ${advocate.rating}/10
Country: ${advocate.country}
Email: ${advocate.email}
`;
        })
        .join("\n");
}

function generateAIPrompt(
    caseDescription: string,
    advocatesText: string,
    country: string
): string {
    return `
Task: Based on the intellectual property case description and available IP advocates from ${country}, select EXACTLY 1 BEST-SUITED advocate who is the CLOSEST MATCH and most qualified to handle this specific case.

Critical Selection Criteria (in order of priority):
1. **Expertise Match**: The advocate's skills and specialization must directly align with the specific type of IP case (trademark, copyright, patent, brand theft, design rights, etc.)
2. **Experience Relevance**: Higher experience in the relevant field should be prioritized
3. **Rating**: Higher rated advocates indicate proven track record
4. **Case-Specific Fit**: Consider any unique aspects of the case (e.g., e-commerce, pharmaceuticals, software, etc.)

Important Considerations:
- ALL advocates listed are from ${country} as requested by the user.
- Analyze the case description carefully to identify the PRIMARY type of IP issue (trademark, copyright, patent, design, brand protection, etc.)
- Match the advocate's skills PRECISELY to the case requirements
- Consider the advocate's rating and experience level as secondary factors
- Select the ONE advocate who is the ABSOLUTE BEST MATCH - not just any qualified advocate

Rules:
- Do NOT mention advocates not in the list.
- Select EXACTLY 1 advocate - THE SINGLE BEST MATCH ONLY.
- Provide a COMPREHENSIVE reason (3-4 sentences) explaining:
  * Why this advocate is the BEST and CLOSEST match for this specific case
  * How their specific skills align with the case requirements
  * Why they are better suited than other available advocates
  * What makes them uniquely qualified for this particular IP issue
- Provide a confidence score (0-100) indicating how well this advocate matches the case requirements.
- Format the response EXACTLY as:

Selected Advocate:
1. <Advocate Name> - <Comprehensive reason explaining why this advocate is the absolute best match, their specific expertise alignment, and why they stand out for this case> - Confidence: <score>

IP Case Description:
${caseDescription}

Available IP Advocates from ${country}:
${advocatesText}
`;
}

function calculateOverallConfidence(scores: number[]): number {
    if (scores.length === 0) return 0;
    return scores[0];
}

async function findBestAdvocates(caseDescription: string, country: string): Promise<MatchResult> {
    const advocates = await getAdvocates(country);

    if (!advocates || advocates.length === 0) {
        throw new Error(`No advocates found in the database for ${country}.`);
    }

    const advocatesText = formatAdvocateData(advocates);
    const prompt = generateAIPrompt(caseDescription, advocatesText, country);

    try {
        // Initialize the Gemini model with configuration
        const geminiModel = genAI.getGenerativeModel({
            model: MODEL_NAME,
            generationConfig: {
                temperature: TEMPERATURE,
                maxOutputTokens: 2000,
            }
        });

        // Call Gemini API
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text().trim();

        console.log("AI Response:", responseText); // Log for debugging

        let selectedAdvocate: SelectedAdvocate | null = null;
        const confidenceScores: number[] = [];
        const lines = responseText.split("\n");

        const client = await getMongoClient();
        const db = client.db(dbName);
        const collection = db.collection<Advocate>(collectionName);

        for (const line of lines) {
            // Match pattern with confidence score
            const matchWithConfidence = line.match(
                /^\d+\.\s*(.*?)\s*-\s*(.*?)\s*-\s*Confidence:\s*(\d+)/i
            );

            if (matchWithConfidence) {
                const name = matchWithConfidence[1].trim();
                const reason = matchWithConfidence[2].trim();
                const confidence = parseInt(matchWithConfidence[3]);

                const advocateDoc = await collection.findOne({
                    name: { $regex: new RegExp(name, "i") },
                    country: { $regex: new RegExp(country, "i") }
                });

                if (advocateDoc) {
                    selectedAdvocate = {
                        sl_no: advocateDoc.sl_no,
                        name: advocateDoc.name,
                        short_description: advocateDoc.short_description,
                        skills: advocateDoc.skills,
                        experience: advocateDoc.experience,
                        gender: advocateDoc.gender,
                        rating: advocateDoc.rating,
                        email: advocateDoc.email,
                        country: advocateDoc.country,
                        reason,
                        confidenceScore: confidence,
                    };
                    confidenceScores.push(confidence);

                    break;
                }
            } else {
                const matchWithoutConfidence = line.match(/^\d+\.\s*(.*?)\s*-\s*(.*)$/);
                if (matchWithoutConfidence) {
                    const name = matchWithoutConfidence[1].trim();
                    const reason = matchWithoutConfidence[2].trim();

                    const advocateDoc = await collection.findOne({
                        name: { $regex: new RegExp(name, "i") },
                        country: { $regex: new RegExp(country, "i") }
                    });

                    if (advocateDoc) {
                        const defaultConfidence = 75;
                        selectedAdvocate = {
                            sl_no: advocateDoc.sl_no,
                            name: advocateDoc.name,
                            short_description: advocateDoc.short_description,
                            skills: advocateDoc.skills,
                            experience: advocateDoc.experience,
                            gender: advocateDoc.gender,
                            rating: advocateDoc.rating,
                            email: advocateDoc.email,
                            country: advocateDoc.country,
                            reason,
                            confidenceScore: defaultConfidence,
                        };
                        confidenceScores.push(defaultConfidence);

                        console.log(`Confidence: ${defaultConfidence}% (default)`);
                        break; // Only need one advocate
                    }
                }
            }
        }

        if (!selectedAdvocate) {
            throw new Error("Unable to find a suitable advocate match from the AI response.");
        }

        const confidence = calculateOverallConfidence(confidenceScores);

        console.log(`Total advocates available in ${country}: ${advocates.length}`);

        return {
            selectedAdvocate,
            confidence,
        };
    } catch (error: any) {
        throw new Error(`Error processing AI response: ${error.message}`);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { description, country } = body;

        // Check for rate limiting if wallet address is provided
        const { walletAddress } = body;
        let remainingCredits = 5; // Default max credits

        if (walletAddress) {
            // using "users" collection for rate limiting
            const usersCollection = collection(firebaseDb, "users");
            const q = query(usersCollection, where("walletAddress", "==", walletAddress));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                const userRef = doc(firebaseDb, "users", userDoc.id);

                // Check if user is currently blocked
                if (userData.enforcementBlockExpiresAt) {
                    const blockExpiresAt = userData.enforcementBlockExpiresAt.toDate(); // Convert Firestore Timestamp to Date
                    if (new Date() < blockExpiresAt) {
                        const resetTime = blockExpiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return NextResponse.json(
                            {
                                error: `Daily limit reached. You get 5 free searches before a 24-hour cooldown. Next credit available at ${resetTime}.`,
                            },
                            { status: 429 }
                        );
                    } else {
                        // Block has expired, reset counter and remove block
                        await updateDoc(userRef, {
                            enforcementCount: 0,
                            enforcementBlockExpiresAt: null // Remove the block field
                        });
                        userData.enforcementCount = 0; // Local update for current logic
                    }
                }

                // Check current count
                const currentCount = userData.enforcementCount || 0;

                if (currentCount >= 5) {
                    // Apply block if limit reached (should be captured by blockExpiresAt usually, but for safety/race conditions)
                    const blockExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    await updateDoc(userRef, {
                        enforcementBlockExpiresAt: blockExpires
                    });
                    const resetTime = blockExpires.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return NextResponse.json(
                        {
                            error: `Daily limit reached. You get 5 free searches before a 24-hour cooldown. Next credit available at ${resetTime}.`,
                        },
                        { status: 429 }
                    );
                }

                remainingCredits = 5 - currentCount;
            }
        }

        const result = await findBestAdvocates(description, country);

        if (!result.selectedAdvocate) {
            return NextResponse.json(
                {
                    error: "No suitable advocate found matching the case requirements.",
                },
                { status: 404 }
            );
        }

        // Increment counter after successful search
        if (walletAddress) {
            const usersCollection = collection(firebaseDb, "users");
            const q = query(usersCollection, where("walletAddress", "==", walletAddress));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userRef = doc(firebaseDb, "users", userDoc.id);
                const newCount = (userDoc.data().enforcementCount || 0) + 1;

                const updates: any = {
                    enforcementCount: newCount
                };

                if (newCount >= 5) {
                    updates.enforcementBlockExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                }

                await updateDoc(userRef, updates);
                remainingCredits = 5 - newCount;
            }
        }

        // Enhanced response with clear reason display for single best match
        const formattedResponse = {
            requestedCountry: country,
            bestMatch: {
                advocateDetails: {
                    name: result.selectedAdvocate.name,
                    email: result.selectedAdvocate.email,
                    country: result.selectedAdvocate.country,
                    experience: `${result.selectedAdvocate.experience} years`,
                    rating: `${result.selectedAdvocate.rating}/10`,
                    skills: result.selectedAdvocate.skills,
                    description: result.selectedAdvocate.short_description,
                },
                referralReason: result.selectedAdvocate.reason,
                matchConfidence: `${result.selectedAdvocate.confidenceScore}%`,
            },
            remainingCredits: Math.max(0, remainingCredits)
        };

        return NextResponse.json(formattedResponse, { status: 200 });
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}