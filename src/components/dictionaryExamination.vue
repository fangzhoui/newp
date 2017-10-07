<template>
	<div class="examination">
		<ul class="question_list">
			<li class="question_wrap" v-for="(item, index) in moduleList" :class="{'card1': index == showId, 'card2': index == showId+1, 'fide': item.show}">
				<div class="titleItem_text fontSize_18">{{index + 1}}.&nbsp{{item.Question}}</div>
				<div class="option" v-for="(option, index1) in item.options" :class="{'choice': choiceItem === index1 + 1}" @click="isClick($event, index1)">
					<span class="optionA fontSize_20">{{ index1 | optionA }}</span>
					<span class="option_text fontSize_16">{{ option }}</span>
				</div>
			</li>
		</ul>
		<div class="next_wrap">
			<span class="prev fontSize_16" :class="{'prohibit': showId == 0}" @click="prev">上一题</span>
			<span class="prev next fontSize_16" :class="{'last': showId == moduleList.length-1}" @click="next">{{text}}</span>
		</div>
	</div>
</template>

<script>
const ERR_OK = 0;
export default {
	name: 'examination',
	data(){
		return{
			showId: 0,
			text: '下一题',
			choiceList: [],
			choiceItem: null,
			nosendchoiceItem: null,
			moduleList: []
		}
	},
	created(){
		this.load();
		this.$http.get('/api/questions').then((response) => {
			response = response.body;
			if(response.errno == ERR_OK){
				this.moduleList = response.data;
				
				this.moduleList.forEach((item)=>{
					item.show = false;
					item.answer = 10;
				});
				if(this.moduleList.length == 1){
					this.text = '提交'
				}
			}
		});	
	},
	watch: {
        "$route": "load",
    },
	methods: {
		load: function(){
        },
		isClick(option, index){
			this.choiceItem = index + 1;
		},
		prev(){
			if(this.showId >= 1){
				if(this.showId == this.moduleList.length - 1){
					this.text = '下一题';
				}
				this.showId--
				this.moduleList[this.showId].show = false;
				if(this.choiceItem && this.showId == this.choiceList.length - 1){
					this.nosendchoiceItem = this.choiceItem;
				}
				this.choiceItem = this.moduleList[this.showId].answer;
			}
		},
		next(){
			let a = {};
			// 提交
			if(this.showId < this.moduleList.length - 1){ //不是最后一题
				if(this.choiceItem){
					this.moduleList[this.showId].answer = this.choiceItem;
					this.choiceItem = null;
					this.moduleList[this.showId].show = true;
					this.showId++;
					// 获取
					if(this.moduleList[this.showId].answer != 10){
						this.choiceItem = this.moduleList[this.showId].answer;
					}
				}else{
					alert('请至少选择其中一项');
				}
				if(this.showId == this.moduleList.length - 1){
					this.text = '提交';
				}
			}else{   //最后一题
				if(this.choiceItem){
					this.moduleList[this.showId].answer = this.choiceItem;
					this.choiceItem = null;
					this.moduleList[this.showId].show = true;
					this.$emit('SUBMIT', this.moduleList);
					this.$router.push({path: '/dictionary/submitPage', query: {title: '得分情况', part: 'submitPage'}});
				}else{
					alert('请至少选择其中一项');
				}
			}
		}
	},
	filters: {
		optionA(data){
			if(data == 0){
				return 'A'
			}else if(data == 1){
				return 'B'
			}else if(data == 2){
				return 'C'
			}else if(data == 3){
				return 'D'
			}
		}
	},
	components: {
	}
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@r:37.5rem;
.examination{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	background: #F6F9F9;
	padding-top: 20/@r;
	.question_list{
		position: relative;
		width: 100%;
		height: 100%;
		transform: translate3d();
		.question_wrap{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			padding-bottom: 72/@r;
			background: #F6F9F9;
			display: none;
			transition: all ease .5s;
			.titleItem_text{
				width: 100%;
				padding: 25/@r 15/@r 20/@r;
				margin-bottom: 20/@r;
				box-sizing: border-box;
				background: #FFFFFF;
				border: 1px solid #F0F0F0;
				box-shadow: 0 0 14px 0 rgba(0,0,0,0.10);
				line-height: 22/@r;
				&:before{
					content: '单选题';
					font-size: 14px;
					color: #fff;
					text-align: center;
					line-height: 22/@r;
					display: block;
					position: absolute;
					top: -11/@r;
					left: 0;
					width: 77/@r;
					height: 22/@r;
					background: #1B4551;
					box-shadow: 0 2px 4px 0 rgba(27,69,81,0.30);
					border-radius: 0 11/@r 11/@r 0;
				}
			}
			.option{
				width: 345/@r;
				padding: 20/@r;
				box-sizing: border-box;
				background: #FFFFFF;
				border: 5px solid #F0F0F0;
				border-radius: 4px;
				margin: 0 auto 10/@r;
				display: flex;
				.optionA{
					flex: 0 0 14/@r;
					line-height: 28/@r;
					padding-right: 20/@r;
					box-sizing: border-box;
				}
				.option_text{
					flex: 1;
					line-height: 22/@r;
					box-sizing: border-box;
				}
			}
			.choice{
				border: 5px solid #1B4551;
				box-shadow: 0 2px 4px 0 rgba(27,69,81,0.30);
			}
		}
		.card1{
			display: block;
			transform: scale(1);
			z-index: 10;
			opacity: 1;
		}
		.card2{
			display: block;
			transform: scale(0.7);
			z-index: 1;
			opacity: 0;
		}
		.fide{
			z-index: 20;
			display: block;
			opacity: 1;
			transition: all ease 1.4s;
			transform: translate(-500%, 0);
		}
	}
	.next_wrap{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 72/@r;
		background: #fff;
		padding: 14/@r 20/@r;
		box-shadow: 0 -1px 2px 0 rgba(0,0,0,0.10);
		box-sizing: border-box;
		z-index: 999;
		.prev{
			display: inline-block;
			width: 154/@r;
			height: 44/@r;
			border: 3px solid #1B4551;
			border-radius: 43/@r;
			box-sizing: border-box;
			line-height: 38/@r;
			text-align: center;
			color: #1B4551;
		}
		.next{
			margin-left: 26/@r;
			background: #1B4551;
			color: #fff;
		}
		.prohibit{
			border: 3px solid #999;
			color: #999;
		}
		.last{
			border: 3px solid #FF5E3B;
			background: #FF5E3B;
		}
	}
}
</style>
