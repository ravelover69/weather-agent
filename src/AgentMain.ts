import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import { tool, type ToolRuntime } from "langchain";
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
//const ai = new GoogleGenAI({});

const ai = new GoogleGenAI({
    //apiKey: process.env.GEMINI_API_KEY, //'AIzaSyD1GVGCCB1tcxGaW8uJd2c7wNSPMu-ERTQ',
    apiKey: 'AIzaSyD1GVGCCB1tcxGaW8uJd2c7wNSPMu-ERTQ',
 });
const systemPrompt = `You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can't tell from the question that they mean wherever they are, use the get_user_location tool to find their location.`;


// //Define a Tool
const getWeather = tool(
  ({ city }) => `It's always sunny in ${city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string(),
    }),
  },
);

type AgentRuntime = ToolRuntime<unknown, { user_id: string }>;
const checkpointer = new MemorySaver();

const getUserLocation = tool(
  (_, config: AgentRuntime) => {
    const { user_id } = config.context;
    return user_id === "1" ? "Florida" : "SF";
  },
  {
    name: "get_user_location",
    description: "Retrieve user information based on user ID",
  }
);

const responseFormat = z.object({
  punny_response: z.string(),
  weather_conditions: z.string().optional(),
});

const agent = createAgent({
  model: "gemini-2.5-pro",
  systemPrompt: systemPrompt,
  tools: [getUserLocation, getWeather],
  responseFormat,
  checkpointer,
});



const config = {
  configurable: { thread_id: "1" },
  context: { user_id: "1" },
};

const response = await agent.invoke(
  { messages: [{ role: "user", content: "what is the weather outside?" }] },
  config
);

//console.log(response.structuredResponse);
// {
//   punny_response: "Florida is still having a 'sun-derful' day ...",
//   weather_conditions: "It's always sunny in Florida!"
// }

// Note that we can continue the conversation using the same `thread_id`.
// const thankYouResponse = await agent.invoke(
//   { messages: [{ role: "user", content: "thank you!" }] },
//   config
// );
//console.log(thankYouResponse.structuredResponse);
// {
//   punny_response: "You're 'thund-erfully' welcome! ...",
//   weather_conditions: undefined
// }



async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
}

//main();
