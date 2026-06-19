import { createAgent, tool, initChatModel, type ToolRuntime } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import * as z from "zod";
import {ChatOpenAI} from "@langchain/openai";
import { Agent, run } from "@openai/agents";




// Define system prompt
const systemPrompt = `You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location.`;

// Define tools
const getWeather = tool(
    ({ city }) => `It's always sunny in ${city}!`,
    {
        name: "get_weather_for_location",
        description: "Get the weather for a given city",
        schema: z.object({
            city: z.string(),
        }),
    }
);

type AgentRuntime = ToolRuntime<unknown, { user_id: string }>;

const getUserLocation = tool(
    (_, config: AgentRuntime) => {
        const { user_id } = config.context;
        return user_id === "1" ? `Florida` : `SF`;
    },
    {
        name: "get_user_location",
        description: "Retrieve user information based on user ID",
        schema: z.object({}),
    }
);

// // Configure model
// const model = await initChatModel(
//     "ai/smollm2",

//     { temperature: 0 }
// );


// const llmCustomURL = new OpenAI({
//     temperature: 0.9,
//     model:"ai/smollm2",
//     configuration: {
//         baseURL: "http://localhost:12434/engines/v1",
//     },
// });


const model2 = new ChatOpenAI({
    model:"ai/smollm2",
    configuration: {
        baseURL: "http://localhost:12434/engines/v1",
        apiKey: "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",
    },
}).bindTools([getUserLocation, getWeather]);


// Define response format
const responseFormat = z.object({
    punny_response: z.string(),
    weather_conditions: z.string().optional(),
});

// Set up memory
const checkpointer = new MemorySaver();

// Create agent
const agent = new Agent({
    name: "Weather Man",
    model2,
    systemPrompt,
    ////responseFormat,
    checkpointer,
    //tools: [getUserLocation, getWeather],
});

// Run agent
// `thread_id` is a unique identifier for a given conversation.
const config = {
    configurable: { thread_id: "1" },
    context: { user_id: "1" },
    configuration: {
        baseURL: "http://localhost:12434/engines/v1",
        apiKey: "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",
    },
};
const response = await run(agent, 'What is the weather in New York?', {maxTurns: 5});

console.log(response);


// const response = await agent.invoke(
//     { messages: [{ role: "user", content: "what is the weather outside?" }] },
//     config
// );
console.log(response.structuredResponse);
// {
//   punny_response: "Florida is still having a 'sun-derful' day! The sunshine is playing 'ray-dio' hits all day long! I'd say it's the perfect weather for some 'solar-bration'! If you were hoping for rain, I'm afraid that idea is all 'washed up' - the forecast remains 'clear-ly' brilliant!",
//   weather_conditions: "It's always sunny in Florida!"
// }

// Note that we can continue the conversation using the same `thread_id`.
// const thankYouResponse = await agent.invoke(
//     { messages: [{ role: "user", content: "thank you!" }] },
//     config
// );
//console.log(thankYouResponse.structuredResponse);
// {
//   punny_response: "You're 'thund-erfully' welcome! It's always a 'breeze' to help you stay 'current' with the weather. I'm just 'cloud'-ing around waiting to 'shower' you with more forecasts whenever you need them. Have a 'sun-sational' day in the Florida sunshine!",
//   weather_conditions: undefined
// }