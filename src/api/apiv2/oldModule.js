/* 旧模块新加的接口 */
import request from '../../utils/request.js'

export function getModifyCancelStock(data) {
  return request({
    url: '/api/CancelStock/GetModifyCancelStock',
    method: 'get',
    params: data,
  })
}

// 更新退库信息
export function updateCancelStockInfo(params, data) {
  return request({
    url: '/api/CancelStock/UpdateCancelStockInfo',
    method: 'put',
    params,
    data,
  })
}

// 外拨调拨-撤销
export function revokeDispatch(data) {
  return request({
    url: '/api/StoreCheckout/TransferBack',
    method: 'post',
    data,
  })
}
