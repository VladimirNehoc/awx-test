module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.scss$': 'jest-css-modules-transform', // Для обработки стилей
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy', // Исправьте регулярное выражение
  },
};
