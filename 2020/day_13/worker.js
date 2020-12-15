const {parentPort, workerData} = require('worker_threads');

const {
    busIds,
    largestBusId,
    largestBusIdIndex
} = workerData;

function checkTimestamp(timestamp) {
    for (let i = 0; i < busIds.length; i++) {
        const id = busIds[i];
        if (id !== 'x' && (timestamp + i) % id !== 0) {
            return false;
        }
    }
    return true;
}

function handleMessage(msg) {
    const {searchFrom, searchTo} = msg;
    const nextDeparture = Math.ceil(searchFrom / largestBusId) * largestBusId;

    for (let timestamp = nextDeparture; timestamp < searchTo; timestamp += largestBusId) {
        const check = timestamp - largestBusIdIndex;
        if (checkTimestamp(timestamp - largestBusIdIndex)) {
            parentPort.postMessage({solution: check});
        }
    }

    parentPort.postMessage({done: true});
}

parentPort.on('message', handleMessage);
parentPort.postMessage({done: true});
