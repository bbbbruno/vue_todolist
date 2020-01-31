module.exports = {
  root: true,
  env: {
    node: true
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['vue'],
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'prettier',
    'prettier/vue'
  ]
};