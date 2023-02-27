import {msgRouter} from "~/server/api/routers/msgRouter";
import {createTRPCRouter} from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
    msg: msgRouter,
});

export type AppRouter = typeof appRouter;
