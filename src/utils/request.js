import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { handleParams } from './helper'
import router from '../router'

// 获取baseUrl
const getBaseUrl = () => {
  return new Promise(async (resolve) => {
    let baseURL = localStorage.getItem('apiUrl')
    if (!baseURL) {
      const res = await axios.get('./table.json')
      localStorage.setItem('apiUrl', res.data.apiUrl)
      baseURL = res.data.apiUrl
      resolve(baseURL)
    }
    resolve(baseURL)
  })
}

const reLogin = () => {
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
          ElMessage.warning({ message: err, type: 'warning' })
        })
    }
  }, 3000)
}

// 不需要全局loading的接口
const notLoadingUrls = [
  '/api/File/UploadFileNew',
  '/api/Item/ImportItemAndPhoto',
  '/api/Item/UpdateItemUploadInfo',
  '/api/Item/GetItemUploadFileList',
  '/api/BaseDevice/Import'
]
const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
  baseURL: '',
  method: 'get',
  timeout: 0,
})
let loading = null

service.interceptors.request.use(
  async (config) => {
    // if (!config.baseURL) {
    //   config.baseURL = await getBaseUrl()
    // }
    if (!notLoadingUrls.includes(config.url)) {
      loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }

    //var url1 = 'http://192.168.66.131:8055/api/UserLoginInfo/CreateUserLogin?userCode='+'10001'+'&userType='+1;
    //var url1 = '/api/UserLoginInfo/CreateUserLogin?userCode=' + '10001' + '&userType=' + 1;
    // 历史遗留
    var url1 = localStorage.getItem('url1')
    var url2 = localStorage.getItem('url2')
    if (config.url === url1 || config.url === url2) {
      //如果是登录和注册操作，则不需要携带header里面的token
      //console.log('不用验证');
    } else {
      if (localStorage.getItem('Token')) {
        config.headers.Authorization = localStorage.getItem('Token')
      }
    }

    /**
     * 1. 处理params参数，将所有参数序列化
     * 2. 去掉params中的shopCode参数
     */
    config = handleParams(config)

    return config
  },
  (error) => {
    console.log(error)
    if (loading) {
      loading.close()
    }
    return Promise.reject()
  }
)

service.interceptors.response.use(
  (response) => {
    if (loading) {
      loading.close()
    }
    if (response.status === 200) {
      return response.data
    } else {
      Promise.reject()
    }
  },
  (error) => {
    if (loading) {
      loading.close()
    }
    const { response } = error
    if (!error.response) {
      ElMessage({
        message: response.data.Msg,
        type: 'error',
      })
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
              ElMessage.warning({ message: err, type: 'warning' })
            })
        }
      }, 3000)
    } else if (response.status == 401) {
      ElMessage({
        message: '登录已过期，请重新登录',
        type: 'error',
      })
      reLogin()
    } else if (response.status == 400) {
      ElMessage({
        message: response.data.message,
        type: 'error',
      })
      return Promise.reject(error.response.data.message)
    } else if(response.status == 413) {
      return Promise.reject('导入文件过大')
    }
     else {
      return Promise.reject(response.data.message)
    }
  }
)

export default service
