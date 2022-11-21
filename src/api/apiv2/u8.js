import request from '../../utils/request'

// 获取U8失败的数据
export function getU8Data(data) {
  return request({
    url: '/api/StoreCheckout/GetToU8ErrorDatas',
    method: 'get',
    params: data,
  })
}

// 批量同步U8数据
export function U8BatchUpload() {
  return request({
    url: '/api/StoreCheckout/BatchUpload',
    method: 'post',
  })
}
