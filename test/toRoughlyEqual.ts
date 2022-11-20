export function toRoughlyEqual(
  this: jest.MatcherContext,
  actual: number,
  expected: number,
  percentage: number
): jest.CustomMatcherResult {
  const tolerance = (expected * percentage) / 100;
  const lower = expected - tolerance;
  const upper = expected + tolerance;
  return {
    pass: lower <= actual && actual <= upper,
    message: () =>
      `Received number ${actual} is ${
        this.isNot ? "" : "not"
      } between ${lower} and ${upper}.`,
  };
}
