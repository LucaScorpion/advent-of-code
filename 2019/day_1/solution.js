#!/usr/bin/env node

const readline = require('readline');

function getFuelReq(mass) {
    // Divide by 3, subtract 2, ensure it is never negative.
    return Math.max(Math.floor(mass / 3 - 2), 0);
}

function getAdditionalFuelReq(fuel) {
    let additional = getFuelReq(fuel);
    if (additional) {
        additional += getAdditionalFuelReq(additional);
    }
    return additional;
}

const moduleFuelRequirements = [];

const reader = readline.createInterface({ input: process.stdin });
reader.on('line', line => line && (moduleFuelRequirements.push(getFuelReq(parseInt(line, 10)))));
process.stdin.on('end', () => {
    // Calculate the fuel for just the modules.
    const moduleFuel = moduleFuelRequirements.reduce((acc, f) => acc + f, 0);
    console.log('Fuel required for modules:', moduleFuel);

    // Calculate the additional fuel for the fuel.
    const additionalFuel = moduleFuelRequirements.map(getAdditionalFuelReq).reduce((acc, f) => acc + f, 0);
    console.log('Additional fuel required for fuel:', additionalFuel);
    console.log('Total fuel required:', moduleFuel + additionalFuel);
});
