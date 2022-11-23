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
export function downloadFile(path, isDelete = 1) {
  return request({
    url: '/api/File/DownloadFile',
    params: {
      filePath: path,
      delete: isDelete,
    },
    timeout: 0,
    responseType: 'blob',
  })
}

/* 批量导入相关接口-十二期需求 */

/**
 * 上次文件
 * @param {number} importType 上次文件类型 1-商品信息  2-采购计划信息  3-采购订单信息  4-外部调拨
 * @param {*} fileList 文件集，包含数据文件及图片压缩包 数据文件不能为空
 * @returns
 */
export function uploadFileNew(importType, fileList) {
  return request({
    url: 'api/File/UploadFileNew',
    method: 'post',
    params: {
      userCode: localStorage.getItem('UserCode'),
      userName: localStorage.getItem('ms_username'),
      importType,
    },
    timeout: 0,
    headers: { 'Content-type': 'multipart/form-data' },
    data: fileList,
  })
}

/**
 * 处理上传的文件，此接口不需要等待
 * @returns
 */
export function dealUploadFile() {
  return request({
    url: '/api/Item/ImportItemAndPhoto',
    method: 'post',
    params: {
      userCode: localStorage.getItem('UserCode'),
      userName: localStorage.getItem('ms_username'),
      orgId: localStorage.getItem('orgId'),
    },
  })
}
