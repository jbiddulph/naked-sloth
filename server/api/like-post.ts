import { $prisma } from "../utils/openai"

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let res = await $prisma.likes.create({
    data: {
      userId: body.userId,
      postId: body.postId
    }
  })
  return res;
})
