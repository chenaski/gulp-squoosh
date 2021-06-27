# gulp-squoosh

Gulp plugin to compress images using [Squoosh](https://github.com/GoogleChromeLabs/squoosh)

## Installation

```
npm i -D gulp-squoosh
```

## Usage

```js
const gulp = require("gulp");
const gulpSquoosh = require("gulp-squoosh");

function processImages() {
  return gulp
    .src("src/images/**")
    .pipe(gulpSquoosh())
    .pipe(gulp.dest("dist/images"));
}
```

## Configuration

For available options, see [libSqooush](https://github.com/GoogleChromeLabs/squoosh/blob/dev/libsquoosh/README.md)

```js
gulpSquoosh({
  preprocessOptions: {...},
  encodeOptions: {...},
});

gulpSquoosh(({ width, height, size }) => ({
  preprocessOptions: {...},
  encodeOptions: {...},
}));
```

```js
const DEFAULT_ENCODE_OPTIONS = {
  mozjpeg: {},
  webp: {},
  avif: {},
  jxl: {},
  oxipng: {},
};
```

## Example

```js
const gulp = require("gulp");
const gulpSquoosh = require("gulp-squoosh");
const gulpCache = require("gulp-cache");

const SOURCE = "src/images/**";
const DESTINATION = "dist/images";

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
            // wp2: {}
          },
        }))
      )
    )
    .pipe(gulp.dest(DESTINATION));
}
```
