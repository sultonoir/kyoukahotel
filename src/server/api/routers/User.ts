/* eslint-disable @typescript-eslint/no-unsafe-return */
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
  getUser: protectedProcedure.query(async ({ ctx }) => {
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
              },
            },
          },
        },
        notifi: {
          orderBy: {
            createdAt: "desc",
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
  getNotifications: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const admin = await ctx.prisma.user.update({
        where: {
          email: input.id,
        },
        data: {
          hasNotifi: false,
        },
        include: {
          notifi: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return admin;
    }),
  deleteNotifi: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const bannerdelet = await ctx.prisma.user.update({
          where: {
            email: ctx.session?.user.email ?? "",
          },
          data: {
            notifi: {
              deleteMany: {
                adminId: input.id,
              },
            },
          },
        });
        return bannerdelet;
      } catch (error) {
        throw new Error("error");
      }
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
      const [admin] = await ctx.prisma.admin.findMany({
        where: {
          role: "Admin",
        },
      });
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
          adminId: admin?.id as string,
        },
      });
      return register;
    }),
  post: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().min(2).max(2000),
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
        adminId: z.string(),
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
          fasilitas: {
            create: input.fasilitas.map((item: string) => ({
              fasilitas: item,
            })),
          },
          adminId: input.adminId,
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
        adminId: z.string(),
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
              adminId: input.adminId,
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
        include: {
          reservations: {
            include: {
              listing: {
                include: {
                  imageSrc: true,
                  fasilitas: true,
                },
              },
            },
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
        status: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.prisma.reservation.update({
        where: {
          id: input.reservationsId,
        },
        data: {
          status: input.status,
        },
      });

      return res;
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
          // listing: {
          //   update: {
          //     user: {
          //       update: {
          //         hasNotifi: true,
          //         notifi: {
          //           create: {
          //             message: "Give rattings",
          //             guestName: input.name,
          //             guestImage: input.image,
          //             reservationsId: input.id,
          //             listingId: input.listingId,
          //           },
          //         },
          //         rating: {
          //           create: {
          //             guestName: input.name,
          //             guestImage: input.image,
          //             guestEmail: input.email,
          //             message: input.message,
          //             value: input.value,
          //             reservationId: input.id,
          //           },
          //         },
          //       },
          //     },
          //   },
          // },
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
  createMidtrans: publicProcedure
    .input(
      z.object({
        totalPrice: z.number(),
        id: z.string(),
        name: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await fetch(
        "https://app.sandbox.midtrans.com/snap/v1/transactions",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization:
              "Basic U0ItTWlkLXNlcnZlci1HRkFPQWczc1ZmU2F3X3IwZmlNLTFINmU6",
          },
          body: JSON.stringify({
            transaction_details: {
              order_id: input.id,
              gross_amount: input.totalPrice,
            },
            customer_details: {
              first_name: input.name,
              last_name: "",
              email: input.email,
              phone: "081223323423",
            },
            credit_card: { secure: true },
          }),
        }
      );
      const data = await response.json();
      return data.redirect_url;
    }),
  getUserNotifi: publicProcedure.query(async ({ ctx }) => {
    const userNotifi = await ctx.prisma.user.findUnique({
      where: {
        email: ctx.session?.user.email as string,
      },
      include: {
        notifi: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    return userNotifi;
  }),
  getAllListings: publicProcedure.query(async ({ ctx }) => {
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
});
