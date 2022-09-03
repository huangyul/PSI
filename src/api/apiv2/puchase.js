/* 采购相关接口 */
import request from '../../utils/request'

// 获取采购退货列表
export function getPurchaseReturnList(params, data) {
  return request({
    url: '/api/Report/GetPurchaseReturnPrint',
    data,
    params,
    method: 'post',
  })
}

// 获取品类列表
export function getMatType() {
  return request({
    url: '/api/MatType/GetMatType',
    params: {
      name: '',
      matType: '',
      shopCode: localStorage.getItem('shopCode'),
      userType: localStorage.getItem('userType'),
      page: 1,
      pageSize: 100000,
    },
  })
}

// 导出excel
export function exportExcel(params, data) {
  return request({
    url: '/api/Report/GetPurchaseReturnPrintToExcel',
    data,
    timeout: 0,
    params,
    method: 'post',
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

// 获取供应商列表
export function getSupplierList() {
  return request({
    url: '/api/PurchaseOrder/GetSupplierListByUserCode',
    params: {
      userCode: localStorage.getItem('UserCode'),
    },
  })
}

// 根据供应商获取商品列表
export function getProductBySupplier(data) {
  return request({
    url: '/api/PurchasePlan/GetPurchasePlans',
    method: 'post',
    data,
  })
}

// 采购订单删除
export function deletePruchase(data) {
  return request({
    url: '/api/PurchaseOrder/DeletePurchaseOrderInfo',
    method: 'delete',
    params: data,
  })
}

// 调拨下单前判断
export function commitIsOrderStatus(data) {
  return request({
    url: '/api/PurchaseOrder/CommitIsOrderStatus',
    method: 'post',
    data: data,
  })
}

// 获取待调拨单的数据
export function getTransferProductInfo(params, data) {
  return request({
    url: '/api/PurchaseOrder/GetTransferProductInfo',
    method: 'post',
    params,
    data,
  })
}

// 保存下拨单
export function saveTransferOrder(params, data) {
  return request({
    url: '/api/PurchaseOrder/SaveTransferOrder',
    method: 'post',
    params,
    data,
  })
}
