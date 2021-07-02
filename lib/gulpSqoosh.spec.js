const PluginError = require("plugin-error");
const { transformPath } = require("./gulpSquoosh");

const { getTransform, handleBuffer } = require("./gulpSquoosh");

const { processImage } = require("./processImage");
jest.mock("./processImage");
processImage.mockReturnValue({
  avif: Promise.resolve({
    extension: "test-avif",
    binary: "MOCK_BINARY",
  }),
});

const FILE_MOCK = {
  isNull: jest.fn(() => true),
  isBuffer: jest.fn(() => true),
  isStream: jest.fn(() => true),

  contents: "MOCK_CONTENTS",
  path: "test/path.jpg",
  clone: jest.fn(),
};
FILE_MOCK.clone.mockImplementation(() => ({ ...FILE_MOCK }));

describe("getTransform", () => {
  beforeEach(() => {
    FILE_MOCK.isNull.mockClear();
    FILE_MOCK.isNull.mockImplementation(() => true);

    FILE_MOCK.isBuffer.mockClear();
    FILE_MOCK.isBuffer.mockImplementation(() => true);

    FILE_MOCK.isStream.mockClear();
    FILE_MOCK.isStream.mockImplementation(() => true);

    FILE_MOCK.clone.mockClear();

    processImage.mockClear();
  });

  test("file.isNull() ", async () => {
    const transform = getTransform();

    return transform({ ...FILE_MOCK }, null, (error, file) => {
      expect(error).toBeFalsy();
      expect(file).toEqual(FILE_MOCK);
    });
  });

  test("file.isBuffer()", () => {
    const optionsMock = { encodeOptions: { avif: {} } };

    const transform = getTransform(optionsMock);

    FILE_MOCK.isNull.mockReturnValueOnce(false);
    const pushMock = jest.fn();

    return transform.bind({
      push: pushMock,
    })({ ...FILE_MOCK }, null, (error, file) => {
      expect(error).toBeFalsy();
      expect(file).toBeFalsy();

      expect(pushMock).toBeCalledTimes(1);

      expect(processImage).toBeCalledWith(FILE_MOCK.contents, optionsMock);
    });
  });

  test("file.isStream()", () => {
    const transform = getTransform();

    FILE_MOCK.isNull.mockReturnValueOnce(false);
    FILE_MOCK.isBuffer.mockReturnValueOnce(false);

    return transform({ ...FILE_MOCK }, null, (error, file) => {
      expect(error).toBeInstanceOf(PluginError);
      expect(file).toBeFalsy();

      expect(processImage).toBeCalledTimes(0);
    });
  });
});

describe("handleBuffer", () => {
  test("pushes a file for each codec returned from processImage", async () => {
    const avifResultMock = {
      binary: "MOCK_AVIF_BINARY",
      extension: "avif-test",
    };
    const jxlResultMock = {
      binary: "MOCK_JXL_BINARY",
      extension: "jxl-test",
    };
    const optionsMock = {
      encodeOptions: {
        avif: {},
        jxl: {},
      },
    };
    const processImageResultMock = {
      avif: Promise.resolve(avifResultMock),
      jxl: Promise.resolve(jxlResultMock),
    };
    const pushMock = jest.fn();

    processImage.mockReturnValueOnce(processImageResultMock);

    const expectedResults = [
      {
        ...FILE_MOCK,
        path: `test/path.${avifResultMock.extension}`,
        contents: Buffer.from(avifResultMock.binary),
      },
      {
        ...FILE_MOCK,
        path: `test/path.${jxlResultMock.extension}`,
        contents: Buffer.from(jxlResultMock.binary),
      },
    ];
    const codecsCount = Object.keys(processImageResultMock).length;

    await handleBuffer({ ...FILE_MOCK }, pushMock, optionsMock);

    expect(FILE_MOCK.clone).toBeCalledTimes(codecsCount);

    expect(pushMock).toBeCalledTimes(codecsCount);

    expectedResults.forEach((expectedResult, i) => {
      expect(pushMock).nthCalledWith(i + 1, expectedResult);
    });
  });
});

describe("transformPath", () => {
  test("replaces extension", () => {
    const ext = "test";
    const expectedPath = `test/path.${ext}`;

    const result = transformPath(FILE_MOCK.path, ext);

    expect(result).toBe(expectedPath);
  });
});
