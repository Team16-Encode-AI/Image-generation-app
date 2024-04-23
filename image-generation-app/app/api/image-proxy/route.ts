export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing image URL", { status: 400 });
  }

  try {
    const response = await fetch(decodeURIComponent(imageUrl));
    const imageData = await response.arrayBuffer();

    return new Response(imageData, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
      },
    });
  } catch (error) {
    console.error("Failed to proxy image:", error);
    return new Response("Failed to proxy image", { status: 500 });
  }
}
