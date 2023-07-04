import { api } from "@/utils/api";
import React from "react";

const index = () => {
  api.payment.subsUser.useSubscription(undefined, {
    onData(data) {
      console.log(data);
    },
  });
  const { mutate } = api.payment.testMutate.useMutation();
  return <button onClick={() => mutate()}>test</button>;
};

export default index;
