import path, { dirname } from 'path';
import { InlineConfig, createLogger } from 'vite';
import virtual from 'vite-plugin-virtual';
import scss from 'rollup-plugin-scss';
import image from '@rollup/plugin-image';
import react from '@vitejs/plugin-react';
import getPort from 'get-port';
import { getDevConfig as getDevWebpackConfig } from '../../webpack/configs/dev';
import type { SanitizedConfig } from '../../../config/types';

import { fileURLToPath } from 'url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);
const require = createRequire(import.meta.url);
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const logger = createLogger('warn', { prefix: '[VITE-WARNING]', allowClearScreen: false });
const originalWarning = logger.warn;
logger.warn = (msg, options) => {
  // TODO: fix this? removed these warnings to make debugging easier
  if (msg.includes('Default and named imports from CSS files are deprecated')) return;
  originalWarning(msg, options);
};

const bundlerPath = path.resolve(_dirname, '../bundler');
const relativeAdminPath = path.resolve(_dirname, '../../../admin');

export const getViteConfig = async (payloadConfig: SanitizedConfig): Promise<InlineConfig> => {
  console.log('AAA', virtual)

  const webpackConfig = getDevWebpackConfig(payloadConfig);
  const webpackAliases = webpackConfig?.resolve?.alias || {} as any;
  const hmrPort = await getPort();



  return {
    root: path.resolve(_dirname, '../../../admin'),
    base: payloadConfig.routes.admin,
    customLogger: logger,
    server: {
      middlewareMode: true,
      hmr: {
        port: hmrPort,
      },
    },
    resolve: {
      alias: {
        // Alternative is to remove ~ from the import
        '~payload-user-css': payloadConfig.admin.css,
        '~react-toastify': 'react-toastify',
        ...(webpackAliases || {}),
      },
    },
    define: {
      __dirname: '""',
      'module.hot': 'undefined',
      process: '({argv:[],env:{},cwd:()=>""})',
    },
    plugins: [
      nodePolyfills({
        // To exclude specific polyfills, add them to this list.
      
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
      (virtual?.default || virtual)({
        crypto: 'export default {}',
        https: 'export default {}',
        http: 'export default {}',
      }),
      react(),
      {
        name: 'init-admin-panel',
        transformIndexHtml(html) {
          const indexFile = process.env.PAYLOAD_DEV_MODE === 'true' ? 'index.tsx' : 'index.js';

          if (html.includes(`/${indexFile}`)) return html;

          return html.replace(
            '</body>',
            `<script> var exports = {}; </script></script><script type="module" src="${payloadConfig.routes.admin}/${indexFile}"></script></body>`,
          );
        },
      },
      {
        name: 'shim-bundler-file',
        load(id) {
          if (id.startsWith(bundlerPath)) {
            return 'export default () => { };';
          }
          return null;
        },
      },
    ],

    build: {
      outDir: payloadConfig.admin.buildPath,

      rollupOptions: {
        plugins: [
          image(),
          scss({
            output: path.resolve(payloadConfig.admin.buildPath, 'styles.css'),
            outputStyle: 'compressed',
            include: [`${relativeAdminPath}/**/*.scss`],
          }),
        ],
        treeshake: true,
        input: {
          main: path.resolve(_dirname, relativeAdminPath),
        },
      },
    },
  };
};
