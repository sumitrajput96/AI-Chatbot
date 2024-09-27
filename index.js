import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env file
config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI( process.env.API_SECRET_KEY);

// Specify the model you want to use
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Async function to call Google Generative AI and generate content
async function generate(prompt) {
  try {

    // Generate content using the model
    console.log("sdddddddddmodeddddddddddddd",model)
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

// Endpoint to handle chat messages and send responses
app.post('/api/chat', async (req, res) => {
  const { history } = req.body;
  const prompt = history.map(msg => msg.content).join(' '); // Combine history into a single prompt
  
  try {
    console.log('Received prompt:', prompt);
    const modelReply = await generate(prompt);
    console.log('Generated reply:', modelReply);
    res.json({ reply: modelReply });
  } catch (error) {
    res.status(500).send('Error generating response');
  }
});

// Server configuration
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
