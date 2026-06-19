import { OpenAI } from 'openai';
import { setDefaultOpenAIClient, Agent, run } from '@openai/agents';
import { ChatOpenAI } from '@langchain/openai';
import { ChatOllama } from '@langchain/ollama';
import { createAgent } from 'langchain';

// 1. Initialize the core OpenAI client with your custom baseURL


const model1 = new ChatOpenAI({
  configuration: {
    baseURL: 'http://127.0.0.1:8000/v1', // Replace with your target URL
  },
  
  apiKey: 'some key',
  model: 'mlx-community/Llama-3.2-3B-Instruct-4bit',
  temperature: 0.1,
  maxRetries: 1,
  useResponsesApi: false, // Forces the classic Chat Completions endpoint
});


const agent2 = createAgent({
  name: 'Weather Man',
  model: model1
})


const config = {
    stream: false,
    //timeout:10000,
    recursionLimit: 500,
};

const response1 = await agent2.invoke({
    messages: [

{role: "user", content: `Tell me a joke about AI and programming. Display the response in structured format`}]
  },config)


console.log('Structured Response', response1.structuredResponse);
console.log('Full Response', response1);


// model1.invoke(  "Hello, how are you?")
//   .then(response => console.log("Model response:", response))
//   .catch(error => console.error("Error invoking model:", error)); 

// // 3. Define and run your agent normally
// const agent = new Agent({
//   name: 'JokeTeller',
//   //model: model1,
//   instructions: 'Tell me a joke',
// });

// await run(agent, 'Hello!');
