# gulp-squoosh

Gulp plugin to compress images using [Squoosh](https://github.com/GoogleChromeLabs/squoosh).

> The library this plugin covers is [going to be deprecated](https://github.com/GoogleChromeLabs/squoosh/pull/1266#issuecomment-1208149979),
> so you would better consider using another [alternative](https://github.com/lovell/sharp).

![github `test` workflow status](https://github.com/chenaski/gulp-squoosh/actions/workflows/test.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/gulp-squoosh)
![license](https://img.shields.io/npm/l/gulp-squoosh)
![npm downloads](https://img.shields.io/npm/dm/gulp-squoosh)
![nodejs support](https://img.shields.io/node/v/gulp-squoosh)
[![coverage](https://coveralls.io/repos/github/chenaski/gulp-squoosh/badge.svg?branch=main)](https://coveralls.io/github/chenaski/gulp-squoosh?branch=main)

## Installation

```
npm i -D gulp-squoosh
```

## Usage

```js
const gulp = require("gulp");
const gulpSquoosh = require("gulp-squoosh");

function processImages() {
  return gulp.src("src/images/**").pipe(gulpSquoosh()).pipe(gulp.dest("dist/images"));
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

You can see full source code of the example [here](example/cjs/gulpfile.js).

With growing adoption of ES modules, more and more libraries [drop CommonJS support](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
Despite the fact this library doesn't support ESM, you can continue to use it in your ESM projects,
[here is an example](example/esm/gulpfile.js).

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
        gulpSquoosh(({ width, height, size, filePath }) => ({
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
```

Then you can use converted images with [`<picture>`](https://web.dev/learn/design/picture-element/) tag:

```html
<picture>
  <source srcset="image.jxl" type="image/jxl" />
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="fill out me" />
</picture>
```

## Troubleshooting

### WASM memory error

You cannot run multiple `gulp-squoosh` tasks in parallel (via `gulp.parallel`) because you will get a `wasm memory error`.
But you can just replace it with `gulp.serial`, it will not affect the speed:

```js
gulp.parallel(/* ... */ compressImages, /* ... */ compressOtherImages);

// become

gulp.parallel(/* ... */ gulp.series(compressImages, compressOtherImages) /* ... */);
```

## Useful links

- https://www.smashingmagazine.com/2021/04/humble-img-element-core-web-vitals/
- https://www.industrialempathy.com/posts/image-optimizations/
- https://www.industrialempathy.com/posts/avif-webp-quality-settings/
- https://cloudinary.com/blog/time_for_next_gen_codecs_to_dethrone_jpeg
