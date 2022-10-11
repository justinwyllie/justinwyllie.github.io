const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env", "@babel/react"] }     //*this just transpiles to old style JS - TODO specific targets *} https://codeburst.io/babel-preset-env-cbc0bbf06b8f
      },
      {
         test: /\.(svg)$/i,
         type: 'asset/resource'
       }
  
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "build/"),
    publicPath: "/bundle/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "dist/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    hotOnly: true,
    historyApiFallback: {
        index: 'index.html'
      }
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};