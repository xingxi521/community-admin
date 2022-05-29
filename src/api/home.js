import axios from '@/libs/api.request'

// 获取首页统计数据
export function getStatistics () {
  return axios.request({
    url: '/home/getStatistics',
    method: 'get'
  })
}
