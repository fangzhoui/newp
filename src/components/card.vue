<template>
<div class="card">
	<div v-show="!sendOk" ref="wrap">
		<div class="avatar">
			<div class="pic" ref="pic" @click="showBigImage(indexN)">
				<img :src="user.Url" width="100%">
			</div>
			<div class="message">
				<p class="name fontSize_20"><i class="icon_sex" :class="[user.Sex?'icon-man':'icon-wm']"></i>{{user.EmployeeName}}</p>
				<p class="birthday fontSize_14"><i class="bir_icon"></i>{{user.Birthday | $formatDate}}<i class="icon_comefrom"></i><span v-show="user.Province != user.City">{{user.City}}</span></p>
				<p class="job fontSize_14"><i class="icon_job"></i>{{user.Post}}</p>
				<p class="label fontSize_14"><i class="icon_label"></i><span class="label_item" v-for="item in user.hobbys">{{item.hobby}}</span></p>
			</div>
		</div>
		<div class="desc">
			<p class="text fontSize_14">{{user.Description}}</p>
		</div>
		<div class="picWrap" v-show="picBig.length">
			<div class="img_box">
				<div class="img_lf" v-for="(item,index) in picBig" ref="imgLf" @click="showBigImage((index+1))"></div>
				<div class="img_rf">
					<div class="img_wrap" v-for="(item,index) in picSm" ref="imgRf" @click="showBigImage((index+2))">
					</div>
				</div>
			</div>
		</div>
		<div class="rating_wrap">
			<h3 class="rating_title fontSize_12">{{ratings.length}}条评论</h3>
			<p class="noRating fontSize_16" v-show="!ratings.length">暂无评论</p>
			<ul class="ratings" v-show="ratings.length">
				<li class="rating" v-for="item in ratings">
					<div class="rating_avatar">
						<img :src="item.FaceUrl" height="100%">
					</div>
					<div class="rating_text">
						<div class="rating_name fontSize_16">
							{{item.CommentEmployeeName}}
						</div>
						<div class="rating_content fontSize_14">
							{{item.Content}}
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="isSend">
			<div class="send_wrap">
				<div class="send fontSize_16" @click="setData">继续</div>
			</div>
		</div>
		<div class="rating_box" v-show="isSend == 2">
			<div class="quick_rating">
				<span class="quick_text1 fontSize_14" @click="sendQuick1($event)" v-for="item in quickText" v-html="item"></span>
			</div>
			<div class="rating_input">
				<input class="input fontSize_16" type="text" placeholder="说点什么" v-model="ratingInput" @click="enterText">
				<span class="send_rating fontSize_16" @click="sendQuick2">发送</span>
			</div>
		</div>
	</div>
	<div class="loading" v-show="loadingShow">
		<div class="loading_wrap">
		</div>
	</div>
	<v-excessive v-show="sendOk" @setOk="setOk"></v-excessive>
</div>
</template>

