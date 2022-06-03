import axios from '@/libs/api.request'

// 获取文章列表分页数据
export function getArticleList (data) {
  return axios.request({
    url: '/admin/list',
    method: 'post',
    data
  })
}

// 删除文章
export function deletePost (data) {
  return axios.request({
    url: '/admin/delPost',
    method: 'post',
    data
  })
}
// 获取文章详情
export function getPostDetails (params) {
  return axios.request({
    url: '/admin/postDetails',
    method: 'get',
    params
  })
}
// 更新文章详情
export function updatePost (data) {
  return axios.request({
    url: '/admin/editPostManage',
    method: 'post',
    data
  })
}

// 获取标签分页数据
export function getTagList (data) {
  return axios.request({
    url: '/tags/getTagList',
    method: 'post',
    data
  })
}

// 新增、修改标签
export function addTag (data) {
  return axios.request({
    url: '/tags/addTag',
    method: 'post',
    data
  })
}

// 删除标签
export function deleteTag (data) {
  return axios.request({
    url: '/tags/deleteTag',
    method: 'post',
    data
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}

// 获取验证码
export const getCaptcha = (data) => {
  return axios.request({
    url: '/public/getCaptcha',
    method: 'POST',
    data
  })
}
