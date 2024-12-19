import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { image } = await req.json();
        
        if (!image) {
            return new Response(JSON.stringify({ error: "No image provided" }), {
                status: 400,
            });
        }

        // Remove the data URL prefix
        const base64Image = image.split(',')[1];

        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        
        const prompt = `You are a medical report analyzer. Extract and summarize the key information from this medical report image. 
        Include important details like:
        - Patient information
        - Diagnosis
        - Test results
        - Recommendations
        
        Format the information in a clear, organized way.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        return new Response(JSON.stringify({ text }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error processing image:', error);
        return new Response(JSON.stringify({ error: "Failed to process image" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
