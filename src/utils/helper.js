/**
 * 将file类型转为base64
 * @param {File} file
 * @returns
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader1 = new FileReader()
    reader1.readAsDataURL(file)
    reader1.onload = (e) => {
      resolve(e.target.result)
    }
  })
}

/**
 * 将base64转为file
 * @param {String} dataurl
 * @param {String} filename
 * @returns
 */
export const dataURLToFile = (dataurl, filename) => {
  const arr = dataurl.split(',')
  const bstr = window.atob(arr[1])
  const type = arr[0].match(/:(.*?);/)[1]
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type,
  })
}

/**
 * 处理请求的params
 * 1. 所有参数序列化
 * 2. 删掉以前的shopCode参数
 * @param {Object} config axios请求前的config
 */
export const handleParams = (config) => {
  let _config = Object.assign({}, config)
  // 统一使用encodeURIComponent处理url参数上的特殊符号
  const rawParmasList = _config.url.split('?')[1]
  if (rawParmasList) {
    let rawParmas = _config.url.split('?')[1]?.split('&')
    let resParams = []
    for (let i = 0; i < rawParmas.length; i++) {
      const [key, value] = rawParmas[i].split('=')
      // 如果url上有shopcode参数并且取值完全等于localstorage中的值，并且shopcode的个数大于50，则删掉不传
      if (key == 'shopCode') {
        if (
          value === localStorage.getItem('shopCode') &&
          value.split(',').length > 50
        ) {
          continue
        }
        resParams.push(`${key}=${decodeURIComponent(value)}`)
      } else {
        resParams.push(
          `${key}=${encodeURIComponent(decodeURIComponent(value))}`
        )
      }
    }

    resParams = resParams.join('&')
    _config.url = _config.url.split('?')[0] + '?' + resParams
  }
  return _config
}
