/* 机器导入接口 */
import request from '../../utils/request'

export function importMachineFile(data) {
  return request({
    url: '/api/BaseDevice/Import',
    data,
    method: 'post',
  })
}
