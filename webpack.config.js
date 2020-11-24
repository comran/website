const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');
const path = require("path")

let templates = [];

const getAllFiles = function(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath)
  
  arrayOfFiles = arrayOfFiles || []
  
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath.slice(10), file))
    }
  })
  
  return arrayOfFiles
}

let pagesDir = 'src/pages';
let allPugPages = getAllFiles(pagesDir)

allPugPages.forEach(file => {
  if (file.match(/\.pug$/)) {
    let pageDirectory = path.dirname(file).slice(1);
    let filename = file.substring(0, file.length - 4);
    
    templates.push(
      new HtmlWebpackPlugin({
        template: pagesDir + '/' + filename + '.pug',
        filename: filename + '.html'
      })
    );
  }
});

module.exports = {
  entry: ['./src/index.js'],
  devServer: {
    port: 8080
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          "raw-loader",
          "pug-html-loader"
        ]
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader'
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            },
          }
        ]
      },
      {
        test: /favicon\.ico$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/'
            },
          }
        ]
      },
      {
        test: /\.(svg|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            },
          }
        ]
      }
    ]
  },
  plugins: [
    ...templates,
    new HtmlWebpackPugPlugin(),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/images", to: "images" },
        { from: "src/fonts", to: "fonts" },
        { from: "src/favicon.ico", to: "favicon.ico" }
      ]
    })
    // new CleanWebpackPlugin({
    //   cleanAfterEveryBuildPatterns: 'dist'
    // })
  ]
}