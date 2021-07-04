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

[Full Example](exmaples/gulpfile.js)

```js
const gulp = require("gulp");
const gulpSquoosh = require("gulp-squoosh");
const gulpCache = require("gulp-cache");

const SOURCE = "src/images/**";
const DESTINATION = "build/images";

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

## TODO

### Before 1.0.0 release:

- [ ] `@squoosh/lib` to `peerDependencies`
- [ ] `README.md`
  - [ ] Example of using the resulting images in HTML
  - [ ] Possible build option without `.png` and `.jpg`
  - [ ] Section with useful links
  - [ ] Store the original resource for screens with maximum DPR, then resize for all supported screen sizes
- [ ] Find out what the `preprocessOptions.resize.enabled` affects
- [ ] `CHANGELOG.md`
- [x] Git workflow for tests
- [ ] [dependabot](https://github.com/dependabot)
- [ ] JSDoc or d.ts
- [ ] [yaspeller](https://github.com/hcodes/yaspeller)
- [ ] Rewrite `.gitignore`

### Someday:

- [ ] Logging (compression %, before kB, after kB)
- [ ] Support for `presets` to create multiple images of different sizes \
       `[ { resize: { width: width * 0.5 } }, { postfix: "@2x" } ]`
