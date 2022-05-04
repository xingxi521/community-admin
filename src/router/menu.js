import Main from '@/components/main'
export default [
  {
    path: '/menu',
    name: 'Menu',
    meta: {
      icon: 'md-settings',
      title: '菜单配置'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'MenuIndex',
        meta: {
          icon: 'ios-menu',
          title: '菜单管理'
        },
        component: () => import('@/view/Menu/Menu')
      }
    ]
  }
]
