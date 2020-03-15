const path = require("path");
const phaser = path.join(__dirname, "/node_modules/phaser/", "dist/phaser.js");

module.exports = {
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader", exclude: "/node_modules/" },
      { test: /phaser\.js$/, loader: "expose-loader?Phaser" },
      {
        test: /\.(woff|woff2|otf|tff|eot)$/,
        loader: "url-loader?limit=100000&name=./fonts/[name].[ext]"
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./"),
    publicPath: "/dist/",
    host: "127.0.0.1",
    port: 8080,
    open: true
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      phaser
    }
  }
};
