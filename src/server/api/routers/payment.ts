import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";

const ee = new EventEmitter();
export const Payment = createTRPCRouter({
  getReservationsPending: publicProcedure.query(async ({ ctx }) => {
    const reservasi = await ctx.prisma.reservation.findMany({
      where: {
        guestEmail: ctx.session?.user.email as string,
        status: "pending",
      },
      include: {
        listing: {
          include: {
            imageSrc: true,
            fasilitas: true,
            user: true,
          },
        },
      },
    });
    return reservasi;
  }),
  subsUser: publicProcedure.subscription(({ ctx }) => {
    return observable<string>((emit) => {
      const testFunctions = () => {
        emit.next("hallo");
      };
      ee.on("add", testFunctions);
      return () => {
        ee.off("add", testFunctions);
      };
    });
  }),
  testMutate: protectedProcedure.mutation(() => {
    ee.emit("add");
  }),
});
