import { createEnum } from '@/libs/public'
// 菜单类型 枚举
export const MENU_TYPE = createEnum({
  CATELOG: [0, '目录'],
  SOURCE: [1, '资源'],
  LINK: [2, '链接']
})
