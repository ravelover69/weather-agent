 import * as readline from 'node:readline/promises';
 import { stdin as input, stdout as output } from 'node:process';

import { Agent } from "@voltagent/core";

//export OPENAI_API_KEY="some key"; export OPENAI_BASE_URL="http://127.0.0.1:8000/v1"


const agent = new Agent({
  name: "openai-summary",
  instructions: "Summarize the update in 2 bullets.",
  model: "openai/mlx-community/Llama-3.2-3B-Instruct-4bit",
});


 const options = {
  allowSystemInMessages: true
 }


 const result = await agent.generateText("What is Tell me a joke?", options);
 console.log(result.text);

// agent.generateText("Hello, how are you?").then((response) => {
//   console.log("Generated Text:", response);
// });




  // const rl = readline.createInterface({ input, output });

  // let keepLooping = true;

  // while (keepLooping) {
  //   // The await keyword causes the loop to pause and wait for input
  //   const answer = await rl.question('Enter something (type "exit" to quit): ');

  //   if (answer.trim().toLowerCase() === 'exit') {
  //     console.log('Goodbye!');
  //     keepLooping = false;
  //   } else {
  //     const result = await agent.generateText(answer.trim().toLowerCase());
  //     console.log(`Generated Text: ${result.text}`);
  //   }
  // }

  // // Always close the interface to prevent memory leaks and free the process
  // rl.close();