const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source-map-loader for node_modules
      webpackConfig.module.rules = webpackConfig.module.rules.map(rule => {
        if (rule.loader && rule.loader.includes('source-map-loader')) {
          return {
            ...rule,
            exclude: /node_modules/,
          };
        }
        return rule;
      });

      // Add Module Federation Plugin
      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'salesApp',
          filename: 'remoteEntry.js',
          exposes: {
            './App': './src/AppWrapper',
          },
          shared: {
            react: {
              singleton: true,
              requiredVersion: '^18.0.0',
            },
            'react-dom': {
              singleton: true,
              requiredVersion: '^18.0.0',
            },
            'react-router-dom': {
              singleton: true,
            },
            '@mui/material': {
              singleton: true,
            },
            '@emotion/react': {
              singleton: true,
            },
            '@emotion/styled': {
              singleton: true,
            },
            '@tanstack/react-query': {
              singleton: true,
            },
          },
        })
      );

      webpackConfig.output = {
        ...webpackConfig.output,
        publicPath: 'auto',
      };

      return webpackConfig;
    },
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
