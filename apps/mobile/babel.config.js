module.exports = function (api) {
  const isTest = api.env('test');

  const plugins = [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        root: ['./'],
        alias: {
          '@': './src'
        }
      }
    ]
  ];

  if (!isTest) {
    plugins.push('react-native-reanimated/plugin');
  }

  return {
    presets: ['babel-preset-expo'],
    plugins
  };
};
