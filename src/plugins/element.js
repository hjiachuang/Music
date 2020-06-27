import Vue from 'vue'
import { InfiniteScroll, Image, Loading, Progress, Message, MessageBox } from 'element-ui'

Vue.use(InfiniteScroll)
Vue.use(Image)
Vue.use(Loading)
Vue.use(Progress)

Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox