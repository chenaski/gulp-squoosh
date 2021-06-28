const fs = require("fs");
const path = require("path");

const { DEFAULT_ENCODE_OPTIONS } = require("../../lib/processImage");

const FIXTURES_DIR = path.resolve(__dirname, "../fixtures");
const FIXTURE_IMAGES_PATHS = fs
  .readdirSync(FIXTURES_DIR)
  .map((fileName) => path.join(FIXTURES_DIR, fileName));

const FIXTURE_SIZE_ORIGINAL = "FIXTURE_SIZE_ORIGINAL";
const FIXTURE_SIZE_100_100 = "FIXTURE_SIZE_100_100";
const FIXTURE_SIZE_0_5 = "FIXTURE_SIZE_0_5";

const FIXTURE_SIZES = {
  [FIXTURE_SIZE_ORIGINAL]: null,
  [FIXTURE_SIZE_100_100]: { width: 100, height: 100 },
  [FIXTURE_SIZE_0_5]: {
    width: (w) => w * 0.5,
    height: (h) => h * 0.5,
  },
};

const FIXTURE_ENCODE_OPTIONS_DEFAULT = "FIXTURE_ENCODE_OPTIONS_DEFAULT";
const FIXTURE_ENCODE_OPTIONS_CUSTOM = "FIXTURE_ENCODE_OPTIONS_CUSTOM";

const FIXTURE_ENCODE_OPTIONS_SETS = {
  [FIXTURE_ENCODE_OPTIONS_DEFAULT]: DEFAULT_ENCODE_OPTIONS,
  [FIXTURE_ENCODE_OPTIONS_CUSTOM]: {
    mozjpeg: {
      quality: 20,
    },
    webp: {
      quality: 20,
    },
    avif: {
      speed: 8,
    },
    jxl: {
      quality: 20,
    },
    oxipng: {
      level: 1,
    },
    wp2: {
      quality: 20,
    },
  },
};

module.exports = {
  FIXTURE_IMAGES_PATHS,

  FIXTURE_SIZE_ORIGINAL,
  FIXTURE_SIZE_100_100,
  FIXTURE_SIZE_0_5,
  FIXTURE_SIZES,

  FIXTURE_ENCODE_OPTIONS_DEFAULT,
  FIXTURE_ENCODE_OPTIONS_CUSTOM,
  FIXTURE_ENCODE_OPTIONS_SETS,
};
