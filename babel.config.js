const config = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        // 不开启 useBuiltIns：避免将 core-js 整包作为本库 dependencies（体积极大）。
        // 语法与目标环境能力由 preset-env 按 targets 转译；运行时代码仅使用 Chrome 49 已具备的内建能力。
        targets: { browsers: ['Chrome >= 49'] },
      },
    ],
    '@babel/typescript',
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-strict-mode',
    '@babel/plugin-transform-parameters',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-json-strings',
    '@babel/plugin-transform-spread',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-transform-arrow-functions',
    'babel-plugin-define-variables',
    // 通过 @babel/runtime 内联 regenerator 与 helpers，不依赖全局 regeneratorRuntime，使用方无需入口垫片。
    ['@babel/plugin-transform-runtime', {
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: false,
    }],
  ],
};

module.exports = process.env.BUILD_ENV === 'es'
  ? {
    presets: [
      '@babel/typescript',
    ],
    plugins: [
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
    ],
  }
  : config;
