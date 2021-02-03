import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入element的样式
import './plugins/element.js'

//导入iconfont字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式
import './assets/css/global.css'
//第三方插件
import TreeTable from "vue-table-with-tree-grid"
Vue.config.productionTip = false

//axios请求
import axios from "axios"
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1"
Vue.prototype.$http=axios
//请求拦截器
axios.interceptors.request.use(config=>{
  //设置请求头，将token加入到请求头中
  config.headers.Authorization=window.sessionStorage.getItem("vuetoken")
  return config
})

//响应拦截器
axios.interceptors.response.use(res =>{
  if(res.data.meta.msg=="无效token" || res.data.meta.status==401 ){
      location.href="/#/login"
  }
  return res
})

Vue.component("tree-table", TreeTable)

//时间过滤器
Vue.filter("dateFormat", function (originVal) {
  const dt = new Date(originVal)
  const Y = dt.getFullYear
  const M = (dt.getMonth + 1).toString().padStart(2, "0")
  const D = (dt.getDate).toString().padStart(2, "0")
  const hh = (dt.getHours).toString().padStart(2, "0")
  const mm = (dt.getMinutes).toString().padStart(2, "0")
  const ss = (dt.getSeconds).toString().padStart(2, "0")
  return `${Y}-${M}-${D} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')