import { $prisma } from "../../utils/openai"

export default defineEventHandler(async (event) => {
  const deleted = await $prisma.likes.delete({
    where: {id: Number(event.context.params?.id)},
  })
  return deleted;
});