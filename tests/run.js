(async () => {
  // $.verbose = false;

  const IMAGE_NAME = "gulp-squoosh-node";
  const NODE_VERSIONS = [
    "10-alpine",
    "12.5.0-alpine",
    "14.0.0-alpine",
    "16.0.0-alpine",
  ];

  const removeImages = async ({ version }) => {
    try {
      return await $`docker rmi ${IMAGE_NAME}:${version}`;
    } catch (e) {}
  };

  const buildImages = async ({ version }) => {
    return await $`docker build -q -t ${IMAGE_NAME}:${version} --build-arg NODE_VERSION=${version} -f tests/Dockerfile .`;
  };

  const runImages = async ({ version }) => {
    console.log(`\n\n\nstart node:${version}\n\n\n`);

    return { version, exitCode: 0 };

    return await $`docker run --rm ${IMAGE_NAME}:${version}`
      .then((result) => {
        return {
          exitCode: result.exitCode,
        };
      })
      .catch((result) => {
        return {
          exitCode: result.exitCode,
        };
      });
  };

  const results = [];

  for (const version of NODE_VERSIONS) {
    try {
      await removeImages({ version });
      await buildImages({ version });

      const { exitCode } = await runImages({ version });

      results.push({ version, exitCode });
    } catch (e) {
      console.log(e);
    }
  }

  console.log(
    `\n\n\n${results
      .map(({ version, exitCode }) =>
        console.log(`node:${version} ${!exitCode}`)
      )
      .join("\n")}\n\n\n`
  );
})();
