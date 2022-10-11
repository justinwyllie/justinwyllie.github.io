 const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');
 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 
 
 /* for more steps: https://webpack.js.org/guides/production/#minification 
 https://kimsereyblog.blogspot.com/2018/06/bundle-bootstrap-using-webpack.html#*/
 module.exports = merge(common, {
   mode: 'production',
     module: {
     rules: [
      {
        test: /\.scss$/i,
        use: [ 
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader'
          ]
      }
    ]
  } ,
     plugins: [
        new MiniCssExtractPlugin({
            filename: "bundle.css"
        })
    ] 
 }
 );