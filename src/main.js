import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
// import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入全局样式表
import './assets/css/global.css'
// import TreeTable from 'vue-table-with-tree-grid'
// 导入字体图标
// import './assets/fonts/iconfont.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)
Vue.use(ElementUI);



import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

// 通过axios请求拦截器添加token，保证获取数据的权限（后台服务器根路径）
axios.interceptors.request.use(config => {
  // console.log(config);
  // let token = window.sessionStorage.getItem('token');
  // config.headers.Authorization =token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须添加retrun config
  return config
})
Vue.prototype.$http = axios;

Vue.config.productionTip = false
// Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
