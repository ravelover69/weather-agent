import { LMStudioClient } from "@lmstudio/sdk";
const client = new LMStudioClient();


const model = await client.llm.model("openchat-3.5-1210");
const result = await model.respond("Tell me a joke?");

console.info(result.content);
