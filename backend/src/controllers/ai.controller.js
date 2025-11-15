import { GoogleGenAI } from "@google/genai";
import Invoice from "../models/invoice.model.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/* @desc Parse invoice data from text using AI
   @route POST /api/ai/parse-text
   @access Private 
*/
export const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    // Implementation here
    const prompt = `
    You are an expert invoice data extraction AI. Analyze the following text and extract the relevant information to create an invoice.
    The output MUST be a valid JSON object.
    
    The JSON object should have the following structure:
    {
      "clientName": "string",
      "email":"string (if available)"
       "address":"string (if available)"
        "items":[
        {
          "name":"string",
          "quantity":"number",
          "unitPrice":"number"
        }
        ]
    }

    Here is the text to parse:
    --- TEXT START ---
    ${text}
      --- TEXT END ---

      Extract the data and provide only the JSON object.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text;

    if (typeof responseText !== "string") {
      if(typeof response.text === 'function'){
        responseText= response.text();
      } else{
        throw new Error("Could not extract from AI response.")
      }
    }

    const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(cleanedJson)
    res.status(200).json(parsedData)
  } catch (e) {
    console.log("Error parsing invoice with AI", e);
    res.status(500).json({
      message: "Failed to parse invoice data from text.",
      details: e.message,
    });
  }
};

/* @desc Generate reminder email for invoice using AI
   @route POST /api/ai/generate-reminder
   @access Private 
*/
export const generateReminderEmail = async (req, res) => {
  try {
    // Implementation here
  } catch (e) {
    console.log("Error generating reminder email", e);
    res.status(500).json({
      message: "Failed to generate reminder email.",
      details: e.message,
    });
  }
};

/* @desc Get AI-generated dashboard summary
   @route GET /api/ai/dashboard-summary
   @access Private 
*/
export const getDashboardSummary = async (req, res) => {
  try {
    // Implementation here
  } catch (e) {
    console.log("Error fetching dashboard summary", e);
    res.status(500).json({
      message: "Failed to fetch dashboard summary.",
      details: e.message,
    });
  }
};
