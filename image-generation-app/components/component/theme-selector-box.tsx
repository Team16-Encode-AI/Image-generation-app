/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/GeDYkVw1wiI
 */
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ThemeSelectorBox() {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="flex flex-col items-center space-y-2">
        <CardTitle className="text-center"> 2.Selected Theme</CardTitle>
        <CardDescription className="text-sm leading-none">
          Choose a theme for the painting.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Button className="w-full justify-start rounded-lg" variant="outline">
            <span className="font-semibold">Classic</span>
          </Button>
          <Button className="w-full justify-start rounded-lg" variant="outline">
            <span className="font-semibold">Surreal</span>
          </Button>
          <Button className="w-full justify-start rounded-lg" variant="outline">
            <span className="font-semibold">Abstract</span>
          </Button>
          <Button className="w-full justify-start rounded-lg" variant="outline">
            <span className="font-semibold">Impressionist</span>
          </Button>
        </div>
        <Button type="submit" className="self-center">
          Compose Description
        </Button>
      </CardContent>
    </Card>
  );
}
