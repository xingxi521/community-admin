import { createEnum } from '@/libs/public'
// 用户角色 枚举
export const USER_ROLE = createEnum({
  USER: ['user', '普通户'],
  ADMIN: ['admin', '管理员'],
  SUPER_ADMIN: ['super_admin', '超级管理员']
})
