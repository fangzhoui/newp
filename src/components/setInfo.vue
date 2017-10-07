<template>
	<div class="setInfo" :style="{height: height+'px'}">
		<div class="wrap" v-show="pageRouterDisplay == 1">
			<div class="new1">
				<div class="bg_fff"></div>
				<div class="avatar">
					<div class="pic_wrap">
						<img :src="user.FaceUrl">
					</div>
					<p class="name fontSize_18">{{user.EmployeeName}}</p>
				</div>
				<div class="sex">
					<div class="sex_item" :class="{'active': user.Sex==1}" @click="user.Sex=1">
						<i class="icon_man"></i>
						<span class="sex_text fontSize_12">男士</span>
					</div>
					<div class="sex_item" :class="{'active1': user.Sex==0}" @click="user.Sex=0">
						<i class="icon_wm"></i>
						<span class="sex_text fontSize_12">女士</span>
					</div>
				</div>
				<div class="birthday_wrap" @click="changeType($event)">
					<label class="label_bir fontSize_14" for="setBir">选择生日</label>
					<form action="javascript:return true;">
						<input class="birthday fontSize_16" type="date" id="setBir" ref="setBir">
						<div class="date fontSize_16" id="date">-年-月-日</div>
					</form>
					<div class="line"></div>
				</div>
			</div>
			<div class="next">
				<div class="btn" @click="setSexAndBir">下一步</div>
			</div>
		</div>
		<div class="wrap" v-show="pageRouterDisplay == 2">
			<div class="new2">
				<p class="msg fontSize_30">
					想要混脸熟?<br> 来张<span class="yellow">自拍照</span>吧！
				</p>
				<div class="pic_wrap">
					<div class="canmer">
						<img :src="user.Url" id="img" ref='upload'>
						<input type="file" accept="image/png,image/jpg,image/jpeg" id="upfile" @change="change($event)" >
						<label class="labelupfile" for="upfile"></label>
					</div>
				</div>
			</div>
			<div class="next">
				<div class="btn" @click="setUrl">下一步</div>
			</div>
		</div>
		<div class="wrap" v-show="pageRouterDisplay == 3">
			<div class="new3">
				<div class="city_wrap">
					<input class="city fontSize_16" type="text" placeholder="填写自己的家乡" v-model="user.City" ref="city">
				</div>
				<textarea class="desc fontSize_14" rows="5" maxlength="95" v-model="user.Description" placeholder="和大家打个招呼，说说工作经历或者对未来的美好憧憬"></textarea>
			</div>
			<div class="next">
				<div class="btn" @click="setDes">下一步</div>
			</div>
		</div>
		<div class="wrap" v-show="pageRouterDisplay == 4">
			<div class="new4">
				<div class="wrap_label">
					<v-newpeople :chooseLabel="chooseLabel"></v-newpeople>
				</div>
				<div class="next">
					<div class="btn" @click="setHobby">下一步</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import newpeople from './hobby_select';
