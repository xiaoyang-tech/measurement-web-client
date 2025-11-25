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
    optimizeDeps: {
      include: ['protobufjs'], // 确保 protobuf 相关库被正确处理
    },
    base: '/web-app/',
    server: {
      sourcemapIgnoreList: () => true, // 忽略所有 Source Map 请求
      host: '0.0.0.0',
      port: 8080,
      open: true
    },
    build: {
      sourcemap: false,
      // 生产环境配置
      assetsInlineLimit: 0, // 禁止内联 WASM 文件
      rollupOptions: {
        output: {
          // 手动指定 WASM 文件路径（如果插件需要）
          assetFileNames: (assetInfo) => {
            if (assetInfo && assetInfo.name && assetInfo.name.endsWith('.wasm')) {
              return 'assets/[name].[hash][extname]';
            }
            // 对于其它静态资源，始终返回一个有效的命名模式，避免 Rollup 读取 undefined
            return 'assets/[name].[hash][extname]';
          },
        },
      },
    },
  });
}