<script>
const ERR_OK = 0;
import excessive from './excessive';
import {$loadImage} from '@/utils/loadImage.js';
import {$formatDate} from '@/utils/date.js';
export default {
	name: 'card',
	props: {
		userConfig: {
			type: Object
		}
	},
	data () {
		return {
			user: {},
			picBig: [],
			picSm: [],
			url: '',
			sendOk: false,
			indexN: 0,
			urlList: [],
			isSend: 2,
			quickText: ['&#x1F339送上鲜花','&#x1F44F热烈欢迎','&#x1F4AA努力加油'],
			ratings: [],
			ratingInput: '',
			loadingShow: false
		}
	},
	created(){
		this.load();
		let employeeId = "";
		if (this.$route.query.employeeId) {
			employeeId = this.$route.query.employeeId;
			this.isSend = 2;
		}
		
	},
	watch: {
		'$route': 'load' 
	},
	methods: {
		load(){
			if(!this.$route.query.back){
				this.user = this.$route.params.user;
				this.picBig = this.user.photo.slice(0,1);
				this.picSm = this.user.photo.slice(1,5);
				this.$nextTick(() => {
					$loadImage(this.picBig[0], this.$refs.imgLf[0])
					
					this.picSm.forEach((item, index) => {
						let obj = this.$refs.imgRf[index];
						let url = item;
						$loadImage(url, obj);
					})
				})
			}else{
				this.$http.get('/api/userinfotast').then((response) => {
					response = response.body;
					if(response.errno == ERR_OK){
						this.user = response.data;
						this.ratings = this.user.ratings;
						this.picBig = this.user.photo.slice(0,1);
						this.picSm = this.user.photo.slice(1,5);
						this.$nextTick(() => {
							$loadImage(this.picBig[0], this.$refs.imgLf[0])
							
							this.picSm.forEach((item, index) => {
								let obj = this.$refs.imgRf[index];
								let url = item;
								$loadImage(url, obj);
							})
						})
					}
				})
			}
		},
		setData(){
			let _self = this;
			_self.sendOk = true;
		},
		setOk(){
			this.sendOk = !this.sendOk;
		},
		sendQuick1(event){
			let data = new Date();
			let a = {};
			let obj = event.target;
			this.loadingShow = true;
			a.Content = obj.innerHTML;
			a.CommentEmployeeName = this.user.EmployeeName;
			a.FaceUrl = this.user.Url;
			let _self = this;
			setTimeout(function(){
				_self.loadingShow = false;
				_self.ratings.push(a);
				_self.$nextTick(() => {
					window.scrollTo(0,100000);
				})
			}, 500)
		},
		sendQuick2(){
			if(this.ratingInput == ''){
				return
			}

			let data = new Date();
			let a = {};
			a.Content = this.ratingInput;
			a.CommentEmployeeName = this.user.EmployeeName;
			a.FaceUrl = this.user.Url;
			this.loadingShow = true;

			let _self = this;
			setTimeout(function(){
				_self.loadingShow = false;
				_self.ratings.push(a);
				_self.ratingInput = '';
				_self.$nextTick(() => {
					window.scrollTo(0,100000);
				});
			}, 500)
		}
	},
	filters: {
		$formatDate (time) {
			let data = new Date(time);
			return $formatDate(data, 'MM月dd日');
		}
	},
	components: {
		"v-excessive": excessive
	}
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@r:37.5rem;
.card{
	position: relative;
	width: 100%;
	background-color: #FFF;
	.avatar{
		position: relative;
		width: 100%;
		padding: 15/@r 15/@r 0 15/@r;
		box-sizing: border-box;
		min-height: 94/@r;
		max-height: 114/@r;
		.pic{
			float: left;
			width: 100/@r;
			height: 75/@r;
			border: 4px solid #FFFFFF;
			box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
			box-sizing: border-box;
			overflow: hidden;
			margin-top: 10/@r;
		}
		.message{
			float: left;
			width: 230/@r;
			margin-left: 11/@r;
			.name{
				height: 28/@r;
				line-height: 28/@r;
				font-weight: 700;
				color: #222;
				.icon_sex{
					display: inline-block;
					vertical-align: top;
					width: 12/@r;
					height: 28/@r;
					margin-right: 7/@r;
					background-repeat: no-repeat;
					background-size: 100%;
					background-position: 0 6/@r;
				}
				.icon-man{
					background-image: url('../source/img/icon_man.svg');
				}
				.icon-wm{
					background-image: url('../source/img/icon_wm.svg');
				}
			}
			.birthday{
				line-height: 20/@r;
				height: 20/@r;
				color: #666;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.bir_icon{
					display: inline-block;
					vertical-align: top;
					width: 14/@r;
					height: 20/@r;
					margin-right: 5/@r;
					background-image: url('../source/img/icon_birth.svg');
					background-repeat: no-repeat;
					background-size: 100%;
					background-position: 0 2/@r;
				}
				.icon_comefrom{
					display: inline-block;
					vertical-align: top;
					width: 14/@r;
					height: 20/@r;
					margin-right: 5/@r;
					margin-left: 10/@r;
					background-image: url('../source/img/icon_zb.svg');
					background-repeat: no-repeat;
					background-size: 100%;
					background-position: 0 2/@r;
				}
			}
			.job{
				line-height: 20/@r;
				height: 20/@r;
				color: #666;
				.icon_job{
					display: inline-block;
					vertical-align: top;
					width: 14/@r;
					height: 20/@r;
					margin-right: 5/@r;
					background-image: url('../source/img/icon_bumen.svg');
					background-repeat: no-repeat;
					background-size: 100%;
					background-position: 0 2/@r;
				}
			}
			.label{
				line-height: 20/@r;
				height: 20/@r;
				color: #666;
				.icon_label{
					display: inline-block;
					vertical-align: top;
					width: 14/@r;
					height: 20/@r;
					margin-right: 5/@r;
					background-image: url('../source/img/icon_aihao.svg');
					background-repeat: no-repeat;
					background-size: 100%;
					background-position: 0 2/@r;
				}
				.label_item{
					margin-right: 4/@r;
				}
			}
		}
	}
	.desc{
		margin-top: 10/@r;
		width: 100%;
		text-align: center;
		background-color: #fff;
		margin-bottom: 18/@r;
		padding: 15/@r 15/@r 0 15/@r;
		box-sizing: border-box;
		.text{
			width: 100%;
			height: 100%;
			text-align: justify;
			line-height: 1.4;
			color: #666;
		}
		.height{
			height: 200%;
		}
	}
	.picWrap{
		width: 100%;
		box-sizing: border-box;
		text-align: center;
		background-color: #f6f9f9;
		padding: 15/@r 15/@r 15/@r 15/@r;
		.img_box{
			width: 100%;
			height: 200/@r;
			.img_lf{
				width: 136/@r;
				height: 200/@r;
				overflow: hidden;
				float: left;
			}
			.img_rf{
				float: left;
				width: 209/@r;
				height: 200/@r;
				.img_wrap{
					width: 96/@r;
					height: 96/@r;
					margin-bottom: 8/@r;
					margin-left: 8/@r;
					margin-top: 0;
					overflow: hidden;
					float: left;
				}
			}
		}
	}
	.rating_wrap{
		.rating_title{
			height: 38/@r;
			line-height: 38/@r;
			padding: 0 15/@r;
			color: #222;
			border-bottom: 1px solid #F0F0F0;
			border-top: 1px solid #F0F0F0;
		}
		.noRating{
			height: 80/@r;
			padding: 40/@r 0 130/@r;
			background: url('../source/img/icon_no_comment.svg') 50% 40/@r no-repeat;
			background-size: 55/@r;
			text-align: center;
			line-height: 130/@r;
			color: #999;
		}
		.ratings{
			padding-bottom: 104/@r;
			.rating{
				padding: 15/@r 15/@r 0;
				display: flex;
				.rating_avatar{
					font-size: 0;
					flex: 0 0 28/@r;
					height: 28/@r;
					border-radius: 50%;
					overflow: hidden;
				}
				.rating_text{
					flex: 1;
					padding-left: 8/@r;
					padding-bottom: 15/@r;
					border-bottom: 1px solid #F0F0F0;
					.rating_name{
						height: 22/@r;
						line-height: 22/@r;
						color: #222;
					}
					.rating_content{
						width: 300/@r;
						box-sizing: border-box;
						word-wrap: break-word;
						line-height: 20/@r;
						margin-top: 10/@r;
					}
				}
			}
		}
	}
	.send_wrap{
		position: fixed;
		top: 10/@r;
		right: 10/@r;
		.send{
			padding: 5/@r;
			background-color: rgba(0,0,0,0.1);
			border-radius: 5/@r;
		} 
	}
	.rating_box{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0 -1px 2px 0 rgba(0,0,0,0.10);
		.quick_rating{
			padding: 14/@r 0 7/@r 15/@r;
			height: 55/@r;
			font-size: 0;
			box-sizing: border-box;
			.quick_text1{
				display: inline-block;
				width: 107/@r;
				height: 34/@r;
				border-radius: 18/@r;
				background: #FFFFFF;
				border: 1px solid #FF5E3B;
				box-shadow: 0 2px 4px 0 rgba(255,94,47,0.20);
				line-height: 34/@r;
				text-align: center;
				color: #FF5E3B;
				margin-right: 10/@r;
				&:last-child{
					margin-right: 0;
				}
			}
		}
		.rating_input{
			height: 48/@r;
			padding: 9/@r 15/@r;
			box-sizing: border-box;
			font-size: 0;
			.input{
				display: inline-block;
				line-height: 30/@r;
				box-sizing: border-box;
				width: 288/@r;
				height: 32/@r;
				background: #EEEEEE;
				border-radius: 4px;
				text-indent: 1em;
			}
			.send_rating{
				padding: 11/@r 20/@r;
				color: #FF5E3B;
			}
		}
	}
	.loading{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 80/@r;
		right: 0;
		
		.loading_wrap{
			position: absolute;
			top: 55%;
			left: 50%;
			width: 60/@r;
			height: 60/@r;
			margin-left: -30/@r;
			margin-top: -30/@r;
			background-image: url('../source/img/loading.svg');
			background-size: 100%;
			border-radius: 8/@r;
			overflow: hidden;
			opacity: 0.8;
			background-color: #222;
		}
	}
}
</style>
