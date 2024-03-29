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
  // THROWS Type 'true' is not assignable to type 'number | undefined'
  method: true,
};

const avifOptions: AvifOptions = {
  // THROWS Type 'string' is not assignable to type 'number | undefined'
  speed: "true",
};

const mozjpegOptions: MozjpegOptions = {
  // THROWS Type 'number' is not assignable to type 'boolean | undefined'
  progressive: 0,
};

const jxlOptions: JxlOptions = {
  // THROWS Type 'never[]' is not assignable to type 'boolean | undefined'
  progressive: [],
};

const oxipngOptions: OxipngOptions = {
  // THROWS Type 'string' is not assignable to type 'number | undefined
  level: "0",
};

const wp2Options: Wp2Options = {
  // THROWS Type '{}' is not assignable to type 'number'
  quality: {},
};

const preprocessOptions: PreprocessOptions = {
  // THROWS Type '{ size: number; }' is not assignable to type 'ResizeOptions'
  resize: { size: 0 },
};

const encodeOptions: EncodeOptions = {
  // THROWS Type 'false' is not assignable to type '"auto" | WebpOptions | undefined'
  webp: false,
  // THROWS Type '"avifOptions"' is not assignable to type '"auto" | AvifOptions | undefined'
  avif: "avifOptions",
  // THROWS Type 'number' is not assignable to type '"auto" | MozjpegOptions | undefined'
  mozjpeg: 0,
};

const options: GulpSquooshOptions = {
  // THROWS Type '{ jpeg2000: {}; }' is not assignable to type 'EncodeOptions'
  encodeOptions: { jpeg2000: {} },
};

// THROWS Type '({ width, height, size }: { width: number; height: number; size: number; filePath: string; }) => { preprocessOptions: { resize: { width: string; }; }; }' is not assignable to type 'GulpSquooshOptionsFactory'
const optionsFactory: GulpSquooshOptionsFactory = ({ width, height, size }) => {
  return {
    preprocessOptions: {
      resize: {
        width: "500",
      },
    },
  };
};

gulp
  .src(SOURCE)
  .pipe(
    // THROWS Property 'wdth' does not exist on type '{ width: number; height: number; size: number; filePath: string; }'
    gulpSquoosh(({ wdth }) => ({
      preprocessOptions: { resize: { width: wdth } },
    }))
  )
  .pipe(gulp.dest(DESTINATION));
