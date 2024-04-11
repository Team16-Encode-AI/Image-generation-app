import OpenAI from "openai";

import { experimental_AssistantResponse } from "ai";

const assiistantId = "asst_v7SJWY1hV7v1G3dLMdq5UWc4";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const homeTemperatures = {
  bedroom: 20,
  "home office": 21,
  "living room": 21,
  kitchen: 22,
  bathroom: 23,
};

export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null;
    message: string;
    theme: string;
  } = await req.json();

  // Create a thread if needed
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: `${input.theme} style and in  ${input.message} subject`,
  });

  return experimental_AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream, sendDataMessage }) => {
      // Run the assistant on the thread
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id: assiistantId,
      });

      // forward run status would stream message deltas
      let runResult = await forwardStream(runStream);

      // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
      while (
        runResult?.status === "requires_action" &&
        runResult.required_action?.type === "submit_tool_outputs"
      ) {
        const tool_outputs =
          runResult.required_action.submit_tool_outputs.tool_calls.map(
            (toolCall: any) => {
              const parameters = JSON.parse(toolCall.function.arguments);

              switch (toolCall.function.name) {
                case "getRoomTemperature": {
                  const temperature =
                    homeTemperatures[
                      parameters.room as keyof typeof homeTemperatures
                    ];

                  return {
                    tool_call_id: toolCall.id,
                    output: temperature.toString(),
                  };
                }

                case "setRoomTemperature": {
                  const oldTemperature =
                    homeTemperatures[
                      parameters.room as keyof typeof homeTemperatures
                    ];

                  homeTemperatures[
                    parameters.room as keyof typeof homeTemperatures
                  ] = parameters.temperature;

                  sendDataMessage({
                    role: "data",
                    data: {
                      oldTemperature,
                      newTemperature: parameters.temperature,
                      description: `Temperature in ${parameters.room} changed from ${oldTemperature} to ${parameters.temperature}`,
                    },
                  });

                  return {
                    tool_call_id: toolCall.id,
                    output: `temperature set successfully`,
                  };
                }

                default:
                  throw new Error(
                    `Unknown tool call function: ${toolCall.function.name}`,
                  );
              }
            },
          );

        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(
            threadId,
            runResult.id,
            { tool_outputs },
          ),
        );
      }
    },
  );
}

// export async function POST(req: Request) {
//   const { genre, subject, accessory, activity, location } = await req.json();
//   let content = `a ${genre} of story`;

//   const thread = await openai.beta.threads.create();
//   await openai.beta.threads.messages.create(thread.id, {
//     content,
//     role: "user",
//   });
//   const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
//     assistant_id: assiistantId,
//   });

//   if (run.status != "completed") {
//     throw new Error(`Unexpected run status: ${run.status} `);
//   }

//   const message = await openai.beta.threads.messages.list(thread.id);
//   return new Response(
//     JSON.stringify({ prompt: message.data[0].content[0].text.value }),
//   );
// }
