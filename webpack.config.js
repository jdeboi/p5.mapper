// webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

/** @param {boolean} min */
function makeConfig(min) {
  return {
    entry: path.resolve(__dirname, "src/ProjectionMapper.ts"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: min ? "p5.mapper.min.js" : "p5.mapper.js",
      library: {
        name: "p5.mapper",
        type: "umd",
        export: "default",
      },
      globalObject: "this", // safer UMD on workers/node
      clean: !min, // clean once on the first build
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
      ],
    },
    resolve: { extensions: [".ts", ".js"] },
    externals: { p5: "p5" }, // expect global p5
    devtool: min ? false : "source-map",
    mode: "production",
    optimization: {
      minimize: min,
      minimizer: min
        ? [
            new TerserPlugin({
              extractComments: false,
              terserOptions: {
                format: { comments: false },
                compress: { passes: 2 },
              },
            }),
          ]
        : [],
    },
  };
}

module.exports = [makeConfig(false), makeConfig(true)];
