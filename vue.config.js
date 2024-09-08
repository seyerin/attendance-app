const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
        "fs": false,
        "os": false,
        "util": false,
        "buffer": require.resolve('buffer/'),
        "stream": require.resolve('stream-browserify'),
        '@': path.resolve(__dirname, 'src'),
      }
    }
  },
  chainWebpack: config => {
    config.plugin('provide').use(require('webpack').ProvidePlugin, [{
      Buffer: ['buffer', 'Buffer'],
    }]);
  }
});

