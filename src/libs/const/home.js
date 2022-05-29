import { createEnum } from '@/libs/public'
// 近7天series字段 枚举
export const SERIES = createEnum({
  WEEK_COMMENT: ['weekComment', '回复总数'],
  WEEK_USER: ['weekUser', '新增用户'],
  WEEK_SIGN: ['weekSign', '签到总数'],
  WEEK_POST: ['weekPost', '发帖总数']
})
