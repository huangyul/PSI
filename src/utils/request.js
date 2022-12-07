import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'

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

// 不需要全局loading的接口
const notLoadingUrls = [
  '/api/File/UploadFileNew',
  '/api/Item/ImportItemAndPhoto',
  '/api/Item/UpdateItemUploadInfo',
  '/api/Item/GetItemUploadFileList',
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
    if (!config.baseURL) {
      config.baseURL = await getBaseUrl()
    }
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

    // 统一使用encodeURIComponent处理url参数上的特殊符号
    const rawParmasList = config.url.split('?')[1]
    if (rawParmasList) {
      let rawParmas = config.url.split('?')[1]?.split('&')
      rawParmas.forEach((i, index, arr) => {
        const [key, value] = i.split('=')

        arr[index] = `${key}=${decodeURIComponent(encodeURIComponent(value))}`
        if (value === '+') {
          console.log(i)
        }
      })
      rawParmas = rawParmas.join('&')
      config.url = config.url.split('?')[0] + '?' + rawParmas
    }

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
        message: '登录过期，请重新登录',
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
    } else {
      if (error.response.status == 400) {
        ElMessage.error(error.response.data)
        return Promise.reject()
      } else {
        return Promise.reject(error.response.data.message)
      }
    }
  }
)

export default service
