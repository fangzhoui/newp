_yanzheng() {
	this.$http.get('http://172.16.12.210:3001/newtask/jsapi').then((response) => {
		response = response.body;
		var jsApiList = ['runtime.info',
			'biz.contact.choose',
			'biz.ding.post',
			'device.geolocation.get',
			'biz.map.locate',
			'biz.map.view',
			'biz.map.locate',
			'biz.user.get',
			'biz.util.uploadImage',
			'biz.util.uploadImageFromCamera',
			'biz.util.share',
			'biz.contact.complexPicker',
			'biz.chat.pickConversation',
			'biz.util.datepicker',
			'biz.util.chosen',
			'device.notification.showPreloader',
			'device.notification.hidePreloader'
		]
		dd.config({
			// agentId: response.agentId,
			agentId: 113938502,
			corpId: response.corpId,
			timeStamp: response.timeStamp,
			nonceStr: response.nonceStr,
			signature: response.signature,
			type: 0,
			jsApiList: jsApiList
		});
		dd.ready(function() {});
		dd.error(function(err) {
			// alert(JSON.stringify(err))
			// alert("出错了")
		})
	});
}
_yanzheng()