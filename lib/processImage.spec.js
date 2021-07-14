const { processImage } = require("./processImage");
const { DEFAULT_ENCODE_OPTIONS } = require("./processImage");
const { getOptions } = require("./processImage");

const DECODED_IMAGE = {
  bitmap: {
    width: 200,
    height: 100,
  },
  size: 10,
};

const EXPECTED_OPTIONS = {
  preprocessOptions: {
    resize: {
      width: DECODED_IMAGE.bitmap.width / 2,
      height: DECODED_IMAGE.bitmap.height / 2,
    },
  },
  encodeOptions: {
    avif: true,
  },
};

const EXPECTED_ENCODED_WITH = { avif: Promise.resolve() };

const ingestedImageMock = {
  get decoded() {
    return DECODED_IMAGE;
  },
  get encodedWith() {
    return EXPECTED_ENCODED_WITH;
  },

  preprocess: jest.fn(),
  encode: jest.fn(),
};
const imagePoolMock = {
  ingestImage: jest.fn(() => ingestedImageMock),
};

describe("processImage", () => {
  beforeEach(() => {
    imagePoolMock.ingestImage.mockClear();

    ingestedImageMock.preprocess.mockClear();
    ingestedImageMock.encode.mockClear();
  });

  test("returns encoded images", async () => {
    const result = await processImage(imagePoolMock);

    expect(result).toEqual(EXPECTED_ENCODED_WITH);
  });

  describe("passes expected options to image.process and image.encode", () => {
    test("when run without options", async () => {
      await processImage(imagePoolMock);

      expect(ingestedImageMock.preprocess).toBeCalledTimes(1);
      expect(ingestedImageMock.preprocess).toBeCalledWith(undefined);

      expect(ingestedImageMock.encode).toBeCalledTimes(1);
      expect(ingestedImageMock.encode).toBeCalledWith(DEFAULT_ENCODE_OPTIONS);
    });

    test("when run with options object", async () => {
      await processImage(imagePoolMock, null, EXPECTED_OPTIONS);

      expect(ingestedImageMock.preprocess).toBeCalledTimes(1);
      expect(ingestedImageMock.preprocess).toBeCalledWith(
        EXPECTED_OPTIONS.preprocessOptions
      );

      expect(ingestedImageMock.encode).toBeCalledTimes(1);
      expect(ingestedImageMock.encode).toBeCalledWith(
        EXPECTED_OPTIONS.encodeOptions
      );
    });

    test("when run with options promise", async () => {
      await processImage(imagePoolMock, null, () =>
        Promise.resolve(EXPECTED_OPTIONS)
      );

      expect(ingestedImageMock.preprocess).toBeCalledTimes(1);
      expect(ingestedImageMock.preprocess).toBeCalledWith(
        EXPECTED_OPTIONS.preprocessOptions
      );

      expect(ingestedImageMock.encode).toBeCalledTimes(1);
      expect(ingestedImageMock.encode).toBeCalledWith(
        EXPECTED_OPTIONS.encodeOptions
      );
    });
  });
});

describe("getOptions", () => {
  test("returns default options when nothing is passed", async () => {
    const result = await getOptions({ decodedImage: DECODED_IMAGE });

    expect(result).toBeUndefined();
  });

  test("return passed options", async () => {
    const result = await getOptions({
      decodedImage: DECODED_IMAGE,
      options: EXPECTED_OPTIONS,
    });

    expect(result).toEqual(EXPECTED_OPTIONS);
  });

  test("passes expected params in function and returns resolved options", async () => {
    const result = await getOptions({
      decodedImage: DECODED_IMAGE,
      options: ({ width, height, size }) => {
        expect(width).toBe(DECODED_IMAGE.bitmap.width);
        expect(height).toBe(DECODED_IMAGE.bitmap.height);
        expect(size).toBe(DECODED_IMAGE.size);

        return EXPECTED_OPTIONS;
      },
    });

    expect(result).toEqual(EXPECTED_OPTIONS);
  });
});
