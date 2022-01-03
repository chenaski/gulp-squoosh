const path = require("path");
const log = require("fancy-log");
const picocolors = require("picocolors");
const { ImagePool } = require("@squoosh/lib");

const { processImage } = require("./processImage");

async function handleFiles(files, push, options) {
  const imagePool = new ImagePool();

  const errors = [];

  await Promise.all(
    files.map(async (file) => {
      try {
        const encodedImages = await processImage({
          imagePool,
          fileBuffer: file.contents,
          filePath: file.path,
          options,
        });

        for (const encodedImage of Object.values(encodedImages)) {
          const newFile = file.clone();
          const image = await encodedImage;

          newFile.path = transformPath(file.path, image.extension);
          newFile.contents = Buffer.from(image.binary);

          push(newFile);
        }
      } catch (error) {
        errors.push({
          filePath: file.path,
          message: error.message || error,
        });
      }
    })
  );

  errors.forEach((error) => {
    log(
      `${picocolors.blue("gulp-squoosh")}: ${
        error.message
      } ${picocolors.magenta(error.filePath)}`
    );
  });

  await imagePool.close();
}

function transformPath(pathForTransform, ext) {
  const { dir, name } = path.parse(pathForTransform);

  return path.format({
    dir,
    name,
    ext: `.${ext}`,
  });
}

module.exports = {
  handleFiles,
  transformPath,
};
