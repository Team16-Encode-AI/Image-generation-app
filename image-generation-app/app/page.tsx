"use client";

import {
  Message,
  // import as useAssistant:
  experimental_useAssistant as useAssistant,
} from "ai/react";

import axios from "axios";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { ThemeSelectorBox } from "@/components/component/theme-selector-box";
import { Button } from "@/components/ui/button";

const roleToColorMap: Record<Message["role"], string> = {
  system: "red",
  user: "white",
  function: "blue",
  assistant: "green",
  data: "white",
  tool: "",
};

// useChat hook by default will use the POST Route handler we created (it defaults to /api/chat). You can overrider this by passing a api prop to useChat({api:''})

import { useState, useEffect } from "react";

export default function Chat() {
  const [theme, setTheme] = useState("");
  const [finalAssistantMessage, setFinalAssistantMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: "api/assistant", body: { theme: theme } });

  async function handleImageGeneration() {
    const numImages = 2;
    const promptMessage = finalAssistantMessage;

    try {
      const response = await fetch("/api/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numImages, promptMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setImageUrl(data.imageUrls);
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  }

  //below works
  // async function handleImageGeneration() {
  //   try {
  //     const response = await fetch("/api/dalle");
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     setImageUrl(data.imageUrl);
  //   } catch (error) {
  //     console.error("Failed to generate image:", error);
  //   }
  // }

  console.log("Latest Assistant Message:", finalAssistantMessage);

  useEffect(() => {
    // Find the latest assistant message
    const lastAssistantMessage = messages
      .filter((m) => m.role === "assistant")
      .pop();

    // If there's a new assistant message, update the state
    if (lastAssistantMessage) {
      setFinalAssistantMessage(lastAssistantMessage.content);
    }
  }, [messages]); // Effect reruns whenever the messages array changes

  return (
    <>
      <main className="mx-auto w-full p-24 flex flex-rows">
        <div className="p4 m-4">
          <div className="flex flex-col items-center justify-center space-y-8 text-white">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Image Generation App</h2>

              <form onSubmit={submitMessage}>
                <Card className="w-full max-w-lg mx-auto">
                  <CardHeader className="flex flex-col items-center space-y-2">
                    <CardTitle className="text-center">
                      1. Type a simple object for your painting
                    </CardTitle>
                    <CardDescription className="text-sm leading-none">
                      some idea: cat, flower...etc
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <input
                      disabled={status !== "awaiting_message"}
                      className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
                      value={input}
                      placeholder="Blow your mind by typing a simple word - such as Cat"
                      onChange={handleInputChange}
                    />
                  </CardContent>
                </Card>

                <ThemeSelectorBox theme={theme} setTheme={setTheme} />
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
          {messages.map((m: Message) => (
            <>
              <div
                key={m.id}
                className="whitespace-pre-wrap"
                style={{ color: roleToColorMap[m.role] }}
              >
                <strong>{`${m.role}: `}</strong>
                {m.role !== "data" && m.content}
                {m.role === "data" && (
                  <>
                    {/* here you would provide a custom display for your app-specific data:*/}
                    {(m.data as any).description}
                    <br />
                    <pre className={"bg-gray-200"}>
                      {JSON.stringify(m.data, null, 2)}
                    </pre>
                  </>
                )}
                <br />
              </div>
            </>
          ))}

          {status === "in_progress" && (
            <div className="h-8 w-full max-w-md p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
          )}

          <CardContent className="flex flex-rows gap-4">
            <div className=" grid gap-4 md:grid-cols-2" role="group">
              <label
                htmlFor="button_1"
                className="has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-900 w-full py-2 px-4  flex items-center  rounded-lg font-semibold border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 focus:bg-gray-200 "
              >
                1
                <input
                  className="hidden checked:border-indigo-500"
                  id="button_1"
                  type="radio"
                  name="radio"
                  value="1"
                />
              </label>
            </div>
            <div className=" grid gap-4 md:grid-cols-2" role="group">
              <label
                htmlFor="button_2"
                className="has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-900 w-full py-2 px-4  flex items-center  rounded-lg font-semibold border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 focus:bg-gray-200 "
              >
                2
                <input
                  className="hidden checked:border-indigo-500"
                  id="button_2"
                  type="radio"
                  name="radio"
                  value="2"
                />
              </label>
            </div>
            <Button onClick={handleImageGeneration} className="self-center">
              Generate Image
            </Button>

            {imageUrl && (
              <div>
                {imageUrl.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Generated Image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </main>
    </>
  );
}
