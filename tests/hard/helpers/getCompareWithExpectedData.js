const path = require("path");
const getStream = require("get-stream");

const { run } = require("./run");

const getCompareWithExpectedData =
  (expectedData) =>
  async ({ imagePath, options, size, optionsSet }) => {
    const { stream } = await run(imagePath, options);

    const files = await getStream.array(stream);
    const filesByExtension = files.reduce(
      (result, file) => ({
        ...result,
        [path.extname(file.path)]: file,
      }),
      {}
    );

    const expectedDataByExtension =
      expectedData[imagePath].sizes[size][optionsSet];

    Object.entries(expectedDataByExtension).forEach(([extension, fixture]) => {
      const file = filesByExtension[`.${extension}`];

      expect(file).toBeDefined();
      expect(Buffer.compare(file.contents, fixture.buffer)).toBe(0);
    });

    if (+process.versions.node.slice(0, 2) < 16) {
      return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
    }
  };

module.exports = {
  getCompareWithExpectedData,
};
