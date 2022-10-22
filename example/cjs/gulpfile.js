const path = require("path");
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
        gulpSquoosh(({ width, filePath }) => ({
          preprocessOptions: {
            resize: {
              width: width * 0.5,
            },
          },
          encodeOptions: {
            jxl: {},
            avif: {},
            webp: {},
            // wp2: {}
            ...(path.extname(filePath) === ".png" ? { oxipng: {} } : { mozjpeg: {} }),
          },
        }))
      )
    )
    .pipe(gulp.dest(DESTINATION));
}

module.exports.clearCache = () => gulpCache.clearAll();
module.exports.default = gulp.series(clear, processImages);
