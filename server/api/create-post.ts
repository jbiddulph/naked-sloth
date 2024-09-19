import { $prisma } from "../utils/openai"

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let res = await $prisma.posts.create({
    data: {
      userId: body.userId,
      name: body.name,
      image: body.image,
      text: body.text,
      picture: body.picture
    }
  })
  return res;
})
