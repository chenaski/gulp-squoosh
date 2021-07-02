const through = require("through2");
const PluginError = require("plugin-error");
const path = require("path");

const { processImage } = require("./processImage");

const PLUGIN_NAME = "gulp-squoosh";

function gulpSquoosh(options) {
  return through.obj(getTransform(options));
}

const getTransform = (options) =>
  async function transform(file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isBuffer()) {
      await handleBuffer(file, this.push.bind(this), options);
      return callback();
    }

    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, "Streams not supported!"));
    }

    return callback(null, file);
  };

async function handleBuffer(file, push, options) {
  const encodedImages = await processImage(file.contents, options);

  for (const encodedImage of Object.values(encodedImages)) {
    const newFile = file.clone();
    const image = await encodedImage;

    newFile.path = transformPath(file.path, image.extension);
    newFile.contents = Buffer.from(image.binary);

    push(newFile);
  }
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
  gulpSquoosh,
  getTransform,
  handleBuffer,
  transformPath,
};
