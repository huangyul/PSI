/* 异步导出任务相关接口 */
import request from '../../utils/request.js'

// 获取任务列表数据
export function getTaskList(data) {
  return request({
    url: '/api/Item/GetItemUploadFileList',
    method: 'get',
    params: data,
  })
}

// 获取任务列表详情
export function getTaskDetail(data) {
  return request({
    url: '/api/Item/GetItemUploadInfo',
    method: 'get',
    params: data,
  })
}

// 更新任务状态（是否已读）
export function updateTaskStatus(data) {
  return request({
    url: '/api/Item/UpdateItemUploadInfo',
    method: 'put',
    params: data,
  })
}
