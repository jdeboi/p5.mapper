const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"), // Point to your TypeScript entry file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "p5.mapper.min.js",
    library: "p5.mapper",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/, // Use Babel for both .js and .ts files
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve both .ts and .js files
  },
  optimization: {
    minimize: false,
  },
  mode: "production",
};
