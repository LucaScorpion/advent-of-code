import fs from 'fs';

const input = fs.readFileSync(0).toString().trim();
const binaryInput = input.split('').map((c) => {
  const part = parseInt(c, 16).toString(2);
  const padAmount = 4 - part.length;
  return `${'0'.repeat(padAmount)}${part}`;
}).join('');

interface Packet {
  version: number;
  typeId: number;
}

interface PacketLiteral extends Packet {
  typeId: 4;
  value: number;
}

interface PacketOperator extends Packet {
  lengthTypeId: number;
  length: number;
  subPackets: Packet[];
}

interface ParseResult<T extends Packet> {
  packet: T;
  length: number;
}

function binToDec(bin: string): number {
  return parseInt(bin, 2);
}

function parsePacket(bin: string): ParseResult<Packet> {
  let packet: Packet = {
    version: binToDec(bin.substring(0, 3)),
    typeId: binToDec(bin.substring(3, 6)),
  };

  const restBin = bin.substring(6);
  let parsed: ParseResult<Packet>;

  if (packet.typeId === 4) {
    parsed = parsePacketLiteral(restBin, packet);
  } else {
    parsed = parsePacketOperator(restBin, packet);
  }

  parsed.length += 6;
  return parsed;
}

function parsePacketLiteral(bin: string, packet: Packet): ParseResult<PacketLiteral> {
  let valueString = '';

  let i = 0;
  for (; i < bin.length - 5; i += 5) {
    let group = bin.substring(i, i + 5);
    valueString = `${valueString}${group.substring(1)}`;

    if (group[0] === '0') {
      break;
    }
  }

  return {
    packet: {
      ...packet,
      typeId: 4,
      value: binToDec(valueString),
    },
    length: i + 5,
  };
}

function parsePacketOperator(bin: string, packet: Packet): ParseResult<PacketOperator> {
  const operator: PacketOperator = {
    ...packet,
    lengthTypeId: Number(bin[0]),
    length: 0,
    subPackets: [],
  };

  let parsedSubPackets: ParseResult<Packet>[] = [];
  let baseLength = 0;

  switch (operator.lengthTypeId) {
    case 0:
      operator.length = binToDec(bin.substring(1, 16));
      parsedSubPackets = parseSubPacketsByLength(bin.substring(16), operator.length);
      baseLength = 16;
      break;
    case 1:
      operator.length = binToDec(bin.substring(1, 12));
      parsedSubPackets = parseSubPacketsByAmount(bin.substring(12), operator.length);
      baseLength = 12;
      break;
    default:
      throw new Error(`Invalid length type id: ${operator.lengthTypeId}`);
  }

  return {
    packet: {
      ...operator,
      subPackets: parsedSubPackets.map((p) => p.packet),
    },
    length: baseLength + parsedSubPackets.reduce((acc, cur) => acc + cur.length, 0),
  };
}

function parseSubPacketsByLength(bin: string, length: number): ParseResult<Packet>[] {
  const packets: ParseResult<Packet>[] = [];
  let restBin = bin;
  let parsedLength = 0;

  while (parsedLength < length) {
    const parsed = parsePacket(restBin);
    packets.push(parsed);
    restBin = restBin.substring(parsed.length);
    parsedLength += parsed.length;
  }

  return packets;
}

function parseSubPacketsByAmount(bin: string, amount: number): ParseResult<Packet>[] {
  const packets: ParseResult<Packet>[] = [];
  let restBin = bin;

  for (let i = 0; i < amount; i++) {
    const parsed = parsePacket(restBin);
    packets.push(parsed);
    restBin = restBin.substring(parsed.length);
  }

  return packets;
}

function isPacketOperator(packet: Packet): packet is PacketOperator {
  return 'subPackets' in packet;
}

function forEachPacket(packet: Packet, fn: (p: Packet) => void): void {
  fn(packet);
  if (isPacketOperator(packet)) {
    packet.subPackets.forEach((sub) => forEachPacket(sub, fn));
  }
}

const outerPacket = parsePacket(binaryInput).packet;

let totalVersions = 0;
forEachPacket(outerPacket, (p) => totalVersions += p.version);
console.log(`Total versions: ${totalVersions}`);
