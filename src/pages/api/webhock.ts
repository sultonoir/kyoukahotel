/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = req.body;
    // Proses data yang diterima sesuai kebutuhan Anda
    // Misalnya, mencetak data yang diterima
    console.log(data);
    // Tanggapan dapat dikirim kembali ke sumber permintaan jika diperlukan
    res.status(200).end("OK");
  } else {
    res.status(405).end();
  }
}
