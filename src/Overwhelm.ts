// @ts-ignore
import { version } from "../package.json";
import { Renderer } from "./Renderer";
import { Scheduler } from "./Scheduler";

export class Overwhelm {
  constructor(
    private readonly scheduler: Scheduler,
    private readonly renderer: Renderer
  ) {
    //
  }

  static fn(func: Scheduler.Fn) {
    const scheduler = new Scheduler(func, 60 * 1_000);
    const renderer = new Renderer();
    return new Overwhelm(scheduler, renderer);
  }

  async start(target: number) {
    const render = () => {
      console.clear();
      this.renderer.render(version, target, this.scheduler.metrics);
    };

    const interval = setInterval(render, 100);
    await this.scheduler.start(target);
    clearInterval(interval);
    render();
  }

  stop() {
    return this.scheduler.stop();
  }
}
