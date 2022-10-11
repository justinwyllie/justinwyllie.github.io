 const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'development',

   devtool: 'inline-source-map', /* TODO - investigate this option so as to get source maps in dev */
   module: {
    rules: [
     {
       test: /\.scss$/i,
       use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            sourceMap: false
          },
        },
        {
          loader: "sass-loader",
          options: {
            sourceMap: false,
          },
        },
      ],
     }
   ]
 } ,
 });