import {$loadImage} from '@/utils/loadImage.js';
import Exif from 'exif-js';
export default {
	name: 'setInfo',
	props: {
		user: {
			type: Object
		}
	},
	data () {
		return {
			pageRouterDisplay: 1,
			height: 0,
			chooseLabel: [],
			picData: [{PicUrl: '', EmployeeName: 'Ta的名字', GroupPhotoId: ''}, {PicUrl: '', EmployeeName: 'Ta的名字', GroupPhotoId: ''}, {PicUrl: '', EmployeeName: 'Ta的名字', GroupPhotoId: ''}, {PicUrl: '', EmployeeName: 'Ta的名字', GroupPhotoId: ''}, {PicUrl: '', EmployeeName: 'Ta的名字', GroupPhotoId: ''}],
		}
	},
	created(){
	},
	mounted(){
		this.height = document.body.clientHeight;
		this.load();
	},
	watch: {
		"$route": "load",
	},
	methods: {
		load(){
			this.pageRouterDisplay = this.$route.query.page || 3;
			let title = 0;
			if (this.user.Pushed) {
				title = this.pageRouterDisplay + "/4";
			} else {
				title = this.pageRouterDisplay + "/5";
			}
		},
		setSexAndBir(){
			let sex = this.user.Sex;
			let bir = this.user.Birthday;
			if(typeof sex == "object" || typeof sex == "object"){
				alert("请填写信息")
			}else{
				console.log(this.user)
				this.$router.push({path: '/setInfo',query:{page: 2}});
			}
		},
		changeType(event){
			let self = this;
			let obj = event.target;
			let date = document.getElementById("date");
			obj.onblur = function(){
				obj.style.opacity = 1;
				date.style.opacity = 0;
				self.user.Birthday = obj.value;
			}
			console.log(obj)
		},
		change(event) {
			let self = this;
			this.clip(event, {
				aspectRatio: 4 / 3
			});
			this.uploadCallback = function(result){
				self.user.Url = result;
				self.$refs.upload.style.display = "block";
				self.$refs.upload.src = result;
			}
		},
		setUrl(){
			let empurl = this.$refs.upload.src;
			if(!empurl){
				alert("请上传自拍照");
			}else{
				this.$router.push({path: '/setInfo',query:{page: 3}});	
			}
		},
		setDes(){
			let desc = this.user.Description;
			let city = this.user.City;
			if(desc == '' || city == ''){
				alert("请填写信息")
			}else{
				this.$router.push({path: '/setInfo',query:{page: 4}});
			}
		},
		setHobby(){
			let chooseLabel = [];
			for (var i = 0; i < this.chooseLabel.length; i++) {
				chooseLabel.push(this.chooseLabel[i]);
			}
			if(chooseLabel.length <= 1){
				alert("请选择2至6个兴趣爱好")
			}else{
				this.user.hobbys = chooseLabel;
				console.log(this.user,'1');
				this.$router.push({name: 'card', params: {user: this.user}, query: {back: false}});
			}
		}
	},
	components: {
		"v-newpeople": newpeople
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/less" lang="less" scoped>
@import '../source/css/cliper.css';
@r:37.5rem;
.wrap{
	position: relative;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
}
.new1{
	position: absolute;
	top: 0;
	bottom: 93/@r;
	width: 100%;
	background: url('../source/img/im_cloud.svg') left bottom no-repeat,
				linear-gradient(-180deg, #FFFFFF 0%, #FFFFFF 100%) center bottom no-repeat,
				linear-gradient(-180deg, #FFCA78 0%, #EE7074 100%) no-repeat;
	background-size: 100%,80% 90%,100% 99%;
	.bg_fff{
		position: absolute;
		width: 90%;
		left: 5%;
		top: 70/@r;
		bottom: 0;
	}
	.avatar{
		position: absolute;
		left: 50%;
		top: 99/@r;
		margin-left: -35/@r;
		text-align: center;
		.pic_wrap{
			width: 70/@r;
			height: 70/@r;
			border-radius: 50%;
			overflow: hidden;
			padding: 3/@r;
			background-color: rgb(240, 240, 240);
			img{
				width: 70/@r;
				height: 70/@r;
				border-radius: 50%;
			}
		}   
		.name{
			margin-top: 15/@r;
			color: #222222;
			letter-spacing: 0;
			line-height: 18/@r;
			font-weight: 700;
		}
	}
	.sex{
		position: absolute;
		top: 249/@r;
		left: 50%;
		width: 146/@r;
		font-size: 0;
		margin-left: -73/@r;
		.sex_item{
			float: left;
			width: 40/@r;
			text-align: center;
			color: #C7C7C7;
			.icon_man{
				display: block;
				width: 40/@r;
				height: 40/@r;
				background-image: url('../source/img/icon_man.png');
				background-size: 95%;
				background-position: 5/@r 0;
				background-repeat: no-repeat;
			}
			.icon_wm{
				display: block;
				width: 40/@r;
				height: 40/@r;
				background-image: url('../source/img/icon_wm.png');
				background-size: 100%;
				background-repeat: no-repeat;
			}
			.sex_text{
				letter-spacing: 0;
				display: block;
				padding-top: 4/@r;
			}
		}
		.sex_item:nth-child(2){
			float: right;
		}
		.active{
			color: #008CEE;
			.icon_man{
				background-image: url('../source/img/icon_man_select.png');
			}
		}
		.active1{
			color: #FF5E3B;
			.icon_wm{
				background-image: url('../source/img/icon_wm_select.png');
			}
		}
	}
	.birthday_wrap{
		position: absolute;
		top: 385/@r;
		width: 100%;
		text-align: center;
		.title{
			font-size: 15/@r;
			line-height: 21/@r;
			color: #666666;
			letter-spacing: 0;
		}
		.label_bir{
			display: block;
			padding: 5/@r;
		}
		.birthday{
			height: 25/@r;
			width: 150/@r;
			line-height: 25/@r;
			color: #FF5E3B;
			font-weight: 700;
			text-align: center;
			margin-left: 45/@r;
			opacity: 0;
		}
		.date{
			margin: 0 auto;
			height: 25/@r;
			width: 150/@r;
			line-height: 25/@r;
			color: #FF5E3B;
			font-weight: 700;
			text-align: center;
			margin-top: -25/@r;
		}
		.line{
			width: 94/@r;
			height: 4/@r;
			background: #FFCA3D;
			margin: 0 auto;
			margin-top: 3/@r;
			
		}
	}
}
.new2 {
	position: absolute;
	top: 0;
	bottom: 93/@r;
	width: 100%;
	overflow: hidden;
	background: url('../source/img/im_cloud.svg') left bottom no-repeat,
	url('../source/img/im_fly.png') 45/@r 120/@r no-repeat,
	linear-gradient(-180deg, #EEAD92 0%, #6018DC 100%) no-repeat;
	background-size: 100%, 33%, 100% 99%;
	.msg {
		position: absolute;
		top: 30/@r;
		left: 30/@r;
		color: #fff;
		text-shadow: 5px 2px 6px #8F7221;
		line-height: 1.2;
		.yellow {
			color: #FFD155;
		}
	}
	.pic_wrap {
		position: absolute;
		top: 154/@r;
		width: 339/@r;
		height: 258/@r;
		padding: 8/@r;
		left: 50%;
		transform: translateX(-50%);
		box-sizing: border-box;
		background: #FFDFD9;
		.canmer {
			position: relative;
			width: 323/@r;
			height: 242/@r;
			background-color: #fff;
			text-align: center;
			overflow: hidden;
			background-image: url('../source/img/lxr_camer.svg');
			background-size: 30% 30%;
			background-position: 50% 50%;
			background-repeat: no-repeat;
			.labelupfile{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: block;
				z-index: 9;
			}
			#upfile{
				display: none;
			}
			#img{
				width: 100%;
			}
		}
	}
}
.new3{
	position: absolute;
	top: 0;
	bottom: 93/@r;
	width: 100%;
	overflow: hidden;
	background: url('../source/img/lxr_bg_3.svg') no-repeat,
				linear-gradient(-180deg, #FFFFFF 0%, #FFFFFF 100%) center bottom no-repeat,
				linear-gradient(-180deg, #FFCA78 0%, #FFFFFF 100%) no-repeat;
	background-size: 100%, 90%, 100% 100%;
	.desc{
		position: absolute;
		top: 255/@r;
		left: 43/@r;
		width: 290/@r;
		outline: none;
		resize: none;
		border: none;
		background-color: rgba(255, 255, 255, 0);
		line-height: 24/@r;
	}
	.city_wrap{
		position: absolute;
		top: 132/@r;
		left: 142/@r;
		width: 190/@r;
		height: 23/@r;
		line-height: 23/@r;
		text-align: right;
		font-size: 0;
		color: #C7C7C7;
		.city{
			display: inline-block;
			width: 100%;
			height: 100%;
			color: #222;
			text-align: right;
		}
	}
}
.new4{
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	.wrap_label{
		position: absolute;
		top: 0;
		bottom: 93/@r;
		width: 100%;
	}
}
.new5{
	position: absolute;
	width: 100%;
	top: 0;
	bottom: 93/@r;
	background: url('../source/img/im_cloud.svg') left bottom no-repeat,
				linear-gradient(-180deg, #FFCA78 0%, #EE7074 100%) no-repeat;
	background-size: 100%,100% 99%;
	
	.msg{
		position: absolute;
		top: 22/@r;
		left: 38/@r;
		color: #fff;
		text-shadow: 5px 2px 6px #8F7221;
		line-height: 1.2;
	}
	.image_list{
		position: absolute;
		top: 64/@r;
		width: 295/@r;
		left: 50%;
		transform: translateX(-50%);
		.image_item{
			width: 100%;
			height: 72/@r;
			margin-bottom: 10/@r;
			background-color: #fff;
			box-shadow: 0 2/@r 4/@r 0 rgba(102,102,102,0.20);
			border-radius: 4/@r;
			overflow: hidden;
			display: flex;
			.camer{
				box-sizing: border-box;
				flex: 0 0 72/@r;
				width: 72/@r;
				height: 100%;
				background-color: #f5f8f9;
				text-align: center;
				background-image: url('../source/images/lxr_camer.svg');
				background-size: 64/@r 64/@r;
				background-repeat: no-repeat;
				background-position: 4/@r 4/@r;
			}
			.name{
				flex: 1;
				height: 100%;
				background-color: #fff;
				line-height: 72/@r;
				text-align: center;
				color: #c9c9c9;
			}
			.active{
				color: #000;
			}
		}
	}
}
.next{
position: absolute;
left: 0;
bottom: 0;
width: 100%;
height: 93/@r;
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
