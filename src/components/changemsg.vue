<template>
<div class="changemsg">
	<div class="avatar fontSize_14">
		<div class="wrap">
			<div class="title">自拍照</div>
			<div class="avatar_wrap">
				<img :src="user.Url" width="100%" height="100%" id="img" ref='upload'>
			</div>
			<input type="file" accept="image/png,image/jpg,image/jpeg" id="upfile" class="upfile" @change="change($event)" style="visibility: hidden; position: absolute;">
			<label class="labelupfile" for="upfile"></label>
		</div>
	</div>
	<div class="name fontSize_14">
		<div class="wrap">
			<div class="title">姓名</div>
			<div class="text">
				{{user.EmployeeName}}
			</div>
		</div>
	</div>
	<div class="item fontSize_14">
		<div class="wrap">
			<div class="title">性别</div>
			<div class="text" @click="changeSex">
				{{sex}}<span class="icon"></span>
			</div>
		</div>
	</div>
	<div class="item fontSize_14">
		<div class="wrap">
			<div class="title">生日</div>
			<div class="text" @click="changeBir">
				{{user.Birthday}}<span class="icon"></span>
			</div>
		</div>
	</div>
	<div class="item fontSize_14">
		<div class="wrap">
			<div class="title">职位</div>
			<div class="text" @click="changePost">
				<input class="post" type="text" v-model="user.Post"><span class="icon"></span>
			</div>
		</div>
	</div>
	<div class="item fontSize_14">
		<div class="wrap">
			<div class="title">家乡</div>
			<div class="text" @click="changeCity">
				{{user.Province}}<span v-show="user.Province!=user.City"> {{user.City}}</span><span class="icon"></span>
			</div>
		</div>
	</div>
	<div class="item fontSize_14" @click="changeHobby">
		<div class="wrap">
			<div class="title">兴趣爱好</div>
			<div class="text">
				<span class="label" v-for="item in user.hobbies">{{item.Name}}</span><span class="icon"></span>
			</div>
		</div>
	</div>
	<div class="content fontSize_14">
		<div class="title">个人描述</div>
		<textarea class="desc_geren fontSize_14" v-model="user.Description" rows="5" maxlength="95">
			{{user.Description}}
		</textarea>
	</div>
	<div class="changeLabel" v-show="hobbyRouterDisplay">
		<v-newpeople :chooseLabel='chooseLabel' ref="chooseLabel"></v-newpeople>
		<div class="next">
			<div class="btn" @click="changedLabel">完成</div>
		</div>
	</div>
</div>
</template>

