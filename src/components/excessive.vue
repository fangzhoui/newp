<template>
<div class="excessive">
	<div class="send_suc">
		<div class="icon"></div>
		<div class="text fontSize_18">发送成功</div>
	</div>
	<div class="my_analysis" @click="setData">
		<div class="send fontSize_16">进入下一环节</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'excessive',
	data () {
		return {

		}
	},
	methods:{
		setData(){
			this.$emit('setOk');
			this.$router.push({ path: '/dictionary', query: {part: 'dictionary', title: '乐新人'}})
		}
	}
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@r:37.5rem;
.excessive{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	padding-top: 100/@r;
	box-sizing: border-box;
	background-color: #fff;
	z-index: 100;
	.send_suc{
		width: 100%;
		height: 130/@r;
		text-align: center;
		margin-bottom: 55/@r;
		.icon{
			background-image: url('../source/images/icon_finish_max.svg');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			width: 90/@r;
			height: 90/@r;
			margin: 0 auto;
		}
		.text{
			margin-top: 15/@r;
			line-height: 25/@r;
			color: #222;
			font-weight: 700;
		}
	}
	.my_analysis{
		width: 100%;
		height: 74/@r;
		padding: 15/@r 28/@r;
		box-sizing: border-box;
		.send{
			width: 100%;
			height: 100%;
			margin: 0 auto;
			line-height: 44/@r;
			text-align: center;
			background-image: linear-gradient(90deg, #FFCA3D 0%, #FF5E3B 100%);
			box-shadow: 0 4/@r 3/@r 0 rgba(255,94,47,0.50);
			color: #fff;
		}
	}
}
</style>