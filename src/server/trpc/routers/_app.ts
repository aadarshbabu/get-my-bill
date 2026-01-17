import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';


export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  protectedHello: protectedProcedure
    .query(({ctx}) => {
      return {
        greeting: `hello ${ctx.user?.fullName}`,
      };
    }),
    // Define our invoice router
});
// export type definition of API
export type AppRouter = typeof appRouter;
// add the protected procedure. 