import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('No GEMINI_API_KEY found in .env');
    process.exit(1);
}

async function listModels() {
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();

        if (data.models) {
            console.log('Available models:');
            data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods));
        } else {
            console.log('No models returned:', data);
        }
    } catch (e) {
        console.error('Error fetching models:', e);
    }
}

listModels();
