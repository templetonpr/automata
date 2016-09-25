const isDebug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, "src");
const DIST_DIR = path.resolve(__dirname, "dist");

//  What all do we need to do?
//    - Babel es6+ /src/scripts/**/*.js -> uglify -> /assets/bundle-[hash].js
//    - Sass/scss /src/styles/**/*.[sass, scss] -> /assets/style.css
//    - html src -> dist

module.exports = {
  // context: __dirname,
  devtool: isDebug ? "inline-sourcemap" : null,
  entry: path.join(SRC_DIR, "scripts", "index.js"),
  output: {
    path: path.join(DIST_DIR, "assets"),
    filename: "bundle.min.js",
    publicPath: "/assets/",
  },
  module: {
    loaders: [
      { // babel
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"],
        },
      },
    ],
  },
  plugins: isDebug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
  ],
};
