const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

function hash(input) {
  return crypto.createHash("sha3-512").update(input).digest("hex");
}

function toString(input) {
  return typeof input === "string" ? input : JSON.stringify(input);
}

exports.deterministicPartitionKey = (event) => {
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  const candidate = event.partitionKey
    ? toString(event.partitionKey)
    : hash(JSON.stringify(event));
  return candidate.length > MAX_PARTITION_KEY_LENGTH
    ? hash(candidate)
    : candidate;
};
