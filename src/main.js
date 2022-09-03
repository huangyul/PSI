import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import './assets/css/icon.css'

import axios from 'axios'
import print from 'vue3-print-nb'
const app = createApp(App)

// 统一注册elment icon组件，参考文档：https://element-plus.org/zh-CN/component/icon.html
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// app.config.globalProperties.$axios = axios
// 混入表格间隔颜色
app.mixin({
  methods: {
    funcRowClassName({ row, rowIndex }) {
      let className = ''
      if (rowIndex % 2 == 1) {
        className += 'double-row'
      }
      return className
    },
  },
})
installElementPlus(app)
app.use(print)
app.use(store).use(router).mount('#app')

//异步请求前在header里加入token
axios.interceptors.request.use(
  (config) => {
    //var url1 = 'http://192.168.66.131:8055/api/UserLoginInfo/CreateUserLogin?userCode='+'10001'+'&userType='+1;
    //var url1 = '/api/UserLoginInfo/CreateUserLogin?userCode=' + '10001' + '&userType=' + 1;
    var url1 = localStorage.getItem('url1')
    var url2 = localStorage.getItem('url2')
    if (config.url === url1 || config.url === url2) {
      //如果是登录和注册操作，则不需要携带header里面的token
    } else {
      if (localStorage.getItem('Token')) {
        config.headers.Authorization = localStorage.getItem('Token')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
//异步请求后，判断token是否过期
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (!error.response) {
      // ElMessage({
      //   message: '登录过期，请重新登录',
      //   type: 'error',
      // })
      setTimeout(function () {
        if (localStorage.getItem('userType') == '3') {
          router.push('/login')
        } else {
          var url = './table.json'
          axios
            .get(url)
            .then((res) => {
              window.location.href = 'http://' + res.data.yunhoutaiUrl
              window.localStorage.clear() //清除所有key
            })
            .catch((err) => {
              // ElMessage.warning({ message: err, type: 'warning' })
            })
        }
      }, 3000)
      // return Promise.reject('登录过期，请重新登录')
      return Promise.reject('VPN或网络异常，请尝试重连VPN或检查网络设置哦')
      // if (localStorage.getItem("userType") == '3') {
      // 	router.push("/login");
      // } else {
      // 	var url = './table.json'
      // 	axios.get(url).then((res) => {
      // 		window.location.href = 'http://' + res.data.yunhoutaiUrl;
      // 		window.localStorage.clear();
      // 	}).catch((err) => {
      // 		ElMessage.warning({ message: err, type: 'warning', });
      // 	});
      // }
      return Promise.reject('网络不稳定，导致请求超时，请重新登录！')
    } else {
      if (!error.response.data) {
        return Promise.reject('处理过程超时，请稍后重试')
      }
      return Promise.reject(error.response.data.message)
    }

    // if (error.response.status === 401) {
    // 	router.push("/login");
    // 	return Promise.reject('身份验证已过期，请重新登录');
    // }else{
    // 	return Promise.reject(error.response.data.message);
    // }
  }
)

app.config.globalProperties.$axios = axios

//异步请求前判断请求的连接是否需要token
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next()
  } else {
    if (
      localStorage.getItem('userType') == '3' &&
      !localStorage.getItem('Token') &&
      to.name != 'Login'
    ) {
      ElMessage.warning('VPN或网络异常，请尝试重连VPN或检查网络设置哦')
      router.push('/login')
      return
    }
    //云后台登录的情况
    if (
      localStorage.getItem('permissions') &&
      localStorage.getItem('userType') != '3' &&
      to.name != 'Login' &&
      to.name != 'dashboard' &&
      to.name != 'AddCommodityManagement' &&
      to.name != 'UpdateCommodityManagement' &&
      to.name != 'AddSupplierManagement' &&
      to.name != 'UpdateSupplierManagement'
    ) {
      var permissions = JSON.parse(localStorage.getItem('permissions'))
      var isRight = false
      for (var item of permissions) {
        if (to.name == item.ModuleUrl) {
          isRight = true
        }
      }
      if (!isRight) {
        ElMessage.warning('你没有权限进入此页面')
        return
      }
    }

    //根据权限截停仓位
    if (
      localStorage.getItem('isShowPosition') == '0' &&
      to.name == 'PositionsManagement'
    ) {
      ElMessage.warning('你没有权限进入此页面')
      return
    }

    //供应商登录的情况
    if (
      localStorage.getItem('userType') == '3' &&
      to.name != 'Login' &&
      to.name != 'dashboard' &&
      to.name != 'DeliveryView' &&
      to.name != 'DeliveryDetail' &&
      to.name != 'Statements'
    ) {
      ElMessage.warning('你没有权限进入此页面')
      return
    }

    next()
    if (to.path === '/login') {
      return
    }
    let Expires = localStorage.getItem('Expires')
    Expires = parseInt(Expires)
    let nowTime = new Date().getTime()
    if (nowTime >= Expires) {
      ElMessage.warning('身份验证已过期，请重新登录')

      setTimeout(function () {
        if (localStorage.getItem('userType') == '3') {
          router.push('/login')
        } else {
          var url = './table.json'
          axios.get(url).then((res) => {
            window.location.href = 'http://' + res.data.yunhoutaiUrl
            window.localStorage.clear() //清除所有key
          })
        }
      }, 3000)

      return
    }
  }
})
