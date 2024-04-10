"use client";

import {
  Message,
  // import as useAssistant:
  experimental_useAssistant as useAssistant,
} from "ai/react";

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
  user: "black",
  function: "blue",
  assistant: "green",
  data: "orange",
};

// useChat hook by default will use the POST Route handler we created (it defaults to /api/chat). You can overrider this by passing a api prop to useChat({api:''})

import { useState } from "react";

export default function Chat() {
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: "/api/assistant" });

  return (
    <>
      <main className="mx-auto w-full p-24 flex flex-row">
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

                <ThemeSelectorBox />
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
          {messages.map((m: Message) => (
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
          ))}

          {status === "in_progress" && (
            <div className="h-8 w-full max-w-md p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
          )}
        </div>
      </main>
    </>
  );
}
