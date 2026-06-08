import {config} from 'dotenv'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'
import {dts} from 'rollup-plugin-dts'

let isProduction = false

if (process.env.NODE_ENV === 'dev') {
  config({path: './.env.dev', override: true})
} else {
  config()
  isProduction = true
}

const plugins = [
  peerDepsExternal(),
  resolve({extensions: ['.ts', '.tsx', '.js', '.jsx']}),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    compilerOptions: {rootDir: '.'}
  }),
  postcss()
]

if (isProduction) plugins.push(terser())

const output = [
  {file: './lib/cjs/index.cjs.js', format: 'cjs', sourcemap: true},
  {file: './lib/esm/index.esm.js', format: 'esm', sourcemap: true}
]

const typesConfig = {
  input: 'src/index.ts',
  output: [{file: 'lib/index.d.ts', format: 'es'}],
  plugins: [dts()]
}

export default [
  {input: 'src/index.ts', output, plugins, external: ['react']},
  typesConfig
]
