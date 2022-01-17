import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // 商品路由
  {
    path: '/goods',
    component: Layout,
    children: [{
      path: '',
      name: 'Goods',
      component: () => import('@/views/goods/index'),
      meta: { title: '商品', icon: 'el-icon-s-shop' }
    }]
  },
  // 用户路由
  {
    path: '/user',
    component: Layout,
    name: 'User',
    redirect: '/user/admin/index',
    meta: { title: '用户', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'admin/index',
        name: 'Admin',
        component: () => import('@/views/user/admin/index'),
        meta: { title: '管理员' }
      },
      {
        path: 'wxuser/index',
        name: 'Wxuser',
        component: () => import('@/views/user/wxuser/index'),
        meta: { title: '微信用户' }
      }
    ]
  },

  // 轮播图路由
  {
    path: '/slider',
    component: Layout,
    children: [{
      path: '',
      name: 'Slider',
      component: () => import('@/views/slider/index'),
      meta: { title: '轮播图', icon: 'el-icon-picture' }
    }]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
