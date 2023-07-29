import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
          },
        },
      },
    });
    return reservasi;
  }),
});
