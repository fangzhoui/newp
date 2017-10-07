<template>
<div class="dictionary">
	<ul class="dictionaryList" v-show="linkBarShow">
		<div>
			<li class="examination" @click="showExamination">
				<span class="icon_100fen"></span>
				<div class="examination_text">
					<h3 class="examination_title fontSize_16">新人入职考试</h3>
					<p class="examination_desc fontSize_12">需要阅读完以下条目才可以考试</p>
				</div>
				<span class="icon_go fontSize_18">GO</span>
			</li>
		</div>
		<li class="titleItem" v-for="(item,index) in titleList" @click="showModule(item, index)">
			<span class="item_text fontSize_18">{{item.RuleTitle}}</span>
			<span class="nextIcon"></span>
			<span class="isread fontSize_16" v-show="item.IsRead">已读</span>
		</li>
	</ul>
	<router-view :moduleList="moduleList" @ISREAD="IsReadAll" @SUBMIT="submitList"></router-view>
	<div class="linkBar" v-show="linkBarShow">
		<div class="linkBarIcon" ref="linkBarIcon" @click="showHome()"></div>
		<transition name="show">
			<a class="home" v-show="homeShow" @click="toCard"></a>
		</transition>
	</div>
	<div class="hide" v-show="homeShow" @click="showHome()"></div>
</div>
</template>

<script>
const ERR_OK = 0;
import module from './dictionaryModule'
export default {
	name: 'dictionary',
	data(){
		return{
			titleList: [],
			moduleList: [],
			homeShow: false,
			linkBarShow: true,
			isClick: null
		}
	},
	created(){
		this.load();
		this.$http.get('/api/menus').then((response) => {
			response = response.body;
			if(response.errno == ERR_OK){
				this.titleList = response.data;
			}
		});
	},
	watch: {
        "$route": "load",
    },
	methods: {
		load: function(){
			let a = this.$route.query.part;
			if(a == 'dictionary' || typeof a == 'undefined'){
				this.linkBarShow = true;
			}else{
				this.linkBarShow = false;
			}
            if(this.$route.query.isTest){
            	this.res.isTest = true;
            }
        },
        toCard(){
        	this.$router.push({path: '/card', query:{back: true}});
        },
		showModule(item,index){
			this.isClick = index;
			this.moduleList = this.titleList[index].MenuList;
			this.$router.push({path: '/dictionary/module', query: {title: item.RuleTitle, part: 'module'}});
		},
		showExamination(){
			this.$router.push({path: '/dictionary/examination', query:{part: 'examination', title: '入职测试'}});	
		},
		showHome(event){
			let obj = this.$refs.linkBarIcon;
			this.homeShow = !this.homeShow;
			let a = 'rotate(45deg)';
			let b = 'rotate(0)';
			if(this.homeShow){
				obj.style.transform= 'translate3d()';
				obj.style.transform = a;
				obj.style.transition = '0.4s';
			}else{
				obj.style.transform= 'translate3d()';
				obj.style.transform = b;
				obj.style.transition = '0.4s';
			}
		},
		IsReadAll(index){
			let a = 0;
			this.titleList[this.isClick].MenuList[index].IsRead = 1;
			this.titleList[this.isClick].MenuList.forEach((item) => {
				if(item.IsRead == 1){
					a++
				}
			});
			if(a >= this.titleList[this.isClick].MenuList.length){
				this.titleList[this.isClick].IsRead = 1;
			}
		},
		submitList(list){
			this.moduleList = list;
		}
	},
	components: {
		'v-module': module
	}
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@r:37.5rem;
.dictionary{
	position: relative;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background: #F6F9F9;
	font-size: 0;
	.dictionaryList{
		width: 100%;
		padding: 15/@r;
		box-sizing: border-box;
		.examination{
			width: 100%;
			height: 70/@r;
			border: 5px solid #1B4551;
			border-radius: 35/@r;
			box-sizing: border-box;
			margin-bottom: 20/@r;
			.icon_100fen{
				float: left;
				width: 58/@r;
				height: 40/@r;
				margin: 10/@r 5/@r 10/@r 20/@r;
				background: url('../source/img/icon_newexam.jpg') no-repeat;
				background-size: 100%; 
			}
			.examination_text{
				float: left;
				height: 40/@r;
				margin: 10/@r 5/@r 10/@r;
				.examination_title{
					line-height: 22/@r;
					font-weight: 700;
					color: #222;
				}
				.examination_desc{
					line-height: 17/@r;
					color: #666;
				}
			}
			.icon_go{
				float: right;
				margin: 9/@r 10/@r 9/@r 0;
				width: 42/@r;
				height: 42/@r;
				background: #FFD600;
				border: 3px solid #1B4551;
				border-radius: 50%;
				box-sizing: border-box;
				color: #222;
				line-height: 36/@r;
				text-align: center;
				font-weight: 700;
			}
		}
		.titleItem{
			width: 100%;
			height: 80/@r;
			margin-bottom: 10/@r;
			background-color: #fff;
			border: 4px solid #1B4551;
			border-radius: 4px;
			box-sizing: border-box;
			.item_text{
				float: left;
				text-indent: 1em;
				font-weight: 700;
				line-height: 72/@r;
			}
			.nextIcon{
				float: right;
				width: 25/@r;
				height: 72/@r;
				background-image: url('../source/img/icon_indexzd_into.svg');
				background-repeat: no-repeat;
				background-position: 0 25/@r;
				background-size: 13/@r 22/@r;
			}
			.isread{
				float: right;
				height: 72/@r;
				line-height: 72/@r;
				padding-right: 10/@r;
				color: #66BD5C;
				font-weight: 700;
			}
		}
	}
	.linkBar{
		position: fixed;
		bottom: 30/@r;
		right: 15/@r;
		border-radius: 50%;
		width: 50/@r;
		height: 50/@r;
		background-color: #FFFFFF;
		box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
		z-index: 99;
		.linkBarIcon{
			border-radius: 50%;
			width: 50/@r;
			height: 50/@r;
			background-image: url(../source/img/icon_index_home.svg);
			background-size: 20/@r 20/@r;
			background-repeat: no-repeat;
			background-position: 15/@r 15/@r;
		}
		.home{
			display: block;
			position: absolute;
			top: -65/@r;
			width: 50/@r;
			height: 50/@r;
			border-radius: 50%;
			background: #FF5E3B;
			box-shadow: 0 2px 4px 0 rgba(255,94,47,0.20);
			background-image: url(../source/img/icon_index_me.svg);
			background-size: 20/@r 20/@r;
			background-repeat: no-repeat;
			background-position: 15/@r 15/@r;
			opacity: 1;
			&.show-enter-active, &.show-leave-active{
				transition: all 0.4s;
				transform: translate3d(0,0,0);
			}
			&.show-enter, &.show-leave-active{
				top: 0/@r;
				opacity: 0;
				transform: translate3d(0,0,0);
			}
		}
	}
	.hide{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.6);
	}
}
</style>
