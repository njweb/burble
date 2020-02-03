import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const isProduction = process.env.NODE_ENV === 'production'

const output = {
  format: 'iife',
  sourcemap: isProduction ? null : true,
};

const plugins = [
  commonjs({ include: 'node_modules/**' }),
  resolve(),
  babel({ exclude: 'node_modules/**' }),
];

export default [{
  input: 'src/burble.js',
  output: {
    file: 'dist/burble.esm.js',
    format: 'esm'
  },
  plugins,
}, {
  input: 'src/burble.umd.js',
  output: {
    file: 'dist/burble.min.js',
    name: 'burble',
    format: 'umd'
  },
  plugins: [
    ...plugins,
    terser(),
  ],
}];

