import axios from '@/libs/api.request'
// 获取角色权限数据
export function getRoleList () {
  return axios.request({
    url: '/role/getRoleList',
    method: 'get'
  })
}
// 创建角色
export function addRole (data) {
  return axios.request({
    url: '/role/addRole',
    method: 'post',
    data
  })
}
// 获取角色数据-不包括菜单权限信息
export function getRoleName () {
  return axios.request({
    url: '/role/getRoleName',
    method: 'get'
  })
}

// 获取前端路由表
export function getMenuRouter () {
  return axios.request({
    url: '/role/getMenuRouter',
    method: 'get'
  })
}
// 删除角色
export function deleteRole (data) {
  return axios.request({
    url: '/role/deleteRole',
    method: 'post',
    data
  })
}
