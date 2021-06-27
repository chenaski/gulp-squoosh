const gulp = require("gulp");
const gulpCache = require("gulp-cache");
const del = require("del");

const gulpSquoosh = require("../index");

const SOURCE = "fixtures/*";
const DESTINATION = "build";

function clear() {
  return del(["build"], { force: true });
}

function processImages() {
  return gulp
    .src(SOURCE)
    .pipe(
      gulpCache(
        gulpSquoosh(({ width, height, size }) => ({
          preprocessOptions: {
            resize: {
              enabled: true,
              width: width * 0.5,
              height: height * 0.5,
            },
          },
          encodeOptions: {
            webp: {},
            avif: {},
            // mozjpeg: {},
            // jxl: {},
            // oxipng: {},
            // wp2: {},
          },
        }))
      )
    )
    .pipe(gulp.dest(DESTINATION));
}

module.exports.clearCache = () => gulpCache.clearAll();
module.exports.default = gulp.series(clear, processImages);
