const { handleFiles, transformPath } = require("./handleFiles");

const { ImagePool } = require("@squoosh/lib");
jest.mock("@squoosh/lib");
const ImagePoolCloseMock = jest.fn();
const ImagePoolMock = jest.fn(() => ({
  close: ImagePoolCloseMock,
}));
ImagePool.mockImplementation(ImagePoolMock);

const log = require("fancy-log");
jest.mock("fancy-log");

const { processImage } = require("./processImage");
jest.mock("./processImage");
processImage.mockReturnValue({
  avif: Promise.resolve({
    extension: "test-avif",
    binary: "MOCK_BINARY",
  }),
});

const getFileMock = () => {
  const fileMock = {
    isNull: jest.fn(() => true),
    isBuffer: jest.fn(() => true),
    isStream: jest.fn(() => true),

    contents: "MOCK_CONTENTS",
    path: "test/path.jpg",
    clone: jest.fn(),
  };
  fileMock.clone.mockImplementation(() => ({ ...fileMock }));
  return fileMock;
};

describe("handleFiles", () => {
  beforeEach(() => {
    ImagePoolMock.mockClear();
    ImagePoolCloseMock.mockClear();

    log.mockClear();

    processImage.mockClear();
  });

  test("pushes a file for each codec returned from processImage", async () => {
    const fileMock = getFileMock();
    const filesMock = [fileMock, fileMock];
    const expectedFilesCount = filesMock.length;

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

    processImage.mockReturnValue(processImageResultMock);

    const expectedResults = [
      {
        ...fileMock,
        path: `test/path.${avifResultMock.extension}`,
        contents: Buffer.from(avifResultMock.binary),
      },
      {
        ...fileMock,
        path: `test/path.${avifResultMock.extension}`,
        contents: Buffer.from(avifResultMock.binary),
      },
      {
        ...fileMock,
        path: `test/path.${jxlResultMock.extension}`,
        contents: Buffer.from(jxlResultMock.binary),
      },
      {
        ...fileMock,
        path: `test/path.${jxlResultMock.extension}`,
        contents: Buffer.from(jxlResultMock.binary),
      },
    ];
    const codecsCount = Object.keys(processImageResultMock).length;

    await handleFiles(filesMock, pushMock, optionsMock);

    expect(fileMock.clone).toBeCalledTimes(codecsCount * expectedFilesCount);

    expect(pushMock).toBeCalledTimes(codecsCount * expectedFilesCount);
    expectedResults.forEach((expectedResult, i) => {
      expect(pushMock).nthCalledWith(i + 1, expectedResult);
    });

    expect(processImage).toBeCalledTimes(expectedFilesCount);
    filesMock.forEach((fileMock, i) => {
      expect(processImage).nthCalledWith(i + 1, {
        imagePool: ImagePoolMock(),
        fileBuffer: fileMock.contents,
        filePath: fileMock.path,
        options: optionsMock,
      });
    });

    expect(log).toHaveBeenCalledTimes(0);
  });

  test("creates imagePool once", async () => {
    const filesMock = [];

    await handleFiles(filesMock);

    expect(ImagePoolMock).toBeCalledTimes(1);

    expect(log).toHaveBeenCalledTimes(0);
  });

  test("closes imagePool at the end", async () => {
    const filesMock = [];

    await handleFiles(filesMock);

    expect(ImagePoolCloseMock).toBeCalledTimes(1);

    expect(log).toHaveBeenCalledTimes(0);
  });

  describe("on error", () => {
    test("closes imagePool", async () => {
      const filesMock = [getFileMock()];

      processImage.mockImplementationOnce(() => {
        throw new Error();
      });

      await handleFiles(filesMock);

      expect(ImagePoolCloseMock).toBeCalledTimes(1);

      expect(log).toHaveBeenCalledTimes(1);
    });

    test("logs", async () => {
      const filesMock = [getFileMock()];

      const expectedErrorMessage = "TEST_ERROR_MESSAGE";

      processImage.mockImplementationOnce(() => {
        throw new Error(expectedErrorMessage);
      });

      await handleFiles(filesMock);

      expect(ImagePoolCloseMock).toBeCalledTimes(1);

      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith(expect.stringMatching("gulp-squoosh"));
      expect(log).toHaveBeenCalledWith(
        expect.stringMatching("TEST_ERROR_MESSAGE")
      );
    });

    test("returns partial result", async () => {
      const fileMock = getFileMock();
      const filesMock = [fileMock, fileMock, fileMock];
      const errorsCount = 1;
      const expectedFilesCount = filesMock.length - errorsCount;

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

      processImage.mockReturnValue(processImageResultMock);
      processImage.mockImplementationOnce(() => {
        throw new Error("ERROR_MESSAGE");
      });

      const expectedResults = [
        {
          ...fileMock,
          path: `test/path.${avifResultMock.extension}`,
          contents: Buffer.from(avifResultMock.binary),
        },
        {
          ...fileMock,
          path: `test/path.${avifResultMock.extension}`,
          contents: Buffer.from(avifResultMock.binary),
        },
        {
          ...fileMock,
          path: `test/path.${jxlResultMock.extension}`,
          contents: Buffer.from(jxlResultMock.binary),
        },
        {
          ...fileMock,
          path: `test/path.${jxlResultMock.extension}`,
          contents: Buffer.from(jxlResultMock.binary),
        },
      ];
      const codecsCount = Object.keys(processImageResultMock).length;

      await handleFiles(filesMock, pushMock, optionsMock);

      expect(fileMock.clone).toBeCalledTimes(codecsCount * expectedFilesCount);

      expect(pushMock).toBeCalledTimes(codecsCount * expectedFilesCount);
      expectedResults.forEach((expectedResult, i) => {
        expect(pushMock).nthCalledWith(i + 1, expectedResult);
      });

      expect(processImage).toBeCalledTimes(filesMock.length);
      filesMock.forEach((fileMock, i) => {
        expect(processImage).nthCalledWith(i + 1, {
          imagePool: ImagePoolMock(),
          fileBuffer: fileMock.contents,
          filePath: fileMock.path,
          options: optionsMock,
        });
      });

      expect(log).toHaveBeenCalledTimes(1);
    });
  });
});

describe("transformPath", () => {
  test("replaces extension", () => {
    const fileMock = getFileMock();
    const ext = "test";
    const expectedPath = `test/path.${ext}`;

    const result = transformPath(fileMock.path, ext);

    expect(result).toBe(expectedPath);
  });
});
