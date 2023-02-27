import { initTRPC } from "@trpc/server";
import superjson from 'superjson';
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from '../db';
import {S3Service} from "~/utils/s3.service";

type CreateContextOptions = Record<string, never>;

const createInnerTRPCContext = (_opts: CreateContextOptions) => {
    return {
        prisma,
        s3Service: new S3Service()
    };
};

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
    return createInnerTRPCContext({});
};


const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
