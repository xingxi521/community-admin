import axios from '@/libs/api.request'

// 获取评论列表数据
export function getCommentList (data) {
  return axios.request({
    url: '/admin/getCommentList',
    method: 'post',
    data
  })
}
// 修改评论
export function updateComment (data) {
  return axios.request({
    url: '/admin/updateComment',
    method: 'post',
    data
  })
}
// 修改评论
export function deleteComment (data) {
  return axios.request({
    url: '/admin/deleteComment',
    method: 'post',
    data
  })
}

