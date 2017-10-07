<template>
	<div class="submit_wrap">
		<div class="submit" v-show="submitShow">
			<div class="result">
				<div class="round fontSize_30">	
					{{source}}/{{moduleList.length}}
				</div>
				<div class="round_text fontSize_20">	
					考试结果
				</div>
				<div class="round_content fontSize_14">	
					点击可查看答案详情
				</div>
			</div>
			<ul class="result_list">
				<li class="result_item fontSize_18" v-for="(item,index) in moduleList" @click="showItem(index)" :class="{'false': item.answer != item.staffAnswer}">{{index+1}}</li>
			</ul>
			<div class="back">
				<div class="back_btn fontSize_16" @click="backIndex">
					返回首页
				</div>
			</div>
		</div>
		<router-view :moduleList="moduleList" :clickItem="clickItem"></router-view>
	</div>
</template>

<script>
export default {
	name: 'submitPage',
	data () {
		return {
			clickItem: null,
			submitShow: true,
			source: 0
		}
	},
	props: {
		moduleList: {
			type: Array,
			default: []
		}
	},
	created(){
		this.moduleList.forEach((item) => {
			if(item.answer == item.staffAnswer){
				this.source++;
			};
		});
	},
	watch: {
        "$route": "load",
    },
	methods:{
		load: function(){
			let a = this.$route.query.part;
			if(a == 'submitPage'){
				this.submitShow = true;
			}else{
				this.submitShow = false;
			}
        },
		showItem(index){
			this.clickItem = index;
			this.submitShow = false;
			this.$router.push({path: '/dictionary/submitPage/examinationSubmit', query: {part: 'examinationSubmit'}});
		},
		backIndex(){
			this.$router.push({path: '/dictionary', query: {isTest: true, part: 'dictionary', title: '乐新人'}});
		}
	}
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@r:37.5rem;
.submit_wrap{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	.submit{
		width: 100%;
		height: 100%;
		.result{
			position: fixed;
			height: 220/@r;
			width: 100%;
			padding-top: 20/@r;
			box-sizing: border-box;
			z-index: 99;
			background: #F6F9F9;
			.round{
				width: 118/@r;
				height: 118/@r;
				border-radius: 50%;
				background: #66BD5C;
				border: 6px solid #FFFFFF;
				box-shadow: 0 2px 4px 0 rgba(255,94,47,0.20);
				margin: 0 auto;
				line-height: 106/@r;
				text-align: center;
				color: #fff;
				box-sizing: border-box;
			}
			.round_text{
				padding-top: 15/@r;
				width: 100%;
				height: 28/@r;
				line-height: 28/@r;
				padding-bottom: 20/@r;
				text-align: center;
				font-weight: 700;
				color: #222;
			}
			.round_content{
				height: 20/@r;
				width: 100%;
				text-indent: 2em;
				color: #666;
				line-height: 20/@r;
				padding-bottom: 16/@r;
			}
		}
		.result_list{
			position: absolute;
			top: 0;
			left: 0;
			padding: 239/@r 0 104/@r 18/@r;
			width: 100%;
			box-sizing: border-box;
			z-index: 10;
			background: #F6F9F9;
			.result_item{
				float: left;
				width: 42/@r;
				height: 42/@r;
				border-radius: 50%;
				line-height: 42/@r;
				text-align: center;
				color: #fff;
				background: #1B4551;
				margin: 8/@r 13/@r;
			}
			.false{
				background: #FF5E3B;
			}
		}
		.back{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 104/@r;
			padding: 30/@r 27/@r;
			box-sizing: border-box;
			background: #F6F9F9;
			z-index: 99;
			.back_btn{
				width: 100%;
				height: 100%;
				text-align: center;
				line-height: 44/@r;
				color: #fff;
				border-radius: 22/@r;
				background: #1B4551;
				border: 1px solid #0D2B34;
				box-sizing: border-box;
			}
		}
	}
}
</style>