import gulp from "gulp";
import gulpSquoosh from "../index";

import {
  AvifOptions,
  EncodeOptions,
  GulpSquooshOptions,
  GulpSquooshOptionsFactory,
  JxlOptions,
  MozjpegOptions,
  OxipngOptions,
  PreprocessOptions,
  WebpOptions,
  Wp2Options,
} from "../index";

const SOURCE = "src/images/**";
const DESTINATION = "build/images";

const webpOptions: WebpOptions = {
  quality: 80,
  method: 9,
};

const avifOptions: AvifOptions = {
  speed: 0,
};

const mozjpegOptions: MozjpegOptions = {
  quality: 80,
  progressive: true,
};

const jxlOptions: JxlOptions = {
  speed: 0,
  quality: 80,
  progressive: true,
};

const oxipngOptions: OxipngOptions = {
  level: 6,
};

const wp2Options: Wp2Options = {
  quality: 80,
};

const preprocessOptions: PreprocessOptions = {
  resize: { width: 0 },
};

const encodeOptions: EncodeOptions = {
  webp: webpOptions,
  avif: avifOptions,
  mozjpeg: mozjpegOptions,
  jxl: jxlOptions,
  oxipng: oxipngOptions,
  wp2: wp2Options,
};

const encodeOptionsShort: EncodeOptions = {
  webp: {},
  avif: "auto",
};

const options: GulpSquooshOptions = {
  encodeOptions: encodeOptions,
};

const optionsFactory: GulpSquooshOptionsFactory = ({ width, height, size }) => {
  return {
    preprocessOptions: {
      resize: {
        width: width * 0.5,
      },
    },
  };
};

gulp
  .src(SOURCE)
  .pipe(gulpSquoosh(options))
  .pipe(gulpSquoosh(optionsFactory))
  .pipe(
    gulpSquoosh(({ width }) => ({ preprocessOptions: { resize: { width } } }))
  )
  .pipe(gulp.dest(DESTINATION));
