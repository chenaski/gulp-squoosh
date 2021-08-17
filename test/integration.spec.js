const fs = require("fs");
const path = require("path");
const Vinyl = require("vinyl");
const getStream = require("get-stream");

const gulpSquoosh = require("../index");

const FIXTURES_DIR = path.join(__dirname, "fixtures");
const FIXTURE_IMAGES_PATHS = [
  path.join(FIXTURES_DIR, "100x56.jpg"),
  path.join(FIXTURES_DIR, "100x56.png"),
];
const EXT_BY_ENCODERS = {
  oxipng: ".png",
  mozjpeg: ".jpg",
  webp: ".webp",
  avif: ".avif",
  jxl: ".jxl",
  wp2: ".wp2",
};

const runGulpSquooshSingle = async (filePath, options) => {
  const stream = gulpSquoosh(options);
  const buffer = await fs.promises.readFile(filePath);

  stream.end(
    new Vinyl({
      path: filePath,
      contents: buffer,
    })
  );

  return { files: await getStream.array(stream), buffer };
};

const runGulpSquoosh = async (filePaths, options) => {
  const stream = gulpSquoosh(options);

  await Promise.all(
    filePaths.map(async (filePath) => {
      const buffer = await fs.promises.readFile(filePath);

      stream.write(
        new Vinyl({
          path: filePath,
          contents: buffer,
        })
      );
    })
  );

  stream.end();

  return await getStream.array(stream);
};

jest.setTimeout(10000);

test.each(FIXTURE_IMAGES_PATHS)(
  "transforms image to specified codecs and changes file extension",
  async (filePath) => {
    const encodeOptions = Object.keys(EXT_BY_ENCODERS).reduce(
      (options, encoder) => ({
        ...options,
        [encoder]: {},
      }),
      {}
    );
    const expectedExtensions = Object.values(EXT_BY_ENCODERS);

    const { files, buffer } = await runGulpSquooshSingle(filePath, {
      encodeOptions,
    });

    expect(files).toHaveLength(Object.values(encodeOptions).length);

    const extensions = files.map(({ path: filePath }) =>
      path.extname(filePath)
    );

    expect(expectedExtensions.every((ext) => extensions.includes(ext))).toBe(
      true
    );

    files.forEach((file) => {
      const fileSize = file.contents.length;

      expect(file).toBeDefined();

      // oxipng for .jpg images upsize
      if (
        path.extname(filePath) === ".jpg" &&
        path.extname(file.path) === ".png"
      ) {
        expect(fileSize).not.toBe(buffer.length);
      } else {
        expect(fileSize).toBeLessThan(buffer.length);
      }
    });
  }
);

// to avoid https://github.com/GoogleChromeLabs/squoosh/issues/1111
// missed due to unexpected errors
test.skip("processes a large number of images (all codecs)", async () => {
  const encodeOptions = Object.keys(EXT_BY_ENCODERS).reduce(
    (options, encoder) => ({
      ...options,
      [encoder]: {},
    }),
    {}
  );
  const imagesCount = 50;
  const expectedCount = Object.keys(EXT_BY_ENCODERS).length * imagesCount;
  const expectedExtensions = Object.values(EXT_BY_ENCODERS);

  const files = await runGulpSquoosh(
    Array(imagesCount).fill(path.join(FIXTURES_DIR, "1x1.png")),
    {
      encodeOptions,
    }
  );

  const countByExt = files.reduce((result, file) => {
    const ext = path.extname(file.path);

    return {
      ...result,
      [ext]: (result[ext] || 0) + 1,
    };
  }, {});
  const extensions = Object.keys(countByExt);

  expect(files).toHaveLength(expectedCount);
  expect(expectedExtensions.every((ext) => extensions.includes(ext))).toBe(
    true
  );
  expect(
    Object.values(countByExt).every((count) => {
      return count === expectedCount / expectedExtensions.length;
    })
  ).toBe(true);
});
