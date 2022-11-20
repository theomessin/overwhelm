import { CallTracker } from "./CallTracker";

export namespace Scheduler {
  export type Ctx = {
    started: () => void;
    finished: () => void;
    stop: () => void;
  };
  export type Fn = (ctx: Ctx) => any;
}

export class Scheduler {
  private running = false;
  private calls: CallTracker;

  constructor(private readonly fn: Scheduler.Fn, ttl: number = Infinity) {
    this.calls = new CallTracker({ ttl });
  }

  async start(target: number) {
    if (this.running) {
      throw new Error("Scheduler is already running");
    }

    this.running = true;
    return new Promise<void>((resolve) => {
      this.calls.on("finished", () => {
        if (!this.running && !this.calls.hasRunning) resolve();
      });
      Array.from({ length: target }, () => {
        this.call();
      });
    });
  }

  stop() {
    this.running = false;
  }

  private async call() {
    const id = this.calls.create();
    const ctx: Scheduler.Ctx = {
      started: () => this.calls.started(id),
      finished: () => this.calls.finished(id),
      stop: () => this.stop(),
    };

    await this.fn(ctx);
    ctx.finished();
    if (this.running) this.call();
  }

  get metrics() {
    return this.calls.metrics;
  }
}
