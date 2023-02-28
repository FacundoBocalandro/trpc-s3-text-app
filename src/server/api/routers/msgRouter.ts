import { createTRPCRouter, publicProcedure } from '../trpc'
import { z } from 'zod'
import * as crypto from 'crypto'

export const msgRouter = createTRPCRouter({
  add: publicProcedure
    .input(
      z
        .object({
          text: z.string(),
          hasImage: z.boolean(),
          imageExtension: z.string().optional(),
        })
        .refine(
          (schema) => (schema.hasImage ? !!schema.imageExtension : true),
          {
            message: 'Image extension is required if message has image',
          }
        )
    )
    .mutation(async ({ input, ctx }) => {
      if (input.hasImage) {
        const imageKey = `${crypto.randomBytes(32).toString('base64')}.${
          input.imageExtension
        }`
        await ctx.prisma.message.create({
          data: { text: input.text, imageKey },
        })
        return await ctx.s3Service.getUrlToUpload(imageKey)
      }
      await ctx.prisma.message.create({
        data: { text: input.text },
      })
      return null
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
    return await Promise.all(
      messages.map(async (message) => {
        const assetUrl = message.imageKey
          ? await ctx.s3Service.getSignedAssetUrl(message.imageKey)
          : null
        return {
          ...message,
          imageUrl: assetUrl,
        }
      })
    )
  }),
})
