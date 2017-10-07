// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import VueResource from 'vue-resource'
import './common/css/base.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)

import clipper from '@/utils/clipper.js'
Vue.use(clipper);

import jsapiauth from '@/utils/jsapiauth.js'

Vue.use(jsapiauth);

Vue.config.productionTip = false;
Vue.use(VueResource);



/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: {
		App
	}
})