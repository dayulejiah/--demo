import Vue from 'vue'
import Element, { MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入弹框组件
import { Message } from 'element-ui'
// import Timeline from './timeline/index.js'
// import TimelineItem from './timeline-item/index.js'


Vue.use(Element)
// Vue.use(Timeline)
// Vue.use(TimelineItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
