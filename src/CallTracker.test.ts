import { CallTracker } from "./CallTracker";

it("keeps track of time", function () {
  // Arrange
  let now = 0;
  const tracker = new CallTracker({ now: () => now });

  // Act
  const id = tracker.create();
  now += 250;
  tracker.started(id);
  now += 750;
  const call = tracker.finished(id);

  // Assert
  expect(call).toMatchObject({
    createdAt: 0,
    startedAt: 250,
    finishedAt: 1000,
  });
});

it("recycles finished call ids past ttl", function () {
  // Arrange
  let now = 0;
  const tracker = new CallTracker({ ttl: 1_000, now: () => now });

  // Act
  const id = tracker.create();
  now += 500;
  tracker.finished(id);
  const nextId = tracker.create();
  now += 2_000;
  tracker.finished(nextId);

  // Assert
  expect(id).not.toEqual(nextId);
  expect(tracker.create()).toEqual(id);
});

it("listens to events", function () {
  // Arrange
  const finished = jest.fn();
  const tracker = new CallTracker();
  tracker.on("finished", finished);

  // Act
  const id = tracker.create();
  tracker.finished(id);
  tracker.create();

  // Assert
  expect(finished).toHaveBeenCalledTimes(1);
  expect(finished).toHaveBeenCalledWith(id);
});

it("calculates metrics", function () {
  // Arrange
  let now = 0;
  const tracker = new CallTracker({ now: () => now });
  function makeCall(endAfter: number, startAfter: number = 0) {
    const id = tracker.create();
    now += startAfter;
    tracker.started(id);
    now += endAfter - startAfter;
    tracker.finished(id);
  }

  // Act
  makeCall(100, 50);
  makeCall(200, 100);
  makeCall(300, 50);
  makeCall(400, 100);

  // Assert
  expect(tracker.metrics).toMatchObject({
    countStarted: 0,
    countFinished: 4,
    avgCreatedStartedTime: 75,
    avgStartedFinishedTime: 175,
  });
});
