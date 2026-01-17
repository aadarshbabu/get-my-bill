import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import SuperJSON from 'superjson';



import { currentUser } from '@clerk/nextjs/server';

type Context = {
  user: Awaited<ReturnType<typeof currentUser>>;
};


export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const user = await currentUser();
  console.log("createTRPCContext user:", user?.id);
  return { user };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: SuperJSON,
});

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { user: ctx.user } });
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);