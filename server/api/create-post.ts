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


// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default defineEventHandler(async (event) => {
//   const body = await readBody(event);

//   // Ensure the `id` field or any UUID field is correctly provided
//   const { userId, name, text, picture } = body;

//   if (!userId || !name || !text) {
//     throw new Error('Missing required fields');
//   }

//   // Ensure UUID is valid and not empty
//   if (!userId || userId.length !== 36) {
//     throw new Error('Invalid UUID for userId');
//   }

//   try {
//     const res = await prisma.posts.create({
//       data: {
//         id: userId, // Ensure the correct UUID is passed here
//         name,
//         content: text,
//         picture,
//       },
//     });

//     return res;
//   } catch (error) {
//     console.error('Error creating post:', error);
//     throw error;
//   }
// });
