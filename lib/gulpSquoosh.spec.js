const PluginError = require("plugin-error");

const { getTransform, getFlush } = require("./gulpSquoosh");

const { handleFiles } = require("./handleFiles");
jest.mock("./handleFiles");

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

describe("getTransform", () => {
  test("file.isNull() ", async () => {
    const filesMock = { push: jest.fn() };
    const fileMock = getFileMock();
    const pushMock = jest.fn();

    const transform = getTransform(filesMock);

    await transform.bind({
      push: pushMock,
    })(fileMock, null, (error, file) => {
      expect(error).toBeFalsy();
      expect(file).toEqual(fileMock);
    });

    expect(pushMock).toBeCalledTimes(0);

    expect(filesMock.push).toBeCalledTimes(0);

    expect(handleFiles).toBeCalledTimes(0);
  });

  test("file.isBuffer()", async () => {
    const filesMock = { push: jest.fn() };
    const pushMock = jest.fn();

    const fileMock = getFileMock();
    fileMock.isNull.mockReturnValueOnce(false);

    const transform = getTransform(filesMock);

    await transform.bind({
      push: pushMock,
    })(fileMock, null, (error, file) => {
      expect(error).toBeFalsy();
      expect(file).toBeFalsy();
    });

    expect(pushMock).toBeCalledTimes(0);

    expect(filesMock.push).toBeCalledTimes(1);
    expect(filesMock.push).toBeCalledWith(fileMock);

    expect(handleFiles).toBeCalledTimes(0);
  });

  test("file.isStream()", async () => {
    const filesMock = { push: jest.fn() };
    const pushMock = jest.fn();

    const fileMock = getFileMock();
    fileMock.isNull.mockReturnValueOnce(false);
    fileMock.isBuffer.mockReturnValueOnce(false);

    const transform = getTransform();

    await transform.bind({
      push: pushMock,
    })(fileMock, null, (error, file) => {
      expect(error).toBeInstanceOf(PluginError);
      expect(file).toBeFalsy();
    });

    expect(pushMock).toBeCalledTimes(0);

    expect(filesMock.push).toBeCalledTimes(0);

    expect(handleFiles).toBeCalledTimes(0);
  });

  test("all the rest", async () => {
    const filesMock = { push: jest.fn() };
    const pushMock = jest.fn();

    const fileMock = getFileMock();
    fileMock.isNull.mockReturnValueOnce(false);
    fileMock.isBuffer.mockReturnValueOnce(false);
    fileMock.isStream.mockReturnValueOnce(false);

    const transform = getTransform();

    await transform.bind({
      push: pushMock,
    })(fileMock, null, (error, file) => {
      expect(error).toBeFalsy();
      expect(file).toEqual(fileMock);
    });

    expect(pushMock).toBeCalledTimes(0);

    expect(filesMock.push).toBeCalledTimes(0);

    expect(handleFiles).toBeCalledTimes(0);
  });
});

test("getFlush", async () => {
  const optionsMock = { encodeOptions: { avif: {} } };
  const filesMock = { push: jest.fn() };
  const bindPush = Symbol("BIND_PUSH");
  const bindMock = jest.fn(() => bindPush);
  const pushMock = { bind: bindMock };
  const callbackMock = jest.fn();

  const flush = getFlush(filesMock, optionsMock);

  const context = {
    push: pushMock,
  };

  await flush.bind(context)(callbackMock);

  expect(bindMock).toBeCalledTimes(1);

  expect(handleFiles).toBeCalledTimes(1);
  expect(handleFiles).toBeCalledWith(filesMock, bindPush, optionsMock);

  expect(callbackMock).toBeCalledTimes(1);
});
