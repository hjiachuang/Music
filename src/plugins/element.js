import Vue from 'vue'
import { InfiniteScroll, Image, Loading, Progress, MessageBox } from 'element-ui'

Vue.use(InfiniteScroll)
Vue.use(Image)
Vue.use(Loading)
Vue.use(Progress)
Vue.prototype.$mesbox = MessageBox