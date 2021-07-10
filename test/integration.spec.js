const fs = require("fs");
const path = require("path");
const Vinyl = require("vinyl");
const getStream = require("get-stream");

const gulpSquoosh = require("../index");

const FIXTURE_IMAGE_PATH = path.join(__dirname, "fixtures/fixture.jpg");
const FIXTURE_IMAGE_BUFFER = Buffer.from(fs.readFileSync(FIXTURE_IMAGE_PATH));
const FIXTURE_IMAGE_SIZE = FIXTURE_IMAGE_BUFFER.length;

const runGulpSquoosh = async (filePath, options) => {
  const stream = gulpSquoosh(options);

  stream.end(
    new Vinyl({
      path: filePath,
      contents: FIXTURE_IMAGE_BUFFER,
    })
  );

  return { files: await getStream.array(stream) };
};

jest.setTimeout(10000);

test("transforms image to specified codecs and changes file extension", async () => {
  const encodeOptions = { avif: true, jxl: true };
  const expectedExtensions = [".avif", ".jxl"];

  const { files } = await runGulpSquoosh(FIXTURE_IMAGE_PATH, {
    encodeOptions,
  });

  expect(files).toHaveLength(Object.values(encodeOptions).length);

  const extensions = files.map(({ path: filePath }) => path.extname(filePath));

  expect(expectedExtensions.every((ext) => extensions.includes(ext)));

  files.forEach((file) => {
    const fileSize = file.contents.length;

    expect(file).toBeDefined();
    expect(fileSize).toBeLessThan(FIXTURE_IMAGE_SIZE);
  });
});
