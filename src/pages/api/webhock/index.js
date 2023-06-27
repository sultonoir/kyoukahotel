/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { Snap } from "midtrans-client";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false,
  },
};

// @ts-ignore
export default async function handler(req, res) {
  // @ts-ignore
  const apiClient = new Snap({
    isProduction: false,
    serverKey: "SB-Mid-server-GFAOAg3sVfSaw_r0fiM-1H6e",
    clientKey: "SB-Mid-client-DrPF7VGszjSrpxJ-",
  });

  try {
    const rawBody = await buffer(req);
    const statusResponse = await apiClient.transaction.notification(rawBody);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(
      `Pemberitahuan transaksi diterima. ID Pesanan: ${orderId}. Status transaksi: ${transactionStatus}. Status penipuan: ${fraudStatus}`
    );

    // Logika penanganan status transaksi

    if (transactionStatus === "capture") {
      // capture hanya berlaku untuk transaksi dengan kartu, yang perlu Anda periksa untuk status penipuan
      if (fraudStatus === "challenge") {
        // TODO: atur status transaksi di database Anda menjadi 'challenge'
      } else if (fraudStatus === "accept") {
        // TODO: atur status transaksi di database Anda menjadi 'success'
      }
    } else if (transactionStatus === "settlement") {
      // TODO: atur status transaksi di database Anda menjadi 'success'
    } else if (transactionStatus === "deny") {
      // TODO: Anda dapat mengabaikan 'deny', karena sebagian besar waktu itu memungkinkan percobaan pembayaran ulang
      // dan kemudian dapat menjadi 'success'
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "expire"
    ) {
      // TODO: atur status transaksi di database Anda menjadi 'failure'
    } else if (transactionStatus === "pending") {
      // TODO: atur status transaksi di database Anda menjadi 'pending' / menunggu pembayaran
    }
    res.json({ received: true });
  } catch (error) {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
