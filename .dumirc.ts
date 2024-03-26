import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'xm-tabs',
  },
  apiParser: {},
  resolve: {
    entryFile: './src/index.ts',
  },
});
