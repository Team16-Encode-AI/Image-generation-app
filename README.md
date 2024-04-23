

# Image-generation-app<img width="889" alt="Screenshot 2024-04-24 at 00 17 37" src="https://github.com/Team16-Encode-AI/Image-generation-app/assets/128807685/5cbc591c-6987-42ca-9d57-bf8559930387">

## Getting Started

- Run npm install to install all dependencies.
- Add a .env file to the root folder and include `OPENAI_API_KEY=xxxxxxxx`
- run ` npm run dev`
- Open http://localhost:3000 in your browser to see the result.


## Model:

```Dall3 3```

## Functionalities:

### Openai assistant description generation ( use OpenAI Assistants API to create threads and messages for the assistant )
- user is able to input a single word or  short description, and then pick a painting themes
- A button to send a message to the assistant for it to generate a painting description with the selected theme and display the generated text output in a text box
- Our assistant is configured the assistant prompt to be efficient at answering strictly painting descriptions with details about its elements, style, details, and colors

### Dalle image generation
- When the assistant answers,user can select image generation parameters (e.g. how many images to generate)
- User click button  to generate image based on the descriiption from assistant description and selected image generation parameter
- a loader wiill be displyed while the image is being generated
- image is displayed in the page when it is generated



## Technology stack
- Dalle
- Open AI assistant
- Next.js
- Vercel AI SDK


