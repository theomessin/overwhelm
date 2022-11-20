import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

export namespace CallTracker {
  export type ConstructorArgs = {
    ttl?: number;
    now?: typeof performance.now;
  };

  export type Id = number;

  export type Call = {
    id: Id;
    createdAt: number;
    startedAt?: number;
    finishedAt?: number;
  };

  export type Events = {
    finished: (id: Id) => void;
  };

  export type Metrics = {
    countStarted: number;
    countFinished: number;
    sumCreatedStartedTime: number;
    sumStartedFinishedTime: number;
    avgCreatedStartedTime: number;
    avgStartedFinishedTime: number;
  };
}

export class CallTracker {
  private readonly ttl = Infinity;
  private readonly now = performance.now;
  private calls: CallTracker.Call[] = [];
  private event = new EventEmitter() as TypedEmitter<CallTracker.Events>;

  constructor({ ttl, now }: CallTracker.ConstructorArgs = {}) {
    if (ttl) this.ttl = ttl;
    if (now) this.now = now;
  }

  on: typeof this.event.on = (...args) => {
    return this.event.on(...args);
  };

  create(): CallTracker.Id {
    const expired = this.calls.filter(({ finishedAt }) => {
      if (finishedAt === undefined) return false;
      return this.now() - finishedAt > this.ttl;
    });

    const id = expired.length > 0 ? expired[0].id : this.calls.length;
    const createdAt = this.now();
    this.calls[id] = { id, createdAt };
    return id;
  }

  started(id: CallTracker.Id): CallTracker.Call {
    // TODO: handle invalid id being passed.
    const call = this.calls[id]!;
    const startedAt = this.now();
    this.calls[id] = { startedAt, ...call };
    return this.calls[id]!;
  }

  finished(id: CallTracker.Id): CallTracker.Call {
    // TODO: handle invalid id being passed.
    const call = this.calls[id]!;
    const finishedAt = this.now();
    this.calls[id] = { finishedAt, ...call };
    this.event.emit("finished", id);
    return this.calls[id]!;
  }

  get hasRunning() {
    return (
      this.calls.filter((call) => call.finishedAt === undefined).length > 0
    );
  }

  get metrics(): CallTracker.Metrics {
    const emptyMetrics = {
      countStarted: 0,
      countFinished: 0,
      sumCreatedStartedTime: 0,
      sumStartedFinishedTime: 0,
    };

    const partialMetrics = this.calls.reduce((acc, call) => {
      const isStarted = call.startedAt !== undefined;
      const countStarted = acc.countStarted + Number(isStarted);
      const isFinished = call.finishedAt !== undefined;
      if (isFinished === false) return { ...acc, countStarted };

      const startedAt = call.startedAt ?? call.createdAt;
      const createdStartedTime = startedAt - call.createdAt;
      const startedFinishedTime = call.finishedAt! - startedAt;

      return {
        countStarted: acc.countStarted,
        countFinished: acc.countFinished + 1,
        sumCreatedStartedTime: acc.sumCreatedStartedTime + createdStartedTime,
        sumStartedFinishedTime:
          acc.sumStartedFinishedTime + startedFinishedTime,
      };
    }, emptyMetrics);

    return {
      ...partialMetrics,
      avgCreatedStartedTime:
        partialMetrics.sumCreatedStartedTime / partialMetrics.countFinished,
      avgStartedFinishedTime:
        partialMetrics.sumStartedFinishedTime / partialMetrics.countFinished,
    };
  }
}
