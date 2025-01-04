const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure the API key is set in your environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
console.log(genAI);

// Initialize the Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class LangChain {
  async processMessage(message, fileData) {
    // Use Gemini model to process the message
    const geminiResponse = await this.callGeminiModel(message, fileData);

    return geminiResponse;
  }

  async callGeminiModel(message, fileData) {
    try {
      // Define the system prompt for fine-tuning
      const systemPrompt = "Provide a short and concise answer based on the following context:";

      // Combine the system prompt, message, and file data for fine-tuning
      const fineTunedMessage = `${systemPrompt} ${message} ${JSON.stringify(fileData)}`;

      // Call the Gemini model API
      const response = await model.generateContent(fineTunedMessage);
      console.log('Gemini API Response:', response); // Log the response for debugging

      // Ensure the response has the expected structure
      if (response && response.response && response.response.text) {
        const result = await response.response.text();
        return result;
      } else {
        throw new Error('Unexpected response structure from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini model:', error);
      throw error;
    }
  }
}

module.exports = { LangChain };
