import Main from '@/components/main'
export default [
  {
    path: '/content',
    name: 'Content',
    meta: {
      icon: 'md-albums',
      title: '内容管理'
    },
    component: Main,
    children: [
      {
        path: 'postmanagement',
        name: 'PostManagement',
        meta: {
          icon: 'ios-paper',
          title: '文章管理'
        },
        component: () => import('@/view/Content/Content')
      },
      {
        path: 'postdetails/:tid',
        name: 'PostDetails',
        props: true,
        meta: {
          icon: 'ios-paper',
          hideInMenu: true,
          title: route => `{{ PostDetails }}-${route.query.title}`
        },
        component: () => import('@/view/Content/PostDetails')
      },
      {
        path: 'tgamanagement',
        name: 'TagManagement',
        meta: {
          icon: 'md-pricetags',
          title: '标签管理'
        },
        component: () => import('@/view/Content/TagMangement')
      }
    ]
  }
]
