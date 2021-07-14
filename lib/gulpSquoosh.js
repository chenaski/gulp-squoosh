const through = require("through2");
const PluginError = require("plugin-error");

const { handleFiles } = require("./handleFiles");

function gulpSquoosh(options) {
  const files = [];
  return through.obj(getTransform(files), getFlush(files, options));
}

const getTransform = (files) =>
  async function transform(file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isBuffer()) {
      files.push(file);
      return callback();
    }

    if (file.isStream()) {
      return callback(
        new PluginError("gulp-squoosh", "Streams not supported!")
      );
    }

    return callback(null, file);
  };

const getFlush = (files, options) =>
  async function flush(callback) {
    await handleFiles(files, this.push.bind(this), options);
    callback();
  };

module.exports = {
  gulpSquoosh,
  getTransform,
  getFlush,
};
