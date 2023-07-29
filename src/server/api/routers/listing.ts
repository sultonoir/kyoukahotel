/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { stripe } from "@/lib/stripe";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type Fasilitas } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";
const ee = new EventEmitter();
export const ListingsRouter = createTRPCRouter({
  deleteListing: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        listingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletById = await ctx.prisma.listing.deleteMany({
        where: {
          id: input.listingId,
          adminId: input.userId,
        },
      });
      return deletById;
    }),
  editListings: publicProcedure
    .input(
      z.object({
        listingId: z.string(),
        title: z.string(),
        description: z.string().min(2).max(1000),
        guestCount: z.number().min(1).max(10, {
          message: "max 10 guest",
        }),
        price: z.number(),
        bed: z.number(),
        roomCount: z.number(),
        discount: z.number().min(0).max(100).optional(),
        imagePromosi: z.string().optional(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        listingId,
        title,
        description,
        guestCount,
        price,
        bed,
        roomCount,
        discount,
        imagePromosi,
        userId,
      } = input;

      const updatedListing = await ctx.prisma.listing.update({
        where: {
          id: listingId,
        },
        data: {
          title: title,
          description: description,
          guestCount: guestCount,
          price: price,
          bed: bed,
          roomCount: roomCount,
          discount: discount,
          imagePromo: imagePromosi,
          adminId: userId,
        },
        include: {
          imageSrc: true,
        },
      });

      return updatedListing;
    }),
  getListingById: publicProcedure
    .input(z.object({ listingId: z.string() }))
    .query(async ({ ctx, input }) => {
      const listings = await ctx.prisma.listing.findUnique({
        where: {
          title: input.listingId,
        },
        include: {
          imageSrc: true,
          fasilitas: true,
        },
      });
      return listings;
    }),
  deleteImageByListing: publicProcedure
    .input(
      z.object({
        listingId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteImage = await ctx.prisma.image.deleteMany({
        where: {
          id: input.id,
          listingId: input.listingId,
        },
      });
      return deleteImage;
    }),
  createImage: publicProcedure
    .input(
      z.object({
        listingId: z.string(),
        image: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createImg = await ctx.prisma.image.createMany({
        data: input.image.map((item) => ({
          img: item,
          listingId: input.listingId,
        })),
      });
      return createImg;
    }),
  onAdd: publicProcedure.subscription(() => {
    // Kembalikan 'yang dapat diamati' dengan panggilan balik yang segera dipicu
    return observable<Fasilitas>((emit) => {
      const onAdd = (data: Fasilitas) => {
        // emit data to client
        emit.next(data);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on("add", onAdd);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off("add", onAdd);
      };
    });
  }),
  deleteFasilitas: publicProcedure
    .input(
      z.object({
        listingId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.listing.update({
        where: {
          id: input.listingId,
        },
        data: {
          fasilitas: {
            delete: {
              id: input.id,
            },
          },
        },
        include: {
          fasilitas: true,
        },
      });
      ee.emit("add", post);
      return post;
    }),
  createFasilitas: publicProcedure
    .input(
      z.object({
        listingId: z.string(),
        fasi: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createFasilitas = await ctx.prisma.fasilitas.createMany({
        data: input.fasi.map((item) => ({
          fasilitas: item,
          listingId: input.listingId,
        })),
      });
      return createFasilitas;
    }),
  getReservations: publicProcedure.query(async ({ ctx }) => {
    const reservations = await ctx.prisma.reservation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return reservations;
  }),
  completeReservation: publicProcedure
    .input(
      z.object({
        reservationsId: z.string(),
        rooms: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const complete = await ctx.prisma.reservation.update({
        where: {
          id: input.reservationsId,
        },
        data: {
          status: "completed",
          listing: {
            update: {
              roomCount: {
                increment: input.rooms,
              },
            },
          },
          user: {
            update: {
              hasNotifi: true,
              notifi: {
                create: {
                  message:
                    "thank you for staying at our hotel, don't forget to give ratings",
                  guestName: ctx.session?.user.name,
                  guestImage: ctx.session?.user.image,
                },
              },
            },
          },
        },
      });
      return complete;
    }),
  // createReservasi: publicProcedure
  //   .input(
  //     z.object({
  //       totalPrice: z.number(),
  //       title: z.string(),
  //       rooms: z.number(),
  //       starDate: z.date(),
  //       endDate: z.date(),
  //       userId: z.string(),
  //       guestName: z.string().optional(),
  //       guestImage: z.string().optional(),
  //       guestEmail: z.string().optional(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const listing = await ctx.prisma.listing.findUnique({
  //       where: {
  //         title: input.title,
  //       },
  //     });

  //     if (listing?.roomCount === 0) {
  //       throw new Error("room not available.");
  //     }
  //     const successUrl = `http://localhost:3000/admin`;
  //     const cancelUrl = `http://localhost:3000/admin`;

  //     await ctx.prisma.listing.update({
  //       where: {
  //         title: input.title,
  //       },
  //       data: {
  //         roomCount: {
  //           decrement: input.rooms,
  //         },
  //         reservations: {
  //           create: {
  //             totalPrice: input.totalPrice,
  //             rooms: input.rooms,
  //             startDate: input.starDate,
  //             endDate: input.endDate,
  //             guestName: input.guestName,
  //             guestEmail: input.guestEmail,
  //             guestImage: input.guestImage,
  //             guestId: input.userId,
  //             userId: input.guestEmail,
  //             status: "pending",
  //             title: input.title,
  //             adminId: input.adminId
  //           },
  //         },
  //       },
  //       include: {
  //         reservations: true,
  //       },
  //     });
  //     const reser = await ctx.prisma.reservation.findFirst({
  //       where: {
  //         userId: input.guestEmail,
  //       },
  //     });
  //     const payment = await stripe.checkout.sessions.create({
  //       line_items: [
  //         {
  //           price_data: {
  //             currency: "idr",
  //             product_data: {
  //               name: input.title,
  //             },
  //             unit_amount: input.totalPrice * 100,
  //           },
  //           quantity: 1,
  //         },
  //       ],
  //       invoice_creation: {
  //         enabled: true,
  //         invoice_data: {
  //           description: `Invoice for ${input.title}`,
  //           metadata: {
  //             name: input.guestName ?? "",
  //             email: input.guestEmail ?? "",
  //             reservationsId: reser?.id ?? "",
  //             from: "kyouka",
  //           },
  //           custom_fields: [
  //             {
  //               name: "Purchase Order",
  //               value: "PO-XYZ",
  //             },
  //           ],
  //           rendering_options: {
  //             amount_tax_display: "include_inclusive_tax",
  //           },
  //           footer: "B2B Inc.",
  //         },
  //       },
  //       metadata: {
  //         name: input.guestName ?? "",
  //         email: input.guestEmail ?? "",
  //       },
  //       mode: "payment",
  //       success_url: successUrl,
  //       cancel_url: cancelUrl,
  //     });
  //     return payment.url;
  //   }),
  getInvoice: publicProcedure
    .input(
      z.object({
        email: z.string(),
        reservationsId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.reservation.update({
        where: {
          id: input.reservationsId,
        },
        data: {
          status: "success",
        },
      });
      const invoicesPromise = await stripe.invoices.search({
        query: `total>999 AND metadata['email']:'${
          input.email ?? ""
        }' AND metadata['reservationsId']:'${input.reservationsId ?? ""}'`,
      });
      const customers = invoicesPromise.data;
      const [custom] = customers.map((cus) => ({ ...cus }));

      return custom?.hosted_invoice_url;
    }),
  getListings: publicProcedure.query(async ({ ctx }) => {
    const listings = await ctx.prisma.listing.findMany({
      include: {
        imageSrc: {
          orderBy: {
            createdAt: "desc",
          },
        },
        fasilitas: true,
        reservations: true,
      },
      orderBy: {
        price: "asc",
      },
    });
    return listings;
  }),
  getReservationsId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await fetch(
        `https://api.sandbox.midtrans.com/v2/${input.id}/status`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization:
              "Basic U0ItTWlkLXNlcnZlci1HRkFPQWczc1ZmU2F3X3IwZmlNLTFINmU6",
          },
        }
      );
      const data = await response.json();
      const reserv = await ctx.prisma.reservation.findUnique({
        where: {
          id: input.id,
        },
      });
      if (reserv?.status === "completed") {
        return null;
      }
      if (reserv?.status === "rattings") {
        return null;
      }
      let status = "";

      if (data.transaction_status === "capture") {
        status = "success";
      }
      if (data.transaction_status === "settlement") {
        status = "success";
      }
      if (data.transaction_status === "deny") {
        status = "failed";
      }
      if (data.transaction_status === "expire") {
        status = "failed";
      }

      const res = await ctx.prisma.reservation.update({
        where: {
          id: input.id,
        },
        data: {
          status: status,
        },
      });

      return res;
    }),
  deleteReservasi: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const reservasi = await ctx.prisma.reservation.delete({
          where: {
            id: input.id,
          },
        });
        return reservasi;
      } catch (error) {
        throw new Error("Deleted error");
      }
    }),
});
