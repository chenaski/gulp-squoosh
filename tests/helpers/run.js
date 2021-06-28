const fs = require("fs");
const Vinyl = require("vinyl");

const gulpSquoosh = require("../../index");

const run = async (filePath, options) => {
  const buffer = await fs.promises.readFile(filePath);
  const stream = gulpSquoosh(options);

  stream.end(
    new Vinyl({
      path: filePath,
      contents: buffer,
    })
  );

  return { buffer, stream };
};

module.exports = {
  run,
};
