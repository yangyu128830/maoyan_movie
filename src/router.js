import Vue from 'vue'
import Router from 'vue-router'     // 路由模块
import Hotshow from './views/Hotshow.vue' // 主页
// Vue.use() // 添加模块
Vue.use(Router)

// 单页应用 singer page app (SPA)

export default new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: [ // 路由
      // {
      //     path: '/',
      //     redirect: '/hotshow'
      // },
    {
      path: '/', // 默认渲染主页,/  默认斜杠
      name: 'hotshow', // 命名路由
      component: Hotshow // 访问路由时，渲染的组件
    },
    {
      path: '/release', //
      name: 'release',
      // route level code-splitting
      // this generates a separate chunk(分包) (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // 路由被访问时才加载进来 （路由懒加载）打包时会分离对应的文件
      component: () => import(/* webpackChunkName: "about" */ './views/Release.vue')
    },
    {
        path: '/movie_detail/:movieId',   // 新闻页面
        name: 'movie_detail',
        component: () => import('@/components/MovieDetail.vue')
    },
    {
        path: '/cinemadetail/:cinemaId', // 单个影片详情
        name: 'cinemadetail',
        component: ()=> import('@/components/cinemaDetail.vue')
    },
    {
        path: '/city', // 单个影片详情
        name: 'city',
        component: ()=> import('@/components/city.vue')
    },
    {
      path: '/movies/:movieId', // 
      name: 'movies',
      component: ()=> import('@/components/movies.vue')
    },
    {
      path: '/search', // 
      name: 'search',
      component: ()=> import('@/components/search.vue')
    },
    {

      path: '/concert', // 演唱会专区
      name: 'concert',
      component: ()=> import('@/components/Concert.vue')
    },
    {
      path: '/concert_detail/:concertId', // 演唱会详情
      name: 'concert_detail',
      component: ()=> import('@/components/ConcertDetail.vue')
    },
    {
      path: '/user', // 个人中心
      name: 'user',
      component: ()=> import('@/views/User.vue')
    },
    {
      path: '/vip', // 会员中心
      name: 'vip',
      component: ()=> import('@/views/VipCenter.vue')
    }
  ]
})
