import { GoogleGenAI, Modality } from "@google/genai";
import { UploadedImage } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const HUG_PROMPT = `Given these two photos, one of a person as a child and one as an adult, create a new photorealistic image. In the new image, the adult version of the person should be warmly and lovingly hugging their younger, child self. Place them in a pleasant, softly lit outdoor setting like a park or garden during a sunny day. The style should be that of a heartfelt, professional photograph. Ensure the final image is a single, cohesive picture. The final image should only contain the two people hugging.`;

export const generateHugImage = async (kidImage: UploadedImage, adultImage: UploadedImage): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: kidImage.base64,
              mimeType: kidImage.mimeType,
            },
          },
          {
            inlineData: {
              data: adultImage.base64,
              mimeType: adultImage.mimeType,
            },
          },
          {
            text: HUG_PROMPT,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    // Fallback if no image is found in parts, check for text response for debugging
    const textResponse = response.text;
    throw new Error(`Model did not return an image. Response: ${textResponse || 'No text response'}`);

  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
