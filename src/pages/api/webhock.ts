/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type NextApiRequest, type NextApiResponse } from "next";
// import { buffer } from "micro";
// import type Stripe from "stripe";
// import { stripe } from "@/lib/stripe";

// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

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
    // const buf = await buffer(req);
    // const sig = req.headers["stripe-signature"];

    // let event: Stripe.Event;

    // try {
    //   event = stripe.webhooks.constructEvent(buf, sig!, endpointSecret!);
    // } catch (err: unknown) {
    //   res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    //   return;
    // }

    // // Handle the event
    // console.log(`Unhandled event type ${event.type}`);

    // // Return a 200 response to acknowledge receipt of the event
    // res.send("Received");
    const data = await req.body;
    // Proses data yang diterima sesuai kebutuhan Anda
    // Misalnya, mencetak data yang diterima
    console.log(data);
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhookHandler;
