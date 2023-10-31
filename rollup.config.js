import packageJson from './package.json';

import emblaPackageJson from 'embla-carousel/package.json';
import localTypescript from 'typescript';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

const kebabToPascalCase = (string = '') =>
  string.replace(/(^\w|-\w)/g, (replaceString) =>
    replaceString.replace(/-/, '').toUpperCase()
  );

const CONFIG_GLOBALS = {
  [emblaPackageJson.name]: kebabToPascalCase(emblaPackageJson.name),
};

const CONFIG_EXTERNAL_MODULES = {
  moduleDirectories: ['node_modules'],
};

const CONFIG_EXTERNAL_MODULE_SUPPRESS = (warning, next) => {
  if (warning.code === 'INPUT_HOOK_IN_OUTPUT_PLUGIN') return;
  next(warning);
};

const CONFIG_BABEL = {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  exclude: 'node_modules/**',
  babelHelpers: 'bundled',
};

const CONFIG_TYPESCRIPT = {
  tsconfig: 'tsconfig.json',
  typescript: localTypescript,
};

export {
  CONFIG_BABEL,
  CONFIG_TYPESCRIPT,
  CONFIG_GLOBALS,
  CONFIG_EXTERNAL_MODULES,
  CONFIG_EXTERNAL_MODULE_SUPPRESS,
  babel,
  typescript,
  resolve,
  terser,
  kebabToPascalCase,
};

export default [
  {
    input: ['src/index.ts'],
    output: [
      {
        file: `dist/${packageJson.name}.cjs.js`,
        format: 'cjs',
        globals: CONFIG_GLOBALS,
        strict: true,
        sourcemap: true,
        exports: 'auto',
      },
      {
        file: `dist/${packageJson.name}.esm.js`,
        format: 'esm',
        globals: CONFIG_GLOBALS,
        strict: true,
        sourcemap: true,
      },
      {
        file: `dist/${packageJson.name}.umd.js`,
        format: 'umd',
        globals: CONFIG_GLOBALS,
        strict: true,
        sourcemap: false,
        name: kebabToPascalCase(packageJson.name),
        plugins: [terser()],
      },
    ],
    external: Object.keys(CONFIG_GLOBALS),
    plugins: [
      resolve(),
      typescript(CONFIG_TYPESCRIPT),
      babel(CONFIG_BABEL),
      json(),
    ],
  },
];
