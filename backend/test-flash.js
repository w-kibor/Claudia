import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('No GEMINI_API_KEY found in .env!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function run() {
  console.log('Testing gemini-2.5-flash using .env key (Key is hidden)...');
  try {
    const result = await model.generateContent('say hello');
    console.log('Success:', result.response.text());
  } catch (err) {
    console.error('Error:', err.message);
  }
}
run();
