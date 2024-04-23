import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { numImages, promptMessage } = await request.json();

  try {
    // Make a request to the DALL-E API to generate the images
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: promptMessage,
          num_images: numImages,
          size: "512x512",
          response_format: "url",
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DALL-E API error:", errorData);
      throw new Error(`DALL-E API error! status: ${response.status}`);
    }
    const data = await response.json();
    const imageUrls = data.data.map((item: any) => item.url);

    return new NextResponse(JSON.stringify({ imageUrls }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to generate images:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate images" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

//below works
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     // Make a request to the DALL-E API to generate the image
//     const response = await fetch(
//       "https://api.openai.com/v1/images/generations",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//           prompt: "A beautiful landscape",
//           num_images: 1,
//           size: "512x512",
//           response_format: "url",
//         }),
//       },
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("DALL-E API error:", errorData);
//       throw new Error(`DALL-E API error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     const imageUrl = data.data[0].url;

//     return new NextResponse(JSON.stringify({ imageUrl }), {
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Failed to generate image:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Failed to generate image" }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   }
// }
