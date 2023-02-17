module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 12,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['vue', '@typescript-eslint'],
    // extends: ['plugin:vue/vue3-essential', 'plugin:vue/essential', 'eslint:recommended'],
    extends: [
        'eslint:recommended',
        'plugin:vue/base',
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-strongly-recommended',
        'plugin:vue/vue3-recommended',
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.vue'],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
    rules: {
        // http://eslint.cn/docs/rules/
        // https://eslint.vuejs.org/rules/
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        '@typescript-eslint/no-unused-vars': ["warn", { "args": "none" }],
        "@typescript-eslint/no-non-null-assertion": "off",

        'vue/attributes-order': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/html-self-closing': 'off',
        'vue/no-v-html': 'off',
        'vue/comment-directive': 'off',
        'vue/multi-word-component-names': 'off',
        "vue/html-indent": 'off',
        "vue/first-attribute-linebreak": 'off',
        'vue/no-unused-vars': 'warn',
        "vue/mustache-interpolation-spacing": ["off", "always" | "never"],
        "vue/no-side-effects-in-computed-properties": 'off',    //computed改变其他变量的值

        // 'vue/require-default-prop': 'off',
        // 'vue/custom-event-name-casing': 'off',

        'no-useless-escape': 'off',
        'no-sparse-arrays': 'off',
        'no-prototype-builtins': 'off',
        'no-constant-condition': 'off',
        'no-use-before-define': 'off',
        'no-restricted-globals': 'off',
        'no-restricted-syntax': 'off',
        'generator-star-spacing': 'off',
        'no-unreachable': 'off',
        'no-multiple-template-root': 'off',
        // 'no-unused-vars': 'warn',
        // "no-unused-vars": ["warn", { "args": "none" }],
        'no-v-model-argument': 'off',
        'no-case-declarations': 'off',
        'no-console': ["warn", { allow: ["warn", "error"] }],
        "no-empty-function": "off",

    },
};
