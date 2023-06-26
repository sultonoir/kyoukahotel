/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { prisma } from "@/server/db";
import bcrypt from "bcrypt";
import { stripe } from "@/lib/stripe";

export const UserRouter = createTRPCRouter({
  getAdmin: publicProcedure.query(async ({ ctx }) => {
    const admin = await ctx.prisma.user.findMany({
      where: {
        role: "admin",
      },
    });
    return [admin];
  }),
  getUser: publicProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        email: ctx.session?.user.email as string,
      },
      include: {
        reservations: {
          include: {
            listing: {
              include: {
                imageSrc: true,
                fasilitas: true,
                user: true,
              },
            },
          },
        },
        listing: {
          include: {
            imageSrc: true,
            fasilitas: true,
            user: true,
          },
        },
        notifi: true,
        banner: {
          orderBy: {
            createdAt: "asc",
          },
        },
        rating: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    return user;
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
  post: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().min(2).max(1000),
        guestCount: z.number().min(1).max(10, {
          message: "max 10 guest",
        }),
        price: z.number(),
        image: z.array(z.string()),
        fasilitas: z.array(z.string()),
        bed: z.number(),
        roomCount: z.number(),
        discount: z.number().min(0).max(100).optional(),
        imagePromosi: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const listings = await ctx.prisma.listing.create({
        data: {
          title: input.title,
          roomCount: input.roomCount,
          bed: input.bed,
          price: input.price,
          description: input.description,
          guestCount: input.guestCount,
          discount: input.discount,
          imagePromo: input.imagePromosi,
          imageSrc: {
            create: input.image.map((item: string) => ({ img: item })),
          },
          userId: input.userId,
          fasilitas: {
            create: input.fasilitas.map((item: string) => ({
              fasilitas: item,
            })),
          },
        },
      });
      return listings;
    }),
  getListings: publicProcedure.query(async ({ ctx }) => {
    const listings = await ctx.prisma.listing.findMany({
      include: {
        imageSrc: {
          orderBy: {
            createdAt: "desc",
          },
        },
        user: true,
        fasilitas: true,
        reservations: true,
      },
      orderBy: {
        price: "asc",
      },
    });
    const listing = listings.filter((item) => item.roomCount !== 0);
    return listing;
  }),
  createReservasi: protectedProcedure
    .input(
      z.object({
        totalPrice: z.number(),
        title: z.string(),
        rooms: z.number(),
        starDate: z.date(),
        endDate: z.date(),
        userId: z.string(),
        guestName: z.string().optional(),
        guestImage: z.string().optional(),
        guestEmail: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const listing = await ctx.prisma.listing.findUnique({
        where: {
          title: input.title,
        },
      });

      if (listing?.roomCount === 0) {
        throw new Error("room not available.");
      }

      const reservasi = await ctx.prisma.listing.update({
        where: {
          title: input.title,
        },
        data: {
          roomCount: {
            decrement: input.rooms,
          },
          reservations: {
            create: {
              totalPrice: input.totalPrice,
              rooms: input.rooms,
              startDate: input.starDate,
              endDate: input.endDate,
              userId: input.userId,
              guestName: input.guestName,
              guestEmail: input.guestEmail,
              guestImage: input.guestImage,
              status: "pending",
              title: input.title,
            },
          },
        },
      });
      return reservasi;
    }),
  deleteReservasi: publicProcedure
    .input(
      z.object({
        reservationsId: z.string(),
        listingId: z.string(),
        rooms: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletetReservasi = await ctx.prisma.reservation.deleteMany({
        where: {
          id: input.reservationsId,
          listingId: input.listingId,
        },
      });
      await ctx.prisma.listing.update({
        where: {
          id: input.listingId,
        },
        data: {
          roomCount: {
            increment: input.rooms,
          },
        },
      });
      return deletetReservasi;
    }),
  createPayment: publicProcedure
    .input(
      z.object({
        title: z.string(),
        images: z.array(z.string()),
        price: z.number(),
        userName: z.string(),
        userEmail: z.string(),
        rooms: z.number(),
        reservationsId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const successUrl = `http://localhost:3000/success`;
      const cancelUrl = `http://localhost:3000/payment`;
      const payment = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "idr",
              product_data: {
                name: input.title,
                images: input.images,
              },
              unit_amount: input.price * 100,
            },
            quantity: 1,
          },
        ],
        invoice_creation: {
          enabled: true,
          invoice_data: {
            description: `Invoice for ${input.title}`,
            metadata: {
              name: input.userName,
              email: input.userEmail,
              reservationsId: input.reservationsId,
            },
            custom_fields: [
              {
                name: "Purchase Order",
                value: "PO-XYZ",
              },
            ],
            rendering_options: {
              amount_tax_display: "include_inclusive_tax",
            },
            footer: "B2B Inc.",
          },
        },
        metadata: {
          name: input.userName,
          email: input.userEmail,
        },
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      return payment.url;
    }),
  getInvoice: publicProcedure
    .input(
      z.object({
        reservationsId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invoicesPromise = stripe.invoices.search({
        query: `total>999 AND metadata['email']:'${
          ctx.session?.user.email ?? ""
        }' AND metadata['reservationsId']:'${input.reservationsId ?? ""}'`,
      });

      await ctx.prisma.reservation.update({
        where: {
          id: input.reservationsId,
        },
        data: {
          status: "success",
          listing: {
            update: {
              user: {
                update: {
                  hasNotifi: true,
                  notifi: {
                    create: {
                      message: "Reservations success",
                      guestName: ctx.session?.user.name,
                      guestImage: ctx.session?.user.image,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const invoicesResult = await invoicesPromise;
      const customers = invoicesResult.data;
      const [custom] = customers.map((cus) => ({ ...cus }));

      return custom?.hosted_invoice_url;
      // return customers;
    }),
  getNotifications: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          email: input.id,
        },
        data: {
          hasNotifi: false,
        },
        include: {
          listing: {
            include: {
              imageSrc: true,
              fasilitas: true,
            },
          },
          reservations: true,
          notifi: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return user;
    }),
  deleteNotifications: publicProcedure
    .input(
      z.object({
        userid: z.string(),
        // id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const delet = await ctx.prisma.user.update({
        where: {
          id: input.userid,
        },
        data: {
          notifi: {
            deleteMany: {
              userId: input.userid,
            },
          },
        },
        include: {
          listing: {
            include: {
              imageSrc: true,
              fasilitas: true,
            },
          },
          reservations: true,
          notifi: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return delet;
    }),
  onlyInvoice: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const invoices = await stripe.invoices.search({
        query: `total>999 AND metadata['email']:'${
          ctx.session?.user.email ?? ""
        }' AND metadata['reservationsId']:'${input.id ?? ""}'`,
      });
      const customers = invoices.data;
      const [custom] = customers.map((cus) => ({ ...cus }));

      return custom?.hosted_invoice_url;
    }),
  createRating: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        userId: z.string(),
        message: z.string().min(2).max(1000),
        value: z.number().min(1).max(5),
        email: z.string(),
        listingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const rattings = await ctx.prisma.reservation.update({
        where: {
          id: input.id,
        },
        data: {
          status: "rattings",
          listing: {
            update: {
              user: {
                update: {
                  hasNotifi: true,
                  notifi: {
                    create: {
                      message: "Give rattings",
                      guestName: input.name,
                      guestImage: input.image,
                      reservationsId: input.id,
                      listingId: input.listingId,
                    },
                  },
                  rating: {
                    create: {
                      guestName: input.name,
                      guestImage: input.image,
                      guestEmail: input.email,
                      message: input.message,
                      value: input.value,
                      reservationId: input.id,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return rattings;
    }),
  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, image, email } = input;
      const dataToUpdate: any = {};

      if (image) {
        dataToUpdate.image = image;
      }

      if (name) {
        dataToUpdate.name = name;
      }

      if (email) {
        dataToUpdate.email = email;
      }
      const user = await ctx.prisma.user.update({
        where: {
          id,
        },
        data: dataToUpdate,
      });
      return user;
    }),
  updatePassword: publicProcedure
    .input(
      z.object({
        id: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const password = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          hashedPassword,
        },
      });
      return password;
    }),
  createUser: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(2, {
            message: "name must be at least 2 characters",
          })
          .max(50),
        userId: z.string().min(2).max(50),
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
      const register = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          guestId: input.userId,
        },
      });
      return register;
    }),
  createBanner: publicProcedure
    .input(
      z.object({
        image: z.string(),
        title: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const banner = await ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          banner: {
            create: {
              title: input.title,
              image: input.image,
            },
          },
        },
        include: {
          banner: true,
        },
      });
      return banner;
    }),
  deleteBanner: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const bannerdelet = await ctx.prisma.user.update({
        where: {
          email: ctx.session?.user.email ?? "",
        },
        data: {
          banner: {
            deleteMany: {
              id: input.id,
              userId: ctx.session?.user.email ?? "",
            },
          },
        },
        include: {
          banner: true,
        },
      });
      return bannerdelet;
    }),
  getRatings: publicProcedure.query(async ({ ctx }) => {
    const rattings = await ctx.prisma.rating.findMany({});
    return rattings;
  }),
  deleteRatting: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userid: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletRat = await ctx.prisma.rating.deleteMany({
        where: {
          id: input.id,
          userId: input.userid,
        },
      });
      return deletRat;
    }),
  getbanner: publicProcedure.query(async ({ ctx }) => {
    const banner = await ctx.prisma.banner.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    return banner;
  }),
});