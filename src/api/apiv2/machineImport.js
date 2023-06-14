/* 机器导入接口 */
import request from '../../utils/request'

// 导入文件
export function importMachineFile(data, params) {
  return request({
    url: '/api/BaseDevice/Import',
    data,
    params,
    method: 'post',
  })
}


// 获取列表页
export function getList(data) {
  return request({
    url: `/api/BaseDevice/GetImportLog`,
    data,
    method: 'post'
  })
}

// 获取明细
export function getDetail(data) {
  return request({
    url: "/api/BaseDevice/GetImportDevice",
    data,
    method: 'post'
  })
}
