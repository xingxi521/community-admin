import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'view-design'
import { setToken, getToken, setTitle } from '@/libs/util'
import { getMenuRouter } from '@/api/role'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
export const router = new Router({
  routes,
  mode: 'hash'
})
const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    const hasPermission = store.state.app.permission && store.state.app.permission.length > 0
    if (hasPermission) {
      next()
    } else {
      getPermission(next, to, from)
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

function getPermission(next, to, from) {
  getMenuRouter().then((response) => {
    if (response.data && response.data.length > 0) {
      store.dispatch('user/getUserInfo').then(async user => {
        const accessRoutes = await store.dispatch('app/generateRoutes', response.data)
        accessRoutes.forEach(item => {
          router.addRoute(item.name, item)
        })
        next({ ...to, replace: true })
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    } else {
      // 权限为空，跳到404，并清除掉token
      next({ path: '/404' })
      localStorage.removeItem('permissionList')
      setToken('')
      // router.push('/login')
    }
  }).catch(_ => {
    iView.LoadingBar.finish()
  })
}
export function resetRouter() {
  const newRouter = new Router({
    routes,
    mode: 'hash'
  })
  router.matcher = newRouter.matcher // reset router
}
