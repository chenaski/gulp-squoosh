const { ImagePool } = require("@squoosh/lib");

const DEFAULT_ENCODE_OPTIONS = {
  mozjpeg: {},
  webp: {},
  avif: {},
  jxl: {},
  oxipng: {},
};

async function processImage(input, options = {}) {
  const imagePool = new ImagePool();

  try {
    const image = imagePool.ingestImage(input);

    const decodedImage = await image.decoded;

    const { preprocessOptions, encodeOptions } = await getOptions({
      decodedImage,
      options,
    });

    await image.preprocess(preprocessOptions);

    await image.encode(encodeOptions || DEFAULT_ENCODE_OPTIONS);

    return image.encodedWith;
  } finally {
    await imagePool.close();
  }
}

async function getOptions({ decodedImage, options }) {
  if (typeof options === "function") {
    const { width, height } = decodedImage.bitmap;

    return await options({ width, height, size: decodedImage.size });
  }

  return options;
}

module.exports = {
  DEFAULT_ENCODE_OPTIONS,
  processImage,
  getOptions,
};
