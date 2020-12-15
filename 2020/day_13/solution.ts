import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/);
const earliestTimestamp = parseInt(input[0], 10);
const busIds = input[1].split(',').filter(id => id !== 'x').map(id => parseInt(id, 10));

const nextDepartures = busIds.map(id => Math.ceil(earliestTimestamp / id) * id);
const soonestDeparture = Math.min(...nextDepartures);
const soonestId = busIds[nextDepartures.findIndex(dep => dep === soonestDeparture)];
const minutesWait = soonestDeparture - earliestTimestamp;

console.log(soonestId, ' * ', minutesWait, ' = ', soonestId * minutesWait);
