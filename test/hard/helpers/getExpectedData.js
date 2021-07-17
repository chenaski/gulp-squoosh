const { ImagePool } = require("@squoosh/lib");

const {
  FIXTURE_IMAGES_PATHS,
  FIXTURE_SIZES,
  FIXTURE_ENCODE_OPTIONS_SETS,
} = require("./constants");

const getExpectedData = async () => {
  const imagePool = new ImagePool();

  const result = {};

  for (const imagePath of FIXTURE_IMAGES_PATHS) {
    const image = await imagePool.ingestImage(imagePath);

    const decodedImage = await image.decoded;

    const { width, height } = decodedImage.bitmap;
    const size = decodedImage.size;

    result[imagePath] = {
      meta: { width, height, size },
      sizes: {},
    };

    for (const [sizeId, sizeOptions] of Object.entries(FIXTURE_SIZES)) {
      result[imagePath].sizes[sizeId] = {};

      for (const [encodeOptionsSetId, encodeOptions] of Object.entries(
        FIXTURE_ENCODE_OPTIONS_SETS
      )) {
        const image = await imagePool.ingestImage(imagePath);
        await image.decoded;

        if (sizeOptions) {
          await image.preprocess({
            resize: {
              width:
                typeof sizeOptions.width === "function"
                  ? sizeOptions.width(width)
                  : sizeOptions.width,
              height:
                typeof sizeOptions.height === "function"
                  ? sizeOptions.height(height)
                  : sizeOptions.height,
            },
          });
        }

        result[imagePath].sizes[sizeId][encodeOptionsSetId] = {};

        await image.encode(encodeOptions);

        for (const encodedImage of Object.values(image.encodedWith)) {
          const { extension, binary } = await encodedImage;
          const buffer = Buffer.from(binary);

          result[imagePath].sizes[sizeId][encodeOptionsSetId][extension] = {
            extension,
            buffer,
          };
        }
      }
    }
  }

  await imagePool.close();

  return result;
};

module.exports = {
  getExpectedData,
};
