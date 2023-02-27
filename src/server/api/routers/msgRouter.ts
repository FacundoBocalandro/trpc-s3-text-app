import { createTRPCRouter, publicProcedure } from '../trpc'
import { z } from 'zod'

export const msgRouter = createTRPCRouter({
  add: publicProcedure
    .input(
      z.object({
        text: z.string(),
        hasImage: z.boolean(),
        imageKey: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.hasImage && input.imageKey) {
        const message = await ctx.prisma.message.create({
          data: { text: input.text, imageKey: input.imageKey },
        })
        const uploadUrl = await ctx.s3Service.getUrlToUpload(input.imageKey)
        const assetUrl = await ctx.s3Service.getSignedAssetUrl(input.imageKey)
        return {
          uploadUrl,
          message: {
            ...message,
            imageUrl: assetUrl
          },
        }
      }
      const message = await ctx.prisma.message.create({
        data: { text: input.text },
      })
      return { message: { ...message, imageUrl: null } }
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
        imageKey: z.string().nullable(),
      })
    )
    .mutation(({ input, ctx }) => {
      if (input.imageKey) ctx.s3Service.deleteSignedFile(input.imageKey)
      return ctx.prisma.message.delete({ where: { id: input.id } })
    }),
  list: publicProcedure.query(async ({ ctx }) => {
    const messages = await ctx.prisma.message.findMany()
    return await Promise.all(messages.map(async (message) => {
      const assetUrl = message.imageKey ? await ctx.s3Service.getSignedAssetUrl(message.imageKey) : null;
      return {
        ...message,
        imageUrl: assetUrl,
      }
    }))
  }),
})
