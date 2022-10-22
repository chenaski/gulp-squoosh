import path from "path";
import gulp from "gulp";
import gulpSquoosh from "gulp-squoosh";
import gulpCache from "gulp-cache";
import { deleteSync as del } from "del";

const SOURCE = "src/images/**";
const DESTINATION = "build/images";

async function clear() {
  return del(["build"], { force: true });
}

async function processImages() {
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

export const clearCache = () => gulpCache.clearAll();
export default gulp.series(clear, processImages);
