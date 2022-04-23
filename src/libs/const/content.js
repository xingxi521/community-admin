import { createEnum } from '@/libs/public'
// 文章类型 枚举
export const ARTICLE_TYPE = createEnum({
  ASK: ['ask', '提问'],
  SHARE: ['share', '分享'],
  DISSCUSS: ['disscussion', '讨论'],
  SUGGEST: ['suggest', '建议'],
  NOTICE: ['notice', '公告'],
  DYNMATIC: ['dynamic', '动态']
})
// 标签类名枚举
export const TAG_CLASS_NAME = createEnum({
  ORANGE: ['badge-orange', 'badge-orange'],
  RED: ['badge-red', 'badge-red'],
  BLUE: ['badge-blue', 'badge-blue'],
  GREEN: ['badge-green', 'badge-green'],
  GREY: ['badge-grey', 'badge-grey'],
  BLACK: ['badge-black', 'badge-black']
})
