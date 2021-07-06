module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'max-len': [2, {code: 110, tabWidth: 2, ignoreUrls: true}],
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'react/display-name': 'off',
    'no-console': 'off',
    'react/prop-types': 'off',
    'import/no-unresolved': 'off',
    'prettier/prettier': 'off',
    'react/jsx-filename-extension': [
      1,
      {extensions: ['.js', '.jsx', '.ts', '.tsx']},
    ],
    'object-curly-newline': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'no-use-before-define': 'off',
    'arrow-parens': 'off',
  },
};
