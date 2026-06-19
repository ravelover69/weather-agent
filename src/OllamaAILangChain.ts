import { createAgent, tool, initChatModel, type ToolRuntime, toolStrategy } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import * as z from "zod";
import {ChatOpenAI, OpenAI} from "@langchain/openai";
import { Agent } from "@openai/agents";
import { ChatOllama } from "@langchain/ollama";

//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
//6e54f547db3e4b9ea6c55493568ca61b.Y9I1_8qEjgqF6kk5pXDMqKGI
// Define system prompt
const instructions = `You are an expert weather forecaster.

You have access to tool:

- get_weather_for_location: use this tool to get the temperature for a specific location
- get_user_location: use this to get the user's location based on IP address.
- get_user_ip: use this to get the user's IP address

If a user asks you for the temperature, first use the get_user_ip tool to find the user's IP address. Then use the get_user_location tool to find the user's location. Then use the get_weather_for_location tool 
to get the temperature for that location.`;

const WEATHR_API_KEY = "6793731f5b5aa354c422acd15a89e2a1";
const IP_GEO_API_KEY = "6CD8C497F43C625B51E0DA27366AFD1E"; //https://www.ip2location.io/dashboard
const IP_GEOLOCATION_KEY = "4f7982d09207f5a03aa8eedf48ee6a165586c1b8b57f59c13345d443"; //https://dashboard.ipdata.co/



// Define tools
const getWeather = tool(
    async ({city}: {city: string}) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHR_API_KEY}&units=metric`);
    const data = await response.json();
    return data.main.temp +' Celsius';
},
    {
        name: "get_weather_for_location",
        description: "Get the temperature for a given city",
        schema: z.object({
            city: z.string(),
        }),
    }
);

const getUserLocation = tool(
    async ({ip}: {ip: string}) => {
        const response = await fetch(`https://api.ip2location.io/?key=6CD8C497F43C625B51E0DA27366AFD1E&ip=${ip}`);
        const data = await response.json();
        return data.city_name + ', ' + data.region_name;
},
    {
        name: "get_user_location",
        description: "Retrieve user information based on IP address",
        schema: z.object({
            ip: z.string(),
        }),
    }
);


const getUserIP = tool(
    async () => {
        const response = await fetch(`https://api.ipdata.co?api-key=${IP_GEOLOCATION_KEY}`)
        const data = await response.json();
        return data.ip;
},
    {
        name: "get_user_ip",
        description: "Retrieve user IP address.",
        schema: z.object({}),
    }
);

// Define response format
const responseFormat = z.object({
    punny_response: z.string(),
    weather_conditions: z.string().optional(),
});



const myModel2 = new ChatOllama({
    
    model: "qwen3-coder:480b-cloud",//model:"gpt-oss:20b",
    temperature: 0.1,
    //timeout:30,
    maxRetries: 1,
    baseUrl:"https://ollama.com/"
})


// Set up memory
const checkpointer = new MemorySaver();

const agent2 = createAgent({
  name: 'Weather Man',
  model: myModel2,
  systemPrompt: instructions,
  //responseFormat: responseFormat,
  //checkpointer: checkpointer,
 tools: [ getWeather, getUserLocation, getUserIP]

})

const config = {
    stream: false,
    //timeout:10000,
    recursionLimit: 500,
};

const response1 = await agent2.invoke({
    messages: [

{role: "user", content: `What is the temperature outside in celsius? Display the response in structured format`}]
  },config)


console.log('Structured Response', response1.structuredResponse);
console.log('Full Response', response1);
//console.log(response1.structuredResponse.punny_response)
//console.log(response1.structuredResponse.weather_conditions)

//console.log(response1.structuredResponse)