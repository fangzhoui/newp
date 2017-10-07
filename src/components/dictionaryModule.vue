<template>
<transition name="move">
	<div class="dictionary" v-show="moduleShow">
		<ul class="dictionaryList" v-show="listShow">
			<li class="titleItem" v-for="(item,index) in moduleList" @click="showContent(item, index)">
				<span class="titleItem_text fontSize_16">
					{{item.RuleTitle}}
				</span>
				<span class="titleItem_important" v-show="item.Mark"></span>
				<span class="titleItem_isread" v-show="item.IsRead"></span>
			</li>
		</ul>
		<router-view :itemContent="itemContent" :clickItem="clickItem"></router-view>
	</div>
</transition>
</template>

<script>
export default {
	name: 'dictionaryModule',
	props: {
		moduleList: {
			type: Array
		}
	},
	data(){
		return{
			clickItem: {},
			itemContent: '',
			moduleShow: false,
			listShow: false
		}
	},
	created(){
		this.load();
	},
	watch: {
        "$route": "load",
    },
	methods: {
		load: function(){
           	this.moduleShow = true;
           	let a = this.$route.query.part;
			if(a == 'module'){
				this.listShow = true;
			}else{
				this.listShow = false;
			}
            this.iosReturn();
            this.setTitle();
        },
		showContent(item, index){
			this.clickItem = this.moduleList[index];
			this.$router.push({path: '/dictionary/module/content', query: {title: item.RuleTitle, part: 'content'}});
			this.$emit('ISREAD', index);
		},
		iosReturn(){
			let _self = this;
			dd.biz.navigation.setLeft({
				show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
				control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
				showIcon: true,//是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
				text: '返回',//控制显示文本，空字符串表示显示默认文本
				onSuccess : function(result) {
					_self.$router.push({path: '/dictionary', query: {title: '乐新人'}});
				},
				onFail : function(err) {}
			});
		},
		setTitle(){
			let text = this.$route.query.title;
			dd.biz.navigation.setTitle({
				title : text,
			});
		}
	},
	components: {
	}
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@r:37.5rem;
.dictionary{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	background: #F6F9F9;
	&.move-enter-active{
		transition: all 0.4s;
	}
	&.move-enter{
		transform: translate3d(100%, 0, 0);
	}
	.dictionaryList{
		width: 100%;
		height: 100%;
		padding: 15/@r;
		box-sizing: border-box;
		background: #fff;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		.titleItem{
			position: relative;
			width: 100%;
			height: 59/@r;
			padding-right: 15/@r;
			padding-left: 10/@r;
			border: 2px solid #1B4551;
			border-radius: 4px;
			margin-bottom: 5/@r;
			color: #222;
			background-color: #fff;
			box-sizing: border-box;
			.titleItem_text{
				float: left;
				height: 100%;
				line-height: 59/@r;
				font-weight: 700;
			}
			.titleItem_important{
				float: right;
				width: 34/@r;
				height: 34/@r;
				margin: 12/@r 0 12/@r 10/@r;
				background-image: url('../source/img/icon_emphasis.svg');
				background-size: 100%;
				background-repeat: no-repeat;
			}
			.titleItem_isread{
				float: right;
				width: 34/@r;
				height: 20/@r;
				margin: 18/@r 0 12/@r 0;
				background-image: url('../source/img/icon_read.svg');
				background-size: 100%;
				background-repeat: no-repeat;
			}
		}
	}
}
</style>
