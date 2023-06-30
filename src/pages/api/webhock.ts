/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { prisma } from "@/server/db";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = await req.body;
    // Proses data yang diterima sesuai kebutuhan Anda
    // Misalnya, mencetak data yang diterima
    await prisma.reservation.update({
      where: {
        id: data.transaction_id,
      },
      data: {
        status: data.transaction_status,
      },
    });

    res.status(200).end("OK");
  } else {
    res.status(405).end();
  }
}
