import { $openai } from '../utils/openai'

export default defineEventHandler(async (event) => {
  const { message } = await readBody(event)
  const data = await $openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: "You are a rapper, you are creative with words and can create amazing lyrics." },
      { role: "user", content: message + ". Generated with paragraphs for verses. Formatted with paragraphs html code. Just display the what is requested, nothing else." }
    ]
  });

  return data.choices[0].message;
});