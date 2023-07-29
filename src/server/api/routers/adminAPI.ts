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
import bcrypt from "bcrypt";

export const adminApi = createTRPCRouter({
  getAdmin: publicProcedure.query(async ({ ctx }) => {
    try {
      const admin = await ctx.prisma.admin.findUnique({
        where: {
          email: ctx.session?.user.email as string,
        },
        include: {
          listing: {
            include: {
              imageSrc: true,
              fasilitas: true,
            },
          },
          banner: {
            orderBy: {
              createdAt: "asc",
            },
          },
          notifi: {
            orderBy: {
              createdAt: "asc",
            },
          },
          user: true,
          reservations: true,
        },
      });
      return admin;
    } catch (error) {}
  }),
  createAdmin: publicProcedure
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
      const existingUser = await ctx.prisma.admin.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new Error("E-mail has been used.");
      }
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const register = await ctx.prisma.admin.create({
        data: {
          name: input.name,
          email: input.email,
          hashedPassword,
        },
      });
      return register;
    }),
  createRooms: protectedProcedure
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
          adminId: input.userId,
          fasilitas: {
            create: input.fasilitas.map((item: string) => ({
              fasilitas: item,
            })),
          },
        },
      });
      return listings;
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
      const banner = await ctx.prisma.admin.update({
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
      try {
        const bannerdelet = await ctx.prisma.admin.update({
          where: {
            email: ctx.session?.user.email ?? "",
          },
          data: {
            banner: {
              deleteMany: {
                id: input.id,
              },
            },
          },
        });
        return bannerdelet;
      } catch (error) {
        throw new Error("error");
      }
    }),
  deleteNotifi: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const bannerdelet = await ctx.prisma.admin.update({
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
  getAllRooms: publicProcedure.query(async ({ ctx }) => {
    try {
      const rooms = await ctx.prisma.listing.findMany({
        include: {
          imageSrc: true,
          fasilitas: true,
        },
        orderBy: {
          price: "asc",
        },
      });
      return rooms;
    } catch (error) {
      throw new Error("No rooms dispalyed");
    }
  }),
  getNotifications: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const admin = await ctx.prisma.admin.update({
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
  updateAdmin: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        password: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password, image, id } = input;
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

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        dataToUpdate.hashedPassword = hashedPassword;
      }
      try {
        const UpadateAdmin = await ctx.prisma.admin.update({
          where: {
            id,
          },
          data: dataToUpdate,
        });
        return UpadateAdmin;
      } catch (error) {
        throw new Error("error Edited");
      }
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
      const listing = await ctx.prisma.listing.findUniqueOrThrow({
        where: {
          title: input.title,
        },
      });

      if (listing?.roomCount === 0) {
        throw new Error("room not available.");
      }

      const admin = await ctx.prisma.admin.findUnique({
        where: {
          email: ctx.session.user.email as string,
        },
      });

      await ctx.prisma.listing.update({
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
              adminId: admin?.id as string,
            },
          },
        },
      });
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
              order_id: input.guestEmail,
              gross_amount: input.totalPrice,
            },
            customer_details: {
              first_name: input.guestName,
              last_name: "",
              email: input.guestEmail,
              phone: "",
            },
            credit_card: { secure: true },
          }),
        }
      );
      const data = await response.json();
      return data.redirect_url;
    }),
});
