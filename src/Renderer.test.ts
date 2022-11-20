import { Renderer } from "./Renderer";

it("renders metrics correctly", function () {
  // Arrange
  const spyLog = jest.fn();
  const renderer = new Renderer(spyLog);

  // Act
  renderer.render("0.0.0", 64, {
    countStarted: 56,
    countFinished: 420,
    avgCreatedStartedTime: 2750,
    avgStartedFinishedTime: 1000,
  } as any);

  // Assert
  expect(spyLog).toHaveBeenCalledWith(
    [
      "Overwhelm v0.0.0",
      "",
      "▣▣▣▣▣▣▣▣▣▣▣▣▣▣□□",
      "◩  Target    64",
      "□  Created   8",
      "▣  Started   56",
      "☑  Finished  420",
      "",
      "Created - Started:  2750 ms",
      "Started - Finished: 1000 ms",
    ].join("\n")
  );
});
