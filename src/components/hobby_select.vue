<template>
	<div style="height: 100%">
		<div class="new4" >
			<p class="msg fontSize_24">
	  			悄悄告诉我，你的兴趣爱好！	
		  	</p>
		  	<swiper :options="swiperOption" class="label_box">
				<swiper-slide class="label_list">
					<div class="label fontSize_16" v-for="(item, index) in labelpart1" @click="addActive($event, index, 1)" isClick="0" :labelId="item.Id" :class="{'bgFF5E3B':parseInt(index/6) == 0 && item.select,'bgFF862B':parseInt(index/6) == 1 && item.select,'bg66BD5C':parseInt(index/6) == 2 && item.select}" >
						{{item.hobby}}
					</div>
				</swiper-slide>
				<swiper-slide class="label_list">
					<div class="label fontSize_16" v-for="(item, index) in labelpart2" @click="addActive($event, index, 2)" isClick="0" :labelId="item.Id" :class="{'bgFF5E3B':parseInt(index/6) == 0 && item.select,'bgFF862B':parseInt(index/6) == 1 && item.select,'bg66BD5C':parseInt(index/6) == 2 && item.select}">
						{{item.hobby}}
					</div>
				</swiper-slide>
			  	<div class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>
		  	</swiper>
		</div>
	</div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
const ERR_OK = 0;
export default {
	name: 'hobby',
	props: {
		chooseLabel: {
			type: Array
		}
	},
	data () {
		return {
			labelpart1: [],
			labelpart2: [],
			labelIndex: 0,
			labelSwiper: {},
			swiperOption: {
				setWrapperSize :true,
				pagination : '.swiper-pagination',
				observer:true,
				observeParents:true
			},
		}
	},
	created(){
		this.$http.get('/api/hobbys').then((response) => {
			response = response.body;
			if(response.errno === ERR_OK){
				let allLabel = response.data;
				this.labelpart1 = allLabel.slice(0, 18);
				this.labelpart2 = allLabel.slice(18, 36);
			}
		});
	},
	methods: {
		addActive(enent, index ,type){
			if (type == 2) {
				if (this.chooseLabel.length >= 6) {
					if(this.labelpart2[index].select == true){
						this.labelpart2[index].select = false;
					}else{
						alert("最多选择6个爱好");
					}
					
				} else{
					this.labelpart2[index].select = !this.labelpart2[index].select;
				}
				this.labelpart2.push.apply(this.labelpart2);
			} else if(type == 1){
				if (this.chooseLabel.length >= 6) {
					if(this.labelpart1[index].select == true){
						this.labelpart1[index].select = false;
					}else{
						alert("最多选择6个爱好");
					}
				} else{
					this.labelpart1[index].select = !this.labelpart1[index].select;
				}
				this.labelpart1.push.apply(this.labelpart1);
			}
			this.chooseLabel.splice(0, this.chooseLabel.length);
			for (var i = 0; i < this.labelpart2.length; i++) {
				if (this.labelpart2[i].select) {
					this.chooseLabel.push(this.labelpart2[i])
				}
			}
			for (var i = 0; i < this.labelpart1.length; i++) {
				if (this.labelpart1[i].select) {
					this.chooseLabel.push(this.labelpart1[i])
				}
			}
		}
	},
	components: {
		swiper,
	    swiperSlide
	}
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
/*@import '../common/css/swiper.min.css';*/
.new4 {
	width: 100%;
	height: 100%;
	background: url('../source/img/im_cloud.svg') left bottom no-repeat,
            linear-gradient(-180deg, #FFFFFF 0%, #FFFFFF 100%) center bottom no-repeat,
            linear-gradient(-180deg, #EEAD92 0%, #6018DC 100%) no-repeat;
	background-size: 100%,90% 90%,100% 99%;
}
.new4 .msg {
  position: absolute;
  top: 0.53333333rem;
  left: 0.66666667rem;
  color: #fff;
  text-shadow: 5px 2px 6px #8F7221;
  line-height: 1.1;
}
.new4 .label_box {
  position: absolute;
  left: 0.8rem;
  top: 2.13333333rem;
  width: 8.66666667rem;
  height: 9.68rem;
  overflow: hidden;
}
.new4 .label_box .label_list {
  float: left;
  width: 8.48rem;
  height: 9.68rem;
}
.new4 .label_box .label_list .label {
  float: left;
  width: 2.4rem;
  height: 1.06666667rem;
  border-radius: 0.53333333rem;
  line-height: 1.01333333rem;
  margin: 0.4rem 0.16rem 0 0.24rem;
  border: 1px solid #FF5E3B;
  box-sizing: border-box;
  text-align: center;
  color: #FF5E3B;
  font-weight: 700;
}
.new4 .label_box .label_list .bgFF5E3B {
	background-color: #FF5E3B;
	color: #fff;
}
.new4 .label_box .label_list .label:nth-child(n+7).bgFF862B {
	background-color: #FF862B;
	color: #fff;
}
.new4 .label_box .label_list .label:nth-child(n+13).bg66BD5C {
	background-color: #66BD5C;
	color: #fff;
}
.new4 .label_box .label_list .label:nth-child(n+7) {
  border: 1px solid #FF862B;
  color: #FF862B;
}
.new4 .label_box .label_list .label:nth-child(n+13) {
  border: 1px solid #66BD5C;
  color: #66BD5C;
}
.new4 .label_box .label_list .active1 {
  border: 1px solid #FF5E3B;
  background-color: #FF5E3B !important;
  color: #fff !important;
}
.new4 .label_box .label_list .active2 {
  border: 1px solid #FF862B;
  background-color: #FF862B !important;
  color: #fff !important;
}
.new4 .label_box .label_list .active3 {
  border: 1px solid #66BD5C;
  background-color: #66BD5C !important;
  color: #fff !important;
}
.new4 .label_box .list_num {
  position: absolute;
  top: 8.53333333rem;
}
/*.new4 .label_box .list_num .swiper-pagination-bullet {
  display: inline-block;
  width: 0.26666667rem;
  height: 0.26666667rem;
  background-color: red;
}
.new4 .label_box .list_num .swiper-pagination-bullet-active {
  background-color: #ff522f;
  border: 1px solid #ff522f;
}*/
</style>
