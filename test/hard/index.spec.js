const {
  FIXTURE_IMAGES_PATHS,

  FIXTURE_SIZE_ORIGINAL,
  FIXTURE_SIZE_100_100,
  FIXTURE_SIZE_0_5,
  FIXTURE_SIZES,

  FIXTURE_ENCODE_OPTIONS_DEFAULT,
  FIXTURE_ENCODE_OPTIONS_CUSTOM,
  FIXTURE_ENCODE_OPTIONS_SETS,
} = require("./helpers/constants");

const { getExpectedData } = require("./helpers/getExpectedData");
const {
  getCompareWithExpectedData,
} = require("./helpers/getCompareWithExpectedData");
const {
  getDynamicOptionsWithTests,
} = require("./helpers/getDynamicOptionsWithTests");

jest.setTimeout(60000);

describe("gulp-squoosh", () => {
  let expectedData;
  let compareWithExpectedData;
  let dynamicOptionsWithTests;

  beforeAll(async () => {
    expectedData = await getExpectedData();
    compareWithExpectedData = getCompareWithExpectedData(expectedData);
    dynamicOptionsWithTests = getDynamicOptionsWithTests(expectedData);
  });

  describe("default options", () => {
    test.each(FIXTURE_IMAGES_PATHS)(
      "returns one file for each codec specified in FIXTURE_ENCODE_OPTIONS_DEFAULT",
      async (imagePath) => {
        return compareWithExpectedData({
          imagePath,
          size: FIXTURE_SIZE_ORIGINAL,
          optionsSet: FIXTURE_ENCODE_OPTIONS_DEFAULT,
        });
      }
    );
  });

  describe("set preprocessOptions", () => {
    describe("as object", () => {
      const options = {
        preprocessOptions: {
          resize: {
            enabled: true,
            ...FIXTURE_SIZES[FIXTURE_SIZE_100_100],
          },
        },
      };

      test.each(FIXTURE_IMAGES_PATHS)(
        "returns one RESIZED file for each codec specified in FIXTURE_ENCODE_OPTIONS_DEFAULT",
        async (imagePath) => {
          return compareWithExpectedData({
            imagePath,
            options,
            size: FIXTURE_SIZE_100_100,
            optionsSet: FIXTURE_ENCODE_OPTIONS_DEFAULT,
          });
        }
      );
    });

    describe("as function", () => {
      test.each(FIXTURE_IMAGES_PATHS)(
        "returns one RESIZED file for each codec specified in FIXTURE_ENCODE_OPTIONS_DEFAULT",
        async (imagePath) => {
          return compareWithExpectedData({
            imagePath,
            options: dynamicOptionsWithTests({ imagePath }),
            size: FIXTURE_SIZE_0_5,
            optionsSet: FIXTURE_ENCODE_OPTIONS_DEFAULT,
          });
        }
      );
    });
  });

  describe("set encodeOptions", () => {
    const options = {
      encodeOptions: FIXTURE_ENCODE_OPTIONS_SETS[FIXTURE_ENCODE_OPTIONS_CUSTOM],
    };

    test.each(FIXTURE_IMAGES_PATHS)(
      "returns one file for each codec specified in FIXTURE_ENCODE_OPTIONS_CUSTOM",
      async (imagePath) => {
        return compareWithExpectedData({
          imagePath,
          options,
          size: FIXTURE_SIZE_ORIGINAL,
          optionsSet: FIXTURE_ENCODE_OPTIONS_CUSTOM,
        });
      }
    );
  });

  describe("set preprocessOptions and encodeOptions", () => {
    const options = {
      preprocessOptions: {
        resize: {
          enabled: true,
          ...FIXTURE_SIZES[FIXTURE_SIZE_100_100],
        },
      },
      encodeOptions: FIXTURE_ENCODE_OPTIONS_SETS[FIXTURE_ENCODE_OPTIONS_CUSTOM],
    };

    describe("as object", () => {
      test.each(FIXTURE_IMAGES_PATHS)(
        "returns one RESIZED file for each codec specified in FIXTURE_ENCODE_OPTIONS_CUSTOM",
        async (imagePath) => {
          return compareWithExpectedData({
            imagePath,
            options,
            size: FIXTURE_SIZE_100_100,
            optionsSet: FIXTURE_ENCODE_OPTIONS_CUSTOM,
          });
        }
      );
    });

    describe("as function", () => {
      test.each(FIXTURE_IMAGES_PATHS)(
        "returns one RESIZED file for each codec specified in FIXTURE_ENCODE_OPTIONS_CUSTOM",
        async (imagePath) => {
          return compareWithExpectedData({
            imagePath,
            options: dynamicOptionsWithTests({
              imagePath,
              options: { encodeOptions: options.encodeOptions },
            }),
            size: FIXTURE_SIZE_0_5,
            optionsSet: FIXTURE_ENCODE_OPTIONS_CUSTOM,
          });
        }
      );
    });
  });
});
