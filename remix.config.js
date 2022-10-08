const { withEsbuildOverride } = require("remix-esbuild-override");
const GlobalsPolyfills =
  require("@esbuild-plugins/node-globals-polyfill").default;

withEsbuildOverride((option, { isServer }) => {
  if (isServer) option.mainFields = ["browser", "module", "main"];

  option.plugins = [
    GlobalsPolyfills({
      buffer: true,
    }),
    ...option.plugins,
  ];

  return option;
});

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  browserBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  devServerPort: 8002,
};
