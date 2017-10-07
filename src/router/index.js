import Vue from 'vue'
import Router from 'vue-router'
import setInfo from '../components/setInfo'
import card from '../components/card'
import changemsg from '../components/changemsg'
import dictionary from '../components/dictionaryHomePage'
import module from '../components/dictionaryModule'
import content from '../components/dictionaryContent'
import examination from '../components/dictionaryExamination'
import submitPage from '../components/submitPage'
import examinationSubmit from '../components/dictionaryExaminationSubmit'
import hello from '../components/Hello'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/hello',
		name: 'hello',
		component: hello
	}, {
		path: '/setInfo',
		name: 'setInfo',
		component: setInfo
	}, {
		path: '/card',
		name: 'card',
		component: card
	}, {
		path: '/changemsg',
		name: 'changemsg',
		component: changemsg
	}, {
		path: '/dictionary',
		name: 'dictionary',
		component: dictionary,
		children: [{
			path: '/dictionary/module',
			name: 'dictionaryModule',
			component: module,
			children: [{
				path: '/dictionary/module/content',
				name: 'dictionaryContent',
				component: content
			}]
		}, {
			path: '/dictionary/examination',
			name: 'examination',
			component: examination
		}, {
			path: '/dictionary/submitPage',
			name: 'submitPage',
			component: submitPage,
			children: [{
				path: '/dictionary/submitPage/examinationSubmit',
				name: 'examinationSubmit',
				component: examinationSubmit
			}]
		}]
	}]
})