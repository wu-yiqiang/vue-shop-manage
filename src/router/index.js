import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from "../components/Home.vue"
Vue.use(VueRouter)

import Welcome from "../components/Welcome.vue"
const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/home',component: Home,redirect: "/welcome",children:[
    {path:'/welcome',component:Welcome}
    ]},
]

const router = new VueRouter({
  routes
})


//注册路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path==="/login") return next()
  const token=window.sessionStorage.getItem("vuetoken")
  if(!token) return next("/login")
  next()
})
export default router
