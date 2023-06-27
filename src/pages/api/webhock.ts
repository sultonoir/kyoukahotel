/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma } from "@/server/db";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === "POST") {
    try {
      const headers = {
        "X-Append-Notification": "https://kyoukahotel.vercel.app/api/webhock",
        "content-type": "application/json",
        authorization:
          "Basic U0ItTWlkLXNlcnZlci1HRkFPQWczc1ZmU2F3X3IwZmlNLTFINmU6SGFqaW1ldGUzNjU=",
      };
      const body = req.body;
      console.log("Webhook body:", body);
      if (body.transaction_status === "capture") {
        console.log(body.transaction_status);
      } else if (body.transaction_status === "accept") {
        await prisma.reservation.update({
          where: {
            id: body.order_id,
          },
          data: {
            status: body.transaction_status,
          },
        });
      }
      res.status(200).json({ message: "Webhook berhasil diterima" });
    } catch (error) {
      console.error("Terjadi kesalahan saat memproses webhook:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat memproses webhook" });
    }
  } else {
    res.status(405).json({ message: "Metode yang diperbolehkan hanya POST" });
  }
};

export default webhookHandler;
