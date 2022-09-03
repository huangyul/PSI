/* 公用仓库列表 */
import request from '../../utils/request.js'

// 获取仓库列表
export function getWhOrPositionInfo() {
  return request({
    url: '/api/Common/GetWhOrPositionInfo',
  })
}

// 上传文件
export function uploadFile(data) {
  return request({
    url: '/api/File/UploadFile?fileModule=10',
    method: 'post',
    data,
    timeout: 0,
    headers: { 'Content-type': 'multipart/form-data' },
  })
}

// 调拨导入
export function dispatchImport(data) {
  return request({
    url: `/api/StoreCheckout/ImportToTransferOut?shopCode=${localStorage.getItem(
      'shopCode'
    )}`,
    timeout: 0,

    method: 'post',
    data,
  })
}

// 采购订单导入
export function purchaseOrderImport(data) {
  return request({
    url: `/api/PurchaseOrder/ImporteExcelToPurchaseOrder?shopCode=${localStorage.getItem(
      'shopCode'
    )}`,
    timeout: 0,
    method: 'post',
    data,
  })
}

// 采购订单模板导入
export function purchaseTemplateExport(params, data) {
  return request({
    url: '/api/PurchaseOrder/GetPurchaseOrderInfoToExcelImport',
    method: 'post',
    params,
    data,
  })
}

// 下载文件
export function downloadFile(path) {
  return request({
    url: '/api/File/DownloadFile',
    params: {
      filePath: path,
      delete: 1,
    },
    timeout: 0,
    responseType: 'blob',
  })
}
