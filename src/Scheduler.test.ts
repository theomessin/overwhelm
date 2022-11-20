import { Scheduler } from "./Scheduler";

function sleep(delayMs: number) {
  return new Promise<void>((r) => setTimeout(() => r(), delayMs));
}

it("runs function target times in parallel until stopped", async function () {
  // Two functions calls will start at the same time.
  // First one will take 25 ms, second one will take 50 ms.
  // After the first call finishes (t = 25 ms), the third call starts.
  // Third call will invoke Ctx.stop, so no new calls will be scheduled.
  // scheduler.start resolves when stop is called AND all calls finish.
  // Since the second call needs 50 ms, this happens at t = 50 ms.

  // Arrange
  const delays = [25, 50, 10];
  const fn = jest.fn(async (ctx: Scheduler.Ctx) => {
    const delay = delays.shift();
    if (delays.length === 0) ctx.stop();
    if (delay) await sleep(delay);
  });

  // Act
  const scheduler = new Scheduler(fn);
  const startTime = performance.now();
  await scheduler.start(2);
  const elapsedTime = performance.now() - startTime;

  // Assert
  expect(fn).toHaveBeenCalledTimes(3);
  expect(elapsedTime).toRoughlyEqual(50, 10);
});
