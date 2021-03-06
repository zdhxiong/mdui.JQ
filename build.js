const rollup = require('rollup');
const { eslint } = require('rollup-plugin-eslint');
const { uglify } = require('rollup-plugin-uglify');
const buble = require('@rollup/plugin-buble');
const typescript = require('@rollup/plugin-typescript');
const polyfill = require('rollup-plugin-polyfill');
const tsconfig = require('./src/tsconfig.json');
const pkg = require('./package.json');
const serverFactory = require('spa-server');

const arguments = process.argv.splice(2);

delete tsconfig.compilerOptions.declaration;
delete tsconfig.compilerOptions.declarationDir;
delete tsconfig.compilerOptions.outDir;

const banner = `
/*!
 * mdui.jq ${pkg.version} (${pkg.homepage})
 * Copyright 2018-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

const input = './src/index.ts';

const plugins = [
  typescript(Object.assign(
    tsconfig.compilerOptions,
    { include: './src/**/*' }
  )),
];

const outputOptions = {
  strict: true,
  name: 'JQ',
  banner,
};

// 编译成 ES6 模块化文件
async function buildEsm() {
  const bundle = await rollup.rollup({ input, plugins });

  await bundle.write(Object.assign({}, outputOptions, {
    sourcemap: true,
    format: 'es',
    file: './dist/jq.esm.js',
  }));
}

// 编译成 umd 文件
async function buildUmd() {
  plugins.push(
    buble(),
    polyfill([
      'mdn-polyfills/MouseEvent',
      'mdn-polyfills/CustomEvent',
      'promise-polyfill/src/polyfill',
    ]),
  );

  const bundle = await rollup.rollup({ input, plugins });

  await bundle.write(Object.assign({}, outputOptions, {
    sourcemap: true,
    format: 'umd',
    file: './dist/jq.js',
  }));
}

// 编译成 umd 文件，并压缩
async function buildUmdUglify() {
  plugins.push(
    uglify({
      output: {
        preamble: banner,
      }
    })
  );

  const bundle = await rollup.rollup({ input, plugins });

  await bundle.write(Object.assign({}, outputOptions, {
    sourcemap: true,
    format: 'umd',
    file: './dist/jq.min.js',
  }));
}

async function build() {
  await buildEsm();
  await buildUmd();
  await buildUmdUglify();
}

async function test() {
  await rollup.watch({
    input: './test/index.ts',
    output: [{
      strict: true,
      name: 'JQTest',
      format: 'umd',
      file: './test/dist.js',
    }],
    plugins: [
      eslint({
        fix: true,
      }),
      typescript({
        include: './test/**/*',
        module: "ES6",
        target: "ES6"
      }),
      buble(),
      polyfill([
        'mdn-polyfills/MouseEvent',
        'mdn-polyfills/CustomEvent',
        'promise-polyfill/src/polyfill',
      ]),
    ],
    watch: {
      clearScreen: true,
      include: [
        './test/unit/**/*.ts',
        './src/**/*.ts',
      ]
    }
  });

  const server = serverFactory.create({
    path: './',
  });

  server.start();

  console.log(
`打开 http://127.0.0.1:8888/test/jq.html 使用 mdui.jq 开始测试
打开 http://127.0.0.1:8888/test/jquery.html 使用 jquery 开始测试`);
}

if (arguments.indexOf('--build') > -1) {
  build().catch(e => console.log(e));
} else if (arguments.indexOf('--test') > -1) {
  test();
}
