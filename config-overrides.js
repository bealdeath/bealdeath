module.exports = function override(config, env) {
    // Override the Babel configuration
    const babelLoader = config.module.rules.find(
      rule => rule.loader && rule.loader.includes('babel-loader')
    );
    if (babelLoader) {
      babelLoader.options.plugins = [
        ...(babelLoader.options.plugins || []),
        '@babel/plugin-transform-private-property-in-object'
      ];
    }
    return config;
  };
  