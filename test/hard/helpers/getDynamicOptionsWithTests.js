const getDynamicOptionsWithTests =
  (expectedData) =>
  ({ imagePath, options }) =>
  async ({ width, height, size }) => {
    const {
      width: expectedWidth,
      height: expectedHeight,
      size: expectedSize,
    } = expectedData[imagePath].meta;

    expect(width).toBe(expectedWidth);
    expect(height).toBe(expectedHeight);
    expect(size).toBe(expectedSize);

    return {
      preprocessOptions: {
        resize: {
          width: width * 0.5,
          height: height * 0.5,
        },
      },
      ...options,
    };
  };

module.exports = {
  getDynamicOptionsWithTests,
};
