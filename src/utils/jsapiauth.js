export default {
 	install(Vue) {
	    Vue.prototype.jsapi = function (callback) {
	    	this.userConfig = {};
	    	this.userConfig.openId = this.getQueryString("openId");
	    	this.$http.post('/jsapi',{url: document.location.href}).then((response) => {
	    		response = response.body;
		        var jsApiList = ['device.geolocation.get',
		        	'device.base.getUUID',
					'device.base.getInterface',
					'device.launcher.checkInstalledApps',
					'device.launcher.launchApp',
					'biz.util.open',
					'biz.util.share',
					'biz.contact.choose',
					'biz.user.get',
					'biz.util.uploadImage',
					'biz.ding.post',
					'biz.telephone.call',
					'biz.telephone.showCallMenu',
					'biz.chat.chooseConversation',
					'biz.contact.createGroup',
					'biz.map.locate',
					'biz.map.search',
					'biz.map.view',
					'device.geolocation.openGps',
					'biz.util.uploadImageFromCamera',
					'biz.customContact.multipleChoose',
					'biz.customContact.choose',
					'biz.contact.complexPicker',
					'biz.contact.departmentsPicker',
					'biz.contact.setRule',
					'biz.contact.externalComplexPicker',
					'biz.contact.externalEditForm',
					'biz.chat.pickConversation',
					'biz.chat.chooseConversationByCorpId',
					'biz.chat.openSingleChat',
					'biz.chat.toConversation',
					'biz.cspace.saveFile',
					'biz.cspace.preview',
					'biz.cspace.chooseSpaceDir',
					'biz.util.uploadAttachment',
					'biz.clipboardData.setData',
					'biz.intent.fetchData',
					'biz.chat.locationChatMessage',
					'device.audio.startRecord',
					'device.audio.stopRecord',
					'device.audio.onRecordEnd',
					'device.audio.download',
					'device.audio.play',
					'device.audio.pause',
					'device.audio.resume',
					'device.audio.stop',
					'device.audio.onPlayEnd',
					'device.audio.translateVoice',
					'biz.util.fetchImageData',
					'biz.alipay.auth',
					'biz.alipay.pay',
					'device.nfc.nfcWrite',
					'biz.util.encrypt',
					'biz.util.decrypt',
					'runtime.permission.requestOperateAuthCode',
					'biz.util.scanCard']
				this.userConfig.agentId = response.agentId;
				this.userConfig.openId = response.corpId;
				dd.config({
				    agentId: response.agentId,
				    corpId: response.corpId,
				    timeStamp: response.timeStamp,
				    nonceStr: response.nonceStr,
				    signature: response.signature,
				    type: 0,
				    jsApiList : jsApiList
				});
				dd.ready(function(){
					callback();
			    })
            });
	    }

	    Vue.prototype.getQueryString = function (name) {
	    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
			var r = window.location.search.substr(1).match(reg); 
			if (r != null) {
				return unescape(r[2])
			}else{
				return null;
			}
	    }
	}
}
