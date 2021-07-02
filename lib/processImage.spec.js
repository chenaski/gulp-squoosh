const { processImage } = require("./processImage");
const { DEFAULT_ENCODE_OPTIONS } = require("./processImage");
const { getOptions } = require("./processImage");

const libSquoosh = require("@squoosh/lib");
jest.mock("@squoosh/lib");

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
  close: jest.fn(),
};

describe("processImage", () => {
  beforeAll(() => {
    libSquoosh.ImagePool.mockReturnValue(imagePoolMock);
  });

  beforeEach(() => {
    imagePoolMock.ingestImage.mockClear();
    imagePoolMock.close.mockClear();

    ingestedImageMock.preprocess.mockClear();
    ingestedImageMock.encode.mockClear();
  });

  test("returns encoded images and close imagePool", async () => {
    const result = await processImage();

    expect(result).toEqual(EXPECTED_ENCODED_WITH);
  });

  test("passes expected options to image.process and image.encode", async () => {
    // run without options

    await processImage(null);

    expect(ingestedImageMock.preprocess).toBeCalledTimes(1);
    expect(ingestedImageMock.preprocess).toBeCalledWith(undefined);

    expect(ingestedImageMock.encode).toBeCalledTimes(1);
    expect(ingestedImageMock.encode).toBeCalledWith(DEFAULT_ENCODE_OPTIONS);

    // run with options object

    await processImage(null, EXPECTED_OPTIONS);

    expect(ingestedImageMock.preprocess).toBeCalledTimes(2);
    expect(ingestedImageMock.preprocess).toBeCalledWith(
      EXPECTED_OPTIONS.preprocessOptions
    );

    expect(ingestedImageMock.encode).toBeCalledTimes(2);
    expect(ingestedImageMock.encode).toBeCalledWith(
      EXPECTED_OPTIONS.encodeOptions
    );

    // run with options promise

    await processImage(null, () => Promise.resolve(EXPECTED_OPTIONS));

    expect(ingestedImageMock.preprocess).toBeCalledTimes(3);
    expect(ingestedImageMock.preprocess).toBeCalledWith(
      EXPECTED_OPTIONS.preprocessOptions
    );

    expect(ingestedImageMock.encode).toBeCalledTimes(3);
    expect(ingestedImageMock.encode).toBeCalledWith(
      EXPECTED_OPTIONS.encodeOptions
    );
  });

  test("closes imagePool", async () => {
    await processImage();

    expect(imagePoolMock.close).toBeCalledTimes(1);
  });

  test("closes imagePool when error", async () => {
    imagePoolMock.ingestImage.mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      return await processImage();
    }).rejects.toThrowError();
    expect(imagePoolMock.close).toBeCalledTimes(1);
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
