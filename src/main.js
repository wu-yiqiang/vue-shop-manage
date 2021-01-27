import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入element的样式
import './plugins/element.js'

//导入iconfont字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')