<script>
import newpeople from './hobby_select';
import Exif from 'exif-js';
export default {
	name: 'changemsg',
	data () {
		return {
			user: {},
			sex:'',
			chooseLabel: [],
			hobbyRouterDisplay: false,
			pro: []
		}
	},
	watch: {
        "$route": "load",
    },
	created(){
		this.$http.get('/newtask/userinfo').then((response) => {
			response = response.data;
			this.user = response;
			console.log(this.user)
			if(!this.user.FaceUrl){
				this.user.FaceUrl = require('../source/img/im_uap.svg')
			}
			if(this.user.Sex == 0){
				this.sex = '女'
			}
			if(this.user.Sex == 1){
				this.sex = '男'
			}
			this.chooseLabel = this.user.hobbies;
			this.$refs.chooseLabel.load();
		})
		this.$http.get('/newtask/provinceList').then((response) => {
			response = response.body
			this.pro = response.list
			this.pro.forEach((item) => {
				let o = item
				for(var key in o){
					if(key === 'ProvinceId'){
						o['value'] = o['ProvinceId']
						delete(o[key])
					}
					if(key === 'ProvinceName'){
						o['key'] = o['ProvinceName']
						delete(o[key])
					}
				}
			})
		})
		this.load();
	},
	methods:{
		load: function(){
            this.hobbyRouterDisplay = this.$route.query.hobby || false;
            this.setLeft();
            this.setRight();
        },
		setLeft(){
			var self = this;
			dd.biz.navigation.setLeft({
				show: true,
				control: true,
				showIcon: true,
				text: '返回',
				onSuccess : function(result) {
					if (self.hobbyRouterDisplay) {
						self.$router.push({ path: '/changemsg', query:{hobby: false}})
					} else {
						self.$router.push({ path: '/card', query: {back: true}})
					}
				},
				onFail : function(err) {}
			});
		},
		setRight(){
			let _self = this;
			let state = this.hobbyRouterDisplay;
			dd.biz.navigation.setRight({
				show: !state,
				control: true,
				text: '完成',
				onSuccess : function(result) {
					let desc = _self.user.Description.toString();
					let post = _self.user.Post.toString();
					_self.$http.post('/newtask/infoSetting', {description: desc, post: post}, {emulateJSON: true}).then((response) => {});
				    _self.$router.push({ path: '/card', query: {back: true}})
				},
				onFail : function(err) {}
			});			
		},
		changeSex(){
			let _self = this
			dd.biz.util.chosen({
			    source: [{
						key: '男', //显示文本
						value: '1' //值，
					},{
						key: '女',
						value: '0'
					}],
			   	onSuccess : function(result) {
			    	_self.sex = result.key
			    	let sex = result.value
			    	_self.$http.post('/newtask/infoSetting',{sex: sex},{emulateJSON: true}).then((response) => {
					})
			    },
			   onFail : function(err) {}
			})
		},
		changeBir(){
			let _self = this
			let data = this.user.Birthday
			dd.biz.util.datepicker({
			    format: 'yyyy-MM-dd',
			    value: data, //默认显示日期
			    onSuccess : function(result) {
			        _self.user.Birthday = result.value
			        let bir = result.value
			        _self.$http.post('/newtask/infoSetting',{birthday: bir},{emulateJSON: true}).then((response) => {
					})
			    },
			    onFail : function(err) {}
			})
		},
		changePost(){

		},
		changeCity(){
			let _self = this
			let provinceId
			let CityId
			dd.biz.util.chosen({
			    source: this.pro,
			   	onSuccess : function(result) {
			    	_self.user.Province = result.key;
			    	_self.user.ProvinceId = result.value;
			    	provinceId = _self.user.ProvinceId;
			    	_self.user.City = "";
					_self.user.CityId = "";
			    	_self.$http.get('/newtask/cityList',{params:{provinceId: provinceId}}).then((response) => {
						response = response.body
						let pro = response.list
						pro.forEach((item) => {
							let o = item
							for(var key in o){
								if(key === 'CityId'){
									o['value'] = o['CityId']
									delete(o[key])
								}
								if(key === 'CityName'){
									o['key'] = o['CityName']
									delete(o[key])
								}
							}
						})
						dd.biz.util.chosen({
						    source: pro,
						   	onSuccess : function(result) {
						    	_self.user.City = result.key
						    	_self.user.CityId = result.value
						    	CityId = result.value
						    	provinceId = _self.user.ProvinceId
						    	_self.$http.post('/newtask/infoSetting', {province: provinceId, city: CityId},{emulateJSON: true}).then((response) => {
								})
						    },
						   onFail : function(err) {}
						})
					})
			    },
			   onFail : function(err) {}
			})
		},
		changeHobby(){
			this.$router.push({ path: '/changemsg',query:{hobby: true}})
			this.$refs.chooseLabel.load();
			this.$nextTick(() => {
				this.$refs.chooseLabel.swiperFlush()
			})
		},
		changedLabel(){
			let _self= this;
			let chooseLabel = [];
			for (var i = 0; i < this.chooseLabel.length; i++) {
				chooseLabel.push(this.chooseLabel[i].Id)
			}
			if(this.chooseLabel.length <= 1){
				dd.device.notification.alert({
				    message: "请选择2至6个兴趣爱好",
				    title: "提示",//可传空
				    buttonName: "好的",
				    onSuccess : function() {
				        //onSuccess将在点击button之后回调
				        /*回调*/
				    },
				    onFail : function(err) {}
				});
			}else{
				chooseLabel = JSON.stringify(chooseLabel);
				this.$http.post('/newtask/addHobby',{Ids: chooseLabel},{emulateJSON: true}).then((response) => {
					response = response.body;
					if(response.success){
						this.$router.push({ path: '/changemsg',query:{hobby: false}});
						this.$http.get('/newtask/userinfo').then((response) => {
							response = response.data;
							this.user = response;
							if(this.user.FaceUrl == ''){
								this.user.FaceUrl = require('../source/img/im_uap.svg')
							}
						})
					}
				})
			}
		},
		// changeUrl(){
		// 	document.getElementById("upfile").click();
		// 	document.getElementById("upfile").click();
		// },
		change(event) {
			// let image = document.getElementById('img'); //预览对象

			let self = this;
			this.clip(event, {
				aspectRatio: 4 / 3
			});
			this.uploadCallback = function(result){
				self.user.Url = result;
				self.$refs.upload.style.display = "block";
				self.$refs.upload.src = result;
			}
		}
	},
	components: {
		"v-newpeople": newpeople
	}
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@r:37.5rem;
@import '../source/css/cliper.css';
.changemsg{
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background-color: #EBEFF0;
	.avatar{
		position: relative;
		width: 100%;
		height: 60/@r;
		padding: 0 15/@r;
		box-sizing: border-box;
		line-height: 60/@r;
		background-color: #fff;
		.wrap{
			border-bottom: 1px solid #efefef;
			box-shadow: 0 1px 0 0 #EFEFEF;
			.title{
				float: left;
			}
			.avatar_wrap{
				font-size: 0;
				float: right;
				width: 32/@r;
				height: 32/@r;
				border-radius: 50%;
				overflow: hidden;
				margin-top: 14/@r;
			}
			.labelupfile{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: block;
				z-index: 9;
			}

			.upfile{
				position: absolute;
				left: 0;
				top: 0;
				bottom: 0;
				right: 0;
			}
		}
	}
	.name{
		width: 100%;
		height: 45/@r;
		padding: 0 15/@r;
		box-sizing: border-box;
		line-height: 45/@r;
		background-color: #fff;
		.wrap{
			border-bottom: 1px solid #efefef;
			box-shadow: 0 1px 0 0 #EFEFEF;
			.title{
				float: left;
			}
			.text{
				float: right;
			}
		}
	}
	.item{
		width: 100%;
		height: 45/@r;
		padding: 0 15/@r;
		box-sizing: border-box;
		line-height: 45/@r;
		background-color: #fff;
		.wrap{
			border-bottom: 1px solid #efefef;
			box-shadow: 0 1px 0 0 #EFEFEF;
			.title{
				float: left;
			}
			.text{
				float: right;
				min-width: 2rem;
				text-align: right;
				.label{
					padding-left: 4/@r;
				}
				.post{
					text-align: right;
					width: 200/@r;
					height: 40/@r;
				}
				.icon{
					display: inline-block;
					vertical-align: middle;
					width: 10/@r;
					height: 20/@r;
					margin-left: 5/@r;
					background-image: url(../source/images/icon_bj_getback.svg);
					background-repeat: no-repeat;
					background-size: 100%;
				}
			}
		}
	}
	.content{
		width: 100%;
		padding: 15/@r 15/@r;
		box-sizing: border-box;
		margin-top: 8/@r;
		background-color: #fff;
		height: 145/@r;
		.desc_geren{
			width: 100%;
			height: 100%;
			line-height: 23/@r;
			padding-top: 6/@r;
			text-align: left;
			outline: none;
			resize: none;
			border: none;
			background-color: rgba(255, 255, 255, 0);
			line-height: 24/@r;
		}
	}
}
.changeLabel{
	position: fixed;
	top: 0;
	left: 0;
	bottom: 93/@r;
	width: 100%;
}
.next{
	position: fixed;
	left: 0;
	width: 100%;
	height: 93/@r;
	bottom: 0;
	background-color: #fff;
	.btn{
		position: absolute;
		left: 50%;
		top: 50%;
		margin-top: -22/@r;
		margin-left: -101/@r;
		width: 202/@r;
		height: 44/@r;
		text-align: center;
		font-size: 16/@r;
		line-height: 44/@r;
		color: #FFFFFF;
		letter-spacing: 0;
		background-image: linear-gradient(90deg, #FFCA3D 0%, #FFA83C 31%, #FF673B 92%, #FF5E3B 100%);
		box-shadow: 0 4/@r 3/@r 0 rgba(255,94,47,0.50);
	}
}
</style>
