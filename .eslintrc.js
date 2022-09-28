module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    curly: 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'no-bitwise': 'off',
    'no-shadow': 'off',
    'comma-dangle': 'off',
    'react-native/no-inline-styles': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
