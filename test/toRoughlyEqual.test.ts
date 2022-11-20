import { toRoughlyEqual } from "./toRoughlyEqual";

it("passes if actual is within expected tolerance", function () {
  const tolerance = 2;
  const expected = 100;
  const withinTolerance = [98, 99, 100, 101, 102];
  const fn = toRoughlyEqual.bind({ isNot: false } as any);
  withinTolerance.forEach((actual) => {
    const { pass } = fn(actual, expected, tolerance);
    expect(pass).toBeTruthy();
  });
});

it("fails if actual is outside expected tolerance", function () {
  const { pass } = toRoughlyEqual.bind({} as any)(97, 100, 2);
  expect(pass).toBeFalsy();
});
