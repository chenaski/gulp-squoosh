(async () => {
  $.verbose = false;

  const IMAGE_NAME = "gulp-squoosh-node";
  const NODE_VERSIONS = ["12.5.0-alpine", "14.0.0-alpine", "16.0.0-alpine", "18.0.0-alpine"];

  const removeImages = async ({ version }) => {
    try {
      console.log(`Remove ${IMAGE_NAME}:${version}`);
      return await $`docker rmi ${IMAGE_NAME}:${version}`;
    } catch (e) {}
  };

  const buildImages = async ({ version }) => {
    console.log(`Build ${IMAGE_NAME}:${version}`);
    return await $`docker build -q -t ${IMAGE_NAME}:${version} --build-arg NODE_VERSION=${version} -f test/Dockerfile .`;
  };

  const runImages = async ({ version }) => {
    console.log(`Start ${IMAGE_NAME}:${version}`);
    return await $`docker run --rm ${IMAGE_NAME}:${version}`
      .then((result) => {
        return {
          version,
          exitCode: result.exitCode,
        };
      })
      .catch((result) => {
        console.error(result.stderr);
        return {
          version,
          exitCode: result.exitCode,
        };
      });
  };

  const promises = NODE_VERSIONS.map(async (version) => {
    await removeImages({ version });
    await buildImages({ version });

    return await runImages({ version });
  });

  Promise.all(promises).then((results) => {
    console.log(`\n${results.map(({ version, exitCode }) => `node:${version} ${!exitCode}`).join("\n")}\n`);
  });
})();
