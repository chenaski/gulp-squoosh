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

  const image = imagePool.ingestImage(input);

  const decodedImage = await image.decoded;

  const { preprocessOptions, encodeOptions } = await getOptions({
    decodedImage,
    options,
  });

  await image.preprocess(preprocessOptions);

  await image.encode(encodeOptions || DEFAULT_ENCODE_OPTIONS);

  await imagePool.close();

  return image.encodedWith;
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
};
