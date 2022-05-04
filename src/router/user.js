import Main from '@/components/main'
export default [
  {
    path: '/user',
    name: 'User',
    meta: {
      icon: 'ios-people',
      title: '用户相关'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'UserIndex',
        meta: {
          icon: 'ios-people',
          title: '用户管理'
        },
        component: () => import('@/view/User/User')
      }
    ]
  }
]
