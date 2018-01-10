import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import butternut from 'rollup-plugin-butternut'

export default {
  input: 'src/index.js',
  output: {
    name: 'inWorker',
    format: 'umd',
    file: 'dist/inWorker.js'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    butternut()
  ]
}
