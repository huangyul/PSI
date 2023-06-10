import vue from '@vitejs/plugin-vue'
import path from 'path'
function _resolve(dir) {
  return path.resolve(__dirname, dir)
}
export default {
  base: './',
  plugins: [vue()],
  optimizeDeps: {
    include: ['schart.js'],
  },
  resolve: {
    alias: {
      '@': _resolve('src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: "http://192.168.16.170:5001",
      }
    }
  },
  // server: {
  // 	// host: 'localhost', //target host
  // 	// port: 3000,
  // 	host: 'localhost', //target host
  // 	port: 3000,
  // 	//proxy:{'/api':{}},代理器中设置/api,项目中请求路径为/api的替换为target
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.66.131:8011', //代理地址，这里设置的地址会代替axios中设置的baseURL
  //       changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
  //       //ws: true, // proxy websockets
  //       //pathRewrite方法重写url
  //     },
  //   },
  // },
}
