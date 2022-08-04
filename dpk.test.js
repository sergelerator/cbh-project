const { deterministicPartitionKey } = require("./dpk");

function repeat(fn, times = 16) {
  for (let i = 0; i < times; i++) {
    fn();
  }
}

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    repeat(() => {
      const trivialKey = deterministicPartitionKey();
      expect(trivialKey).toBe("0");
    });
  });

  it("Consistently returns the same partition key provided in the event object's partitionKey property", () => {
    const expectedKey = "custom-key";
    repeat(() => {
      const result = deterministicPartitionKey({ partitionKey: expectedKey });
      expect(result).toBe(expectedKey);
    });
  });

  it("Stringifies the event object's partitionKey property if not a string", () => {
    let partitionKey = 4;
    let expectedKey = "4";
    repeat(() => {
      const result = deterministicPartitionKey({ partitionKey });
      expect(result).toBe(expectedKey);
    }, 4);

    partitionKey = {};
    expectedKey = "{}";
    repeat(() => {
      const result = deterministicPartitionKey({ partitionKey });
      expect(result).toBe(expectedKey);
    }, 4);

    partitionKey = [];
    expectedKey = "[]";
    repeat(() => {
      const result = deterministicPartitionKey({ partitionKey });
      expect(result).toBe(expectedKey);
    }, 4);

    partitionKey = true;
    expectedKey = "true";
    repeat(() => {
      const result = deterministicPartitionKey({ partitionKey });
      expect(result).toBe(expectedKey);
    }, 4);
  });

  it("Consistently returns the same partition key when given the same object", () => {
    const event = { one: 1, two: "two", three: 3 };
    const expectedKey =
      "545524d2b9cf531f84118386ae7aa60f8819e61caf26c8cdda914e8da19b21c92fa3465159a697f07e1f30a33e2975e3b696873ab7b2b6eda79f63f42d52bd12";
    repeat(() => {
      const result = deterministicPartitionKey(event);
      expect(result).toBe(expectedKey);
    });
  });

  it("Consistently returns the same partition key when given an equivalent object (different object ID, same key/value pairs)", () => {
    const event = { one: 1, two: "two", three: 3 };
    const equivalentEvent = { one: 1, two: "two", three: 3 };
    const expectedKey =
      "545524d2b9cf531f84118386ae7aa60f8819e61caf26c8cdda914e8da19b21c92fa3465159a697f07e1f30a33e2975e3b696873ab7b2b6eda79f63f42d52bd12";
    repeat(() => {
      const result1 = deterministicPartitionKey(event);
      const result2 = deterministicPartitionKey(equivalentEvent);
      expect(result1).toBe(expectedKey);
      expect(result2).toBe(expectedKey);
    });
  });

  it("Treats all falsy values in event.partitionKey as if the partitionKey was not specified", () => {
    let expectedKey =
      "51a5f43b933ce152103a4789a17f1cf958e0b5e1c793082db6a6c74dd3f04c69ad8f558e28cf7c3eac61af4e484741f095129e815c4de4fdd30e3cd6c4e3c00f";
    repeat(() => {
      const result = deterministicPartitionKey({ partitionKey: false });
      expect(result).toBe(expectedKey);
    });

    expectedKey =
      "e65a0cb83a95cae7eb0642da576cac881e397c0405c63577c977068f7892f69f1c315baa294124da2a67e0c486d340f9d357377f894d0c0fd850484f8984f2e7";
    repeat(() => {
      const result = deterministicPartitionKey({ partitionKey: 0 });
      expect(result).toBe(expectedKey);
    });

    expectedKey =
      "58540d4d440df8c6c6da0d79cfce715bc92953c6cde8be9f749790004ef2d5a7322d0fd5170eac9a37d57ee0cc975cfca068a60b01622529d9e0fd657f71b8e2";
    repeat(() => {
      const result = deterministicPartitionKey({ partitionKey: null });
      expect(result).toBe(expectedKey);
    });
  });

  it("Discard values in event.partitionKey that exceed the max allowed partition key length", () => {
    const partitionKey = "1234".repeat(256);
    const expectedKey =
      "bfea7dc8209bc54f4c0c0c21b0a0e52aa3a307effc187718bc62676e8a17637301381ba154a3437500d938f6fa15cd4a9b8c80d889e4739808c656c2ec09e79d";
    repeat(() => {
      const result = deterministicPartitionKey({ partitionKey });
      expect(result).toBe(expectedKey);
    });
  });
});
