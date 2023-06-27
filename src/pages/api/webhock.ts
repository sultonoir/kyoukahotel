/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from "next";
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const midtransClient = require("midtrans-client");

const notificationHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === "POST") {
    try {
      const { notificationJson } = req.body;

      // Create Core API / Snap instance (both have shared `transactions` methods)
      const apiClient = new midtransClient.Snap({
        isProduction: false,
        serverKey: "SB-Mid-server-GFAOAg3sVfSaw_r0fiM-1H6e",
        clientKey: "SB-Mid-client-DrPF7VGszjSrpxJ-",
      });

      const statusResponse = await apiClient.transaction.notification(
        notificationJson
      );
      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      // Sample transactionStatus handling logic
      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO: set transaction status on your database to 'challenge'
        } else if (fraudStatus === "accept") {
          // TODO: set transaction status on your database to 'success'
        }
      } else if (transactionStatus === "settlement") {
        // TODO: set transaction status on your database to 'success'
      } else if (transactionStatus === "deny") {
        // TODO: you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        // TODO: set transaction status on your database to 'failure'
      } else if (transactionStatus === "pending") {
        // TODO: set transaction status on your database to 'pending' / waiting payment
      }

      res.status(200).end();
    } catch (error) {
      console.error(
        "Terjadi kesalahan saat memproses notifikasi transaksi:",
        error
      );
      res.status(500).json({
        message: "Terjadi kesalahan saat memproses notifikasi transaksi",
      });
    }
  } else {
    res.status(405).json({ message: "Metode yang diperbolehkan hanya POST" });
  }
};

export default notificationHandler;
