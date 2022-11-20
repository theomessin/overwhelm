import { CallTracker } from "./CallTracker";

export class Renderer {
  constructor(private readonly log = console.log) {}

  render(version: string, target: number, metrics: CallTracker.Metrics) {
    const startedBoxCount = Math.round((metrics.countStarted / target) * 16);
    const createdBoxCount = 16 - startedBoxCount;
    const startedBoxes = Array.from({ length: startedBoxCount }, () => "▣");
    const createdBoxes = Array.from({ length: createdBoxCount }, () => "□");
    const boxes = startedBoxes.join("") + createdBoxes.join("");

    this.log(
      [
        `Overwhelm v${version}`,
        "",
        boxes,
        `◩  Target    ${target}`,
        `□  Created   ${target - metrics.countStarted}`,
        `▣  Started   ${metrics.countStarted}`,
        `☑  Finished  ${metrics.countFinished}`,
        "",
        `Created - Started:  ${metrics.avgCreatedStartedTime.toFixed(0)} ms`,
        `Started - Finished: ${metrics.avgStartedFinishedTime.toFixed(0)} ms`,
      ].join("\n")
    );
  }
}
