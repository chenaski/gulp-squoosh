(async () => {
  $.verbose = false;

  const IMAGE_NAME = "gulp-squoosh-node";
  const NODE_VERSIONS = ["12.5.0-alpine", "14.0.0-alpine", "16.0.0-alpine"];

  const removeImages = async ({ version }) => {
    try {
      return await $`docker rmi ${IMAGE_NAME}:${version}`;
    } catch (e) {}
  };

  const buildImages = async ({ version }) => {
    return await $`docker build -q -t ${IMAGE_NAME}:${version} --build-arg NODE_VERSION=${version} -f tests/Dockerfile .`;
  };

  const runImages = async ({ version }) => {
    return await $`docker run --rm ${IMAGE_NAME}:${version}`
      .then((result) => {
        return {
          version,
          exitCode: result.exitCode,
        };
      })
      .catch((result) => {
        return {
          version,
          exitCode: result.exitCode,
        };
      });
  };

  const promises = NODE_VERSIONS.map(async (version) => {
    await removeImages({ version });
    await buildImages({ version });

    console.log(`run node:${version}`);
    return await runImages({ version });
  });

  Promise.all(promises).then((results) => {
    console.log(
      `\n${results
        .map(({ version, exitCode }) => `node:${version} ${!exitCode}`)
        .join("\n")}\n`
    );
  });
})();
