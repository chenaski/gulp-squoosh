const gulp = require("gulp");
const gulpSquoosh = require("gulp-squoosh");
const gulpCache = require("gulp-cache");
const del = require("del");

const SOURCE = "src/images/**";
const DESTINATION = "build/images";

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
