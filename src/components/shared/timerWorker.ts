/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// timerWorker.js
self.onmessage = function (e) {
  const timerDuration = e.data.timerDuration;

  setTimeout(() => {
    postMessage("Timer selesai!");
  }, timerDuration);
};
