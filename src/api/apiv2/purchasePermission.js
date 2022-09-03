import request from '../../utils/request'

export function getPurchasePermissionList(data) {
  return request({
    url: '/api/Role/GetRoleList',
    method: 'get',
    params: data,
  })
}

export function createPurchasePer(data) {
  return request({
    url: '/api/Role/CreateRole',
    method: 'post',
    data,
  })
}

export function updatePurchasePer(data) {
  return request({
    url: '/api/Role/UpdateRole',
    method: 'put',
    data,
  })
}

export function fetchById(data) {
  return request({
    url: '/api/Role/GetRoleByRoleId',
    method: 'get',
    params: data,
  })
}

export function getUserList(data) {
  return request({
    url: '/api/Role/GetOrderUsers',
    method: 'get',
    params: data,
  })
}

export function getPinLeiList(data) {
  return request({
    url: '/api/Role/GetMatTypeList',
    method: 'get',
    params: data,
  })
}

export function deleteItem(data) {
  return request({
    url: '/api/Role/DeleteRole',
    method: 'delete',
    params: data,
  })
}
