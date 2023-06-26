import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import bcrypt from "bcrypt";
import { prisma } from "@/server/db";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getUser: publicProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        email: ctx.session?.user.email as string,
      },
    });
    return user;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(2, {
            message: "name must be at least 2 characters",
          })
          .max(50),
        password: z
          .string()
          .min(8, {
            message: "password must be at least 8 characters",
          })
          .max(50),
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new Error("E-mail has been used.");
      }
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const register = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          hashedPassword,
        },
      });
      return register;
    }),
});
