import axios from '@/libs/api.request'
// 获取菜单
export function getMenu (ata) {
  return axios.request({
    url: '/menu/getMenu',
    method: 'get'
  })
}
// 新增菜单
export function addMenu (data) {
  return axios.request({
    url: '/menu/addMenu',
    method: 'post',
    data
  })
}
// 修改菜单
export function updateMenu (data) {
  return axios.request({
    url: '/menu/updateMenu',
    method: 'post',
    data
  })
}
// 删除菜单
export function deleteMenu (params) {
  return axios.request({
    url: '/menu/deleteMenu',
    method: 'get',
    params
  })
}
