import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

export default [
    {
        ignores: ['node_modules/**', 'dist/**'],
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
            },
            globals: {
                console: 'readonly',
                require: 'readonly',
                module: 'readonly',
                __dirname: 'readonly',
                Buffer: 'readonly',
                process: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin, // Add TypeScript-specific linting
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
        },
    },
];
