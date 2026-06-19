import { GoogleGenAI } from '@google/genai';

// Initialize Vertex with your Cloud project and location
const ai = new GoogleGenAI({
    apiKey: 'AIzaSyD1GVGCCB1tcxGaW8uJd2c7wNSPMu-ERTQ',
});

const config = {
    pageSize: 10
}

const models = await ai.models.list({config});
for await (const model of models) {
    console.log(model.name);
}
const model = 'gemini-2.5-flash';

const tools = [
    {
        googleSearch: {},
    },
];

// Set up generation config
const generationConfig = {
    maxOutputTokens: 65535,
    temperature: 1,
    topP: 0.95,
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'OFF',
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'OFF',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'OFF',
        },
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'OFF',
        }
    ],
    tools: tools,
};


async function generateContent() {
    const req = {
        model: model,
        contents: ['tell me joke'
        ],
        config: generationConfig,
    };

    const streamingResp = await ai.models.generateContentStream(req);

    for await (const chunk of streamingResp) {
        if (chunk.text) {
            process.stdout.write(chunk.text);
        } else {
            process.stdout.write(JSON.stringify(chunk) + '\n');
        }
    }
}

generateContent();