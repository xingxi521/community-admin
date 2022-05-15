import Main from '@/components/main'
export default [
  {
    path: '/role',
    name: 'Role',
    meta: {
      icon: 'md-checkbox',
      title: '权限管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'RoleIndex',
        meta: {
          icon: 'md-key',
          title: '角色权限'
        },
        component: () => import('@/view/Role/Role')
      }
    ]
  }
]
