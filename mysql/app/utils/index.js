/**
 * Hangs for a while.
 *
 * @param {int} ms Time in milliseconds
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convenience function to create index of multiple fields
 * @param {Array.<string>} fields Like ["userId", "lastUpdated"]
 * @returns Object
 */
export function index(fields) {
  return {
    indexes: fields.map((field) => ({
      unique: false,
      fields: [field],
    })),
  };
}

export default {
  sleep,
  index,
};
