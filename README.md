# gulp-squoosh

Gulp plugin to compress images using [Squoosh](https://github.com/GoogleChromeLabs/squoosh).

![github `test` workflow status](https://github.com/chenaski/gulp-squoosh/actions/workflows/test.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/gulp-squoosh)
![license](https://img.shields.io/npm/l/gulp-squoosh)
![npm downloads](https://img.shields.io/npm/dm/gulp-squoosh)
![nodejs support](https://img.shields.io/node/v/gulp-squoosh)

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

For available options, see [libSqooush](https://github.com/GoogleChromeLabs/squoosh/blob/dev/libsquoosh/README.md).

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

[Full Example](example/gulpfile.js)

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
              width: width * 0.5,
              height: height * 0.5,
            },
          },
          encodeOptions: {
            jxl: {},
            avif: {},
            webp: {},
            // mozjpeg: {},
            // oxipng: {},
            // wp2: {}
          },
        }))
      )
    )
    .pipe(gulp.dest(DESTINATION));
}
```

```html
<picture>
  <source srcset="image.jxl" type="image/jxl" />
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.webp" alt="fill out me" />
</picture>
```

## Troubleshooting

### WASM memory error

You cannot run multiple `gulp-squoosh` tasks in parallel (via `gulp.parallel`) because you will get a `wasm memory error`.
You can just replace it with `gulp.serial`, it will not affect the speed:

```js
gulp.parallel(/* ... */ compressImages, /* ... */ compressOtherImages);

// become

gulp.parallel(
  /* ... */ gulp.series(compressImages, compressOtherImages) /* ... */
);
```

## Useful links

- https://www.smashingmagazine.com/2021/04/humble-img-element-core-web-vitals/
- https://www.industrialempathy.com/posts/image-optimizations/
- https://www.industrialempathy.com/posts/avif-webp-quality-settings/
- https://cloudinary.com/blog/time_for_next_gen_codecs_to_dethrone_jpeg
