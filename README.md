### Usage

```js
const overwhelm = Overwhelm.fn(async (ctx) => {
  // Get ready to work.
  const browser = await pptr.connect({ browserWSEndpoint });
  ctx.started();

  // Do work.
  const page = await browser.newPage();
  await page.goto("https://google.com");
  await page.screenshot();

  // Clean up.
  ctx.finished();
  browser.disconnect();
});

process.on("SIGINT", () => {
  overwhelm.stop();
});

overwhelm.start(16);
```
