// ESLint flat config (ts:LNT-1): typescript-eslint recommendedTypeChecked plus the rules named in the
// TypeScript standard as errors. Generated output is ignored (ts:LNT-3).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'coverage/', 'reports/'] },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ['*.js'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      // The library takes configuration as parameters and never reads the environment (ts:BIB-6, ts:ENV-1).
      'no-restricted-properties': [
        'error',
        { object: 'process', property: 'env', message: 'Take configuration as a parameter instead (ts:BIB-6).' },
      ],
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
