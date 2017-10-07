<template>
<transition name="move">
	<div class="dictionaryContent" v-show="contentShow">
		<div class="itemTitle fontSize_18"><span class="djIcon"></span>{{clickItem.RuleTitle}}</div>
		<div class="content fontSize_16">{{clickItem.Content}}</div>
	</div>
</transition>
</template>

<script>
export default {
	name: 'dictionaryContent',
	props: {
		clickItem: {
			type: Object
		}
	},
	data(){
		return {
			contentShow: false,
		}
	},
	created(){
		this.load(); 
	},
	watch: {
		'$route': 'load' 
	},
	methods: {
		load(){
			let a = this.$route.query.part;
			if(a == 'content'){
				this.contentShow = true;
			}else{
				this.listShow = false;
			}
			this.iosReturn();
			this.setTitle();
		},
		iosReturn(){
			let _self = this;
			dd.biz.navigation.setLeft({
				show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
				control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
				showIcon: true,//是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
				text: '返回',//控制显示文本，空字符串表示显示默认文本
				onSuccess : function(result) {
					_self.$router.push({path: '/dictionary/module', query: {title: _self.$route.query.oldTitle, part: 'module'}});
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
	}
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@r:37.5rem;
.dictionaryContent{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	background: #FFF;
	padding: 0 15/@r;
	&.move-enter-active{
		transition: all 0.4s;
	}
	&.move-enter{
		transform: translate3d(100%, 0, 0);
	}
	/*&.move-leave{
		transform: translate3d(0, 0, 0);
	}
	&.move-leave-active{
		transform: translate3d(100%, 0, 0);
		transition: all 0.4s;
	}*/
	.itemTitle{
		width: 100%;
		height: 55/@r;
		border-bottom: 1px solid #f0f0f0;
		line-height: 55/@r;
		.djIcon{
			display: inline-block;
			width: 18/@r;
			height: 18/@r;
			vertical-align: middle;
			background-image: url('../source/img/icon_dj.svg');
			background-size: 18/@r 18/@r;
			margin-right: 10/@r;
		}
	}
	.content{
		width: 100%;
		text-align: justify;
		padding-top: 10/@r;
	}
}
</style>
