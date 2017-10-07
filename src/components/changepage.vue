<template>
	<div class="wrap_up">
		<div class="icon_swipeup" @click="change"></div>
	</div>
</template>

<script>
export default {
	name: 'changepage',
	data () {
		return {

		}
	},
	methods: {
		change(){
			this.$emit('change')
		}
	}
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@r:37.5rem;
.wrap_up{
	position: absolute;
	bottom: 0;
	left: 0;
	height: 71/@r;
	width: 375/@r;
	padding: 0 160/@r 44/@r;
	box-sizing: border-box;
	animation:mymove 3s infinite;
	-moz-animation:mymove 3s infinite; /* Firefox */
	-webkit-animation:mymove 3s infinite; /* Safari and Chrome */
	-o-animation:mymove 3s infinite; /* Opera */
	.icon_swipeup{
		background-image: url('../source/images/icon_swipeup.svg');
		background-repeat: no-repeat;
		background-size: 100%;
		height: 27/@r;
		width: 100%;
	}
}
@keyframes mymove
{
	0%   {bottom:0/@r; opacity: 0}
	50%  {bottom:10/@r; opacity: .5}
	100% {bottom:0/@r; opacity: 0}
}

@-moz-keyframes mymove /* Firefox */
{
	0%   {bottom:0/@r; opacity: 0}
	50%  {bottom:10/@r; opacity: .5}
	100% {bottom:0/@r; opacity: 0}
}

@-webkit-keyframes mymove /* Safari and Chrome */
{
	0%   {bottom:0/@r; opacity: 0}
	50%  {bottom:10/@r; opacity: .5}
	100% {bottom:0/@r; opacity: 0}
}

@-o-keyframes mymove /* Opera */
{
	0%   {bottom:0/@r; opacity: 0}
	25%  {bottom:10/@r; opacity: .5}
	100% {bottom:0/@r; opacity: 0}
}

</style>
