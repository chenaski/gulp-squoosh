const gulp = require("gulp");

const gulpSquoosh = require("../index");

const SOURCE = "fixtures/*";
const DESTINATION = "build";

function processImages() {
  return gulp
    .src(SOURCE)
    .pipe(
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
        },
      }))
    )
    .pipe(gulp.dest(DESTINATION));
}

exports.default = processImages;
