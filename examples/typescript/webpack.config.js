const path = require("path");

module.exports = {
  mode: "development",
  entry: "./sketch.ts",
  output: {
    filename: "sketch.js",
    path: path.resolve(__dirname, "out"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
