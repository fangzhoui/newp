<template>
  <div id="app">
    <router-view :user="user"></router-view>
  </div>
</template>

<script>

const ERR_OK = 0;
export default {
	name: 'app',
	data(){
		return {
			user: {},
			userConfig: {}
		}
	},
	created(){
		// this.$router.push({path:'/hello'})
		this.getUserInfo();
	},	
	methods:{
		getUserInfo(){
			this.$http.get('/api/userinfo').then((response) => {
				response = response.body;
				if(response.errno === ERR_OK){
					this.user = response.data;

					if(this.user.FaceUrl == ''){
						this.user.FaceUrl = require('./source/img/avatar.jpg');
						
					}
					if(!this.user.Birthday){
						this.user.Birthday = '-年-月-日';
					}

					if(!this.user.Url){
						this.user.Url = 'b8c56e6f1b3c35c2f4657eb66666666/personPhoto/3d0c542d1133c895ed7a392b0935c006.3';
					}
					if(this.user.page){
						if (this.user.page == 6 && this.user.Pushed == 1) {
							this.$router.push({ path: '/dictionary' });
						} else if (this.user.page == 6){
							this.$router.push({ path: '/card' });
						} else {
							this.$router.push({ path: '/setInfo',query:{page: page}});
						}
					} else {
						this.$router.push({ path: '/setInfo',query:{page: 1}});
					}
					
				}
			})
		},
		androidSetLeft: function(){
			var self = this;
			document.addEventListener('backbutton',function(e){
				e.preventDefault();
				let path = self.$route.path;
				switch(path){
	                case '/setInfo': 
	                	let page = self.$route.query.page;
	                	if (page == 1) {
	                		dd.biz.navigation.close({});
	                	} else {
	                		page--;
	                		self.$router.push({path: '/setInfo',query:{page: page}});
	                	}
	                    break;  
	                case '/card':
		                let back = self.$route.query.back;
	                	if (back) {
							self.$router.push({path: '/dictionary', query:{title: '乐新人', part: 'dictionary'}});
						} else {
							dd.biz.navigation.close({});
						}
	                    break;  
	                case '/changemsg':
	                	let hobby = self.$route.query.hobby;
	                    if (hobby) {
							self.$router.push({ path: '/changemsg',query:{hobby: false, back: true}})
						} else {
							self.$router.push({ path: '/card', query:{back: true}});
						}
	                    break;
	                case '/dictionary':
	                	dd.biz.navigation.close({});
	                	break;
	                case '/dictionary/module':
	                	self.$router.push({path: '/dictionary', query: {title: '乐新人'}});
	                	break;
	                case '/dictionary/module/content': 
	                	self.$router.push({path: '/dictionary/module', query: {title: self.$route.query.oldTitle, part: 'module'}});
	                	break;
	                case '/dictionary/examination':
	                	self.$router.push({path: '/dictionary', query:{part: 'dictionary', title: '乐新人'}});
	                	break;
	                case '/dictionary/submitPage':
	                	self.$router.push({path: '/dictionary', query: {isTest: true, part: 'dictionary', title: '乐新人'}});
	                	break;
	                case '/dictionary/submitPage/examinationSubmit':
	                	self.$router.push({path: '/dictionary/submitPage', query: {part: 'submitPage'}});
	                	break;
	            }
			});
		},
	}
}
</script>

<style>
#app {
	width: 100%;
	height: 100%;
}
</style>
