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
  console.log(type)
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type,
  })
}
