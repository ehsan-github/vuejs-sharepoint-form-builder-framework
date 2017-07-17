// http://eslint.org/docs/user-guide/configuring

/* eslint-disable no-undef */
module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        browser: true
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: [
        'eslint:recommended',
        'plugin:flowtype/recommended',
        'plugin:vue/recommended'
    ],
    // required to lint *.vue files
    plugins: [
        'html',
        'flowtype'
    ],
    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        'indent': ['error', 4],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        'object-curly-spacing': ['error', 'always'],
        quotes: ['error', 'single']
    }
}
