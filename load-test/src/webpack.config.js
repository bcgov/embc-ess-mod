const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const GlobEntries = require('webpack-glob-entries');
const webpack = require('webpack');

module.exports = function (env) {
  var appTarget = env.dev ? 'dev' : 'template';
  return {
    mode: 'production',
    entry: GlobEntries('./src/*test*.ts'), // Generates multiple entry for each test
    output: {
      path: path.join(__dirname, 'dist'),
      libraryTarget: 'commonjs',
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    target: 'web',
    externals: /^(k6|https?\:\/\/)(\/.*)?/,
    // Generate map files for compiled scripts
    devtool: "source-map",
    stats: {
      colors: true,
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/(.*)-APP_TARGET(\.*)/, function (resource) { resource.request = resource.request.replace(/-APP_TARGET/, `-${appTarget}`); }),
      new CleanWebpackPlugin(),
    ],
    optimization: {
      // Don't minimize, as it's not used in the browser
      minimize: false,
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  }
}
