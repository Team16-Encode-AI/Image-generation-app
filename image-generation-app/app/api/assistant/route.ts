import OpenAI from "openai";

import { experimental_AssistantResponse } from "ai";

const assistantId = "asst_v7SJWY1hV7v1G3dLMdq5UWc4";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null;
    message: string;
    theme: string;
  } = await req.json();

  // Create a thread if needed
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  // Add and compose a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: `${input.theme} style and in  ${input.message} subject`,
  });

  return experimental_AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      // Run the assistant on the thread
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId,
      });

      // forward run status would stream message deltas
      let runResult = await forwardStream(runStream);

      console.log(runResult);
    },
  );
}
