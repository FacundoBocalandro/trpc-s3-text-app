import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { prisma } from '../db'
import { S3Service } from '~/utils/s3.service'

const createInnerTRPCContext = () => {
  return {
    prisma,
    s3Service: new S3Service(),
  }
}

export const createTRPCContext = () => {
  return createInnerTRPCContext()
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
