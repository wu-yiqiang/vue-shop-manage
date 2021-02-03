import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from "../components/Home.vue"
//权限组件
import Rights from "../components/power/Rights.vue"
//角色组件
import Roles from "../components/power/Roles.vue"
import Welcome from "../components/Welcome.vue"
import Users from "../components/user/Users.vue"

//商品分类组件
import Cate from "../components/goods/Cate.vue"
//商品分类参数
import Params from "../components/goods/Params.vue"   
//商品列表模块
import Lists from "../components/goods/Lists.vue" 
//添加商品
import AddGoods from "../components/goods/Add.vue"
Vue.use(VueRouter)
const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/home',component: Home,redirect: "/welcome",children:[
      {path:'/welcome',component:Welcome},
      {path:"/users",component: Users},
      {path:"/rights",component: Rights},
      { path: "/roles", component: Roles },
      { path: "/categories", component: Cate },
      { path: "/params", component: Params },
    { path: "/goods", component: Lists },
    {path:"/goods/add",component:AddGoods},
      
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
