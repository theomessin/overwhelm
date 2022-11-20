import { toRoughlyEqual } from "./toRoughlyEqual";

type GetMatcherArgs<
  T extends (
    this: jest.MatcherContext,
    actual: any,
    ...args: any
  ) => jest.CustomMatcherResult | Promise<jest.CustomMatcherResult>
> = T extends (this: any, actual: any, ...args: infer U) => any ? U : never;

declare global {
  namespace jest {
    interface Matchers<R> {
      toRoughlyEqual(...args: GetMatcherArgs<typeof toRoughlyEqual>): R;
    }
  }
}

expect.extend({ toRoughlyEqual });
