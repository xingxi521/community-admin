import axios from '@/libs/api.request'
// 登录接口
export const login = (data) => {
  return axios.request({
    url: '/login/login',
    data,
    method: 'post'
  })
}

// 获取用户列表
export const getUserList = (data) => {
  return axios.request({
    url: '/user/getUserList',
    data,
    method: 'post'
  })
}

// 新增用户
export const createUser = (data) => {
  return axios.request({
    url: '/user/createUser',
    data,
    method: 'post'
  })
}

// 新增用户
export const updateUser = (data) => {
  return axios.request({
    url: '/user/updateUser',
    data,
    method: 'post'
  })
}
// 删除用户
export const deleteUser = (data) => {
  return axios.request({
    url: '/user/deleteUser',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: '/user/getUserInfo',
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
