export default {
  preset: "ts-jest/presets/default",
  setupFilesAfterEnv: ["./test/Setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/lib/"],
};
