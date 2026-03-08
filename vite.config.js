import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()],
      })
    ],
    base: '/web-app/',
    server: {
      sourcemapIgnoreList: () => true,
      host: '0.0.0.0',
      port: 8080,
      open: true
    },
    build: {
      sourcemap: false,
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
    },
  });
}