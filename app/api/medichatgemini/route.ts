import { queryPineconeVectorStore } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";
import { experimental_buildLlama2Prompt } from "ai/prompts";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;
// export const runtime = 'edge';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ?? "",
});

const google = createGoogleGenerativeAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: process.env.GEMINI_API_KEY
});

// gemini-1.5-pro-latest
// gemini-1.5-pro-exp-0801
const model = google('models/gemini-1.5-pro-latest', {
    safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request, res: Response) {
    try {
        const reqBody = await req.json();
        console.log(reqBody);

        const messages: Message[] = reqBody.messages;
        const userQuestion = `${messages[messages.length - 1].content}`;

        const reportData: string = reqBody.data.reportData;
        const query = `Represent this for searching relevant passages: patient medical report says: \n${reportData}. \n\n${userQuestion}`;

        const retrievals = await queryPineconeVectorStore(pinecone, 'index-one', "ns1", query);

        const prompt = `You are a medical AI assistant that can communicate in both Bengali and English. If the user's query is in Bengali, respond in Bengali. If it's in English, respond in English.

        Here is a summary of a patient's clinical report, and a user query. Some generic clinical findings are also provided that may or may not be relevant for the report.
        Go through the clinical report and answer the user query.
        Ensure the response is factually accurate, and demonstrates a thorough understanding of the query topic and the clinical report.
        Before answering you may enrich your knowledge by going through the provided clinical findings. 
        The clinical findings are generic insights and not part of the patient's medical report. Do not include any clinical finding if it is not relevant for the patient's case.

        \n\n**Patient's Clinical report summary:** \n${reportData}. 
        \n**end of patient's clinical report** 

        \n\n**User Query:**\n${userQuestion}?
        \n**end of user query** 

        \n\n**Generic Clinical findings:**
        \n\n${retrievals}. 
        \n\n**end of generic clinical findings** 

        \n\nProvide thorough justification for your answer. If the user's query was in Bengali, provide the response in Bengali with proper Bengali medical terminology where applicable.
        \n\n**Answer:**
        `;

        const llm = genAI.getGenerativeModel({ model: "gemini-pro" });

        const response = await llm.generateContentStream([prompt]);
        const stream = GoogleGenerativeAIStream(response, {
            onStart: async () => {
                // You can use this to track usage or other events
            },
            onToken: async (token: string) => {
                // You can use this to track tokens or other events
            },
            onCompletion: async (completion: string) => {
                // Get relevant clinical findings or context
                const clinicalContext = await getClinicalContext(completion, reportData);
                return {
                    retrievals: clinicalContext
                };
            },
        });

        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error("Error in chat:", error);
        return new Response("Error processing your request", { status: 500 });
    }
}

async function getClinicalContext(completion: string, reportData: string) {
    try {
        const llm = genAI.getGenerativeModel({ model: "gemini-pro" });
        const contextPrompt = `Based on this medical report:
        ${reportData}
        
        And this response:
        ${completion}
        
        Provide relevant clinical findings and medical context that support this response. 
        Format your response in markdown.`;

        const contextResponse = await llm.generateContent([contextPrompt]);
        const result = await contextResponse.response.text();
        return result;
    } catch (error) {
        console.error("Error getting clinical context:", error);
        return "";
    }
}
