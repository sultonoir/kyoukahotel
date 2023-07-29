import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { UserRouter } from "./routers/User";
import { ListingsRouter } from "./routers/listing";
import { Payment } from "./routers/payment";
import { adminApi } from "./routers/adminAPI";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: UserRouter,
  listings: ListingsRouter,
  payment: Payment,
  admin: adminApi,
});

// export type definition of API
export type AppRouter = typeof appRouter;
