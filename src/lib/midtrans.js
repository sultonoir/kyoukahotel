/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const midtransClient = require("midtrans-client");

// Create Core API / Snap instance (both have shared `transactions` methods)
let apiClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-GFAOAg3sVfSaw_r0fiM-1H6e",
  clientKey: "SB-Mid-client-DrPF7VGszjSrpxJ-",
});

// @ts-ignore
apiClient.transaction.notification(notificationJson).then((statusResponse) => {
  let orderId = statusResponse.order_id;
  let transactionStatus = statusResponse.transaction_status;
  let fraudStatus = statusResponse.fraud_status;

  console.log(
    `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
  );

  // Sample transactionStatus handling logic

  if (transactionStatus == "capture") {
    // capture only applies to card transaction, which you need to check for the fraudStatus
    if (fraudStatus == "challenge") {
      // TODO set transaction status on your databaase to 'challenge'
    } else if (fraudStatus == "accept") {
      // TODO set transaction status on your databaase to 'success'
    }
  } else if (transactionStatus == "settlement") {
    // TODO set transaction status on your databaase to 'success'
  } else if (transactionStatus == "deny") {
    // TODO you can ignore 'deny', because most of the time it allows payment retries
    // and later can become success
  } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
    // TODO set transaction status on your databaase to 'failure'
  } else if (transactionStatus == "pending") {
    // TODO set transaction status on your databaase to 'pending' / waiting payment
  }
});
