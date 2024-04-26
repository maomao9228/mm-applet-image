import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false




Vue.config.productionTip = false
App.mpType = 'app'


// 页面停留时长采集控制
Vue.prototype.$collectTime = false;


const app = new Vue({
	...App
})
app.$mount()
