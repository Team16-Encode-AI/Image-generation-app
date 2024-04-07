"use client";

import { ThemeSelectorBox } from "@/components/component/theme-selector-box";

export default function Main() {

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Image Generation App</h2>
          </div>

          <ThemeSelectorBox/>

        </div>
      </div>
    </main>
  );
}