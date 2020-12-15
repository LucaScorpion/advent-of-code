import fs from 'fs';
import { Worker } from 'worker_threads';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/);

// PART 1

const earliestTimestamp = parseInt(input[0], 10);
const busIdNumbers = input[1].split(',').filter(id => id !== 'x').map(id => parseInt(id, 10));

const nextDepartures = busIdNumbers.map(id => Math.ceil(earliestTimestamp / id) * id);
const soonestDeparture = Math.min(...nextDepartures);
const soonestId = busIdNumbers[nextDepartures.findIndex(dep => dep === soonestDeparture)];
const minutesWait = soonestDeparture - earliestTimestamp;

console.log(soonestId, ' * ', minutesWait, ' = ', soonestId * minutesWait);

// PART 2

const busIds = input[1].split(',').map((char) => {
  if (char === 'x') {
    return 'x';
  }
  return parseInt(char, 10);
});
const largestBusId = Math.max(...busIdNumbers);
const largestBusIdIndex = busIds.findIndex((id) => id === largestBusId);
const workerData = {
  busIds,
  largestBusId,
  largestBusIdIndex,
};

const workerPool: Worker[] = [];
let searchFrom = 0;
const searchSize = 100000000;

const startTime = Date.now();
const progressSize = 1000000000000;
const eFactor = progressSize.toString().length - 1;

let stopWorkers = false;
while (workerPool.length < 20) {
  const newWorker = new Worker(`${__dirname}/worker.js`, { workerData });
  workerPool.push(newWorker);

  newWorker.on('error', err => {
    console.log('WORKER ERROR\n', err);
  });
  newWorker.on('message', (msg) => {
    if (msg.done && !stopWorkers) {
      newWorker.postMessage({
        searchFrom,
        searchTo: searchFrom + searchSize,
      });
      searchFrom += searchSize;

      if (searchFrom % progressSize === 0) {
        console.log(searchFrom / progressSize, 'e', eFactor);
      }
    }
    if (msg.solution) {
      stopWorkers = true;
      console.log('Earliest timestamp:', msg.solution);
      const seconds = (Date.now() - startTime) / 1000;
      console.log('Took', seconds, 'seconds, or', seconds / 60, 'minutes');
    }
  });
}


