
import Cropper from 'cropperjs'
import EXIF from 'exif-js'


export default {
  install(Vue) {
    //外部接口，用于input['file']对象change时的调用
    Vue.prototype.clip = function(e, opt) {
        this.fileObj = e.srcElement;
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return false; //不是图片直接返回
        //调用初始化方法
        this.createElement();
        this.initilize(opt);

        //获取图片文件资源
        // this.picValue = files[0];
        //去获取拍照时的信息，解决拍出来的照片旋转问题
        // var fff = files[0];
        // var reader = new FileReader();
        // reader.readAsDataURL(fff);
        // reader.onload = function () {
        //   var result = this.result;
          
          // EXIF.getData(files, function() {
          //   self.Orientation = EXIF.getTag(this, 'Orientation');
          //   console.log(self.Orientation)
          //   // self.compress(self.preview, self.Orientation);
          // });
        // }
        // console.log(files, '222')
          //调用方法转成url格式

        this.originUrl = this.getObjectURL(files[0]);
        //每次替换图片要重新得到新的url
        if (this.cropper) {
            this.cropper.replace(this.originUrl);
        }
    }

    //创建一些必要的DOM，用于图片裁剪
    Vue.prototype.createElement = function() {
        //初始化图片为空对象
        this.preview = null;
        let str = '<div><img id="clip_image"></div><button type="button" id="cancel_clip">取消</button><button type="button" id="clip_button">确定</button>';
        str += '<div class="crop_loading"><div class="crop_content"><img src="../../static/loading.gif"><div class="crop_text">图片上传中</div></div></div>';
        str += '<div class="crop_success"><div class="crop_success_text">上传成功</div></div></div>';

        let body = document.getElementsByTagName('body')[0];
        this.reagion = document.createElement('div');
        this.reagion.id = 'clip_container';
        this.reagion.className = 'container';
        this.reagion.innerHTML = str;
        // 添加创建好的DOM元素
        body.appendChild(this.reagion);
        this.preview = document.getElementById('clip_image');
        // 绑定一些方法
        this.initFunction();
    }

    //初始化一些函数绑定
    Vue.prototype.initFunction = function() {
        let self = this;
        this.clickBtn = document.getElementById('clip_button');
        this.cancelBtn = document.getElementById('cancel_clip');
        //确定事件
        this.addEvent(this.clickBtn, 'click', function() {
            self.crop();
        })
        //取消事件
        this.addEvent(this.cancelBtn, 'click', function() {
            self.destoried();
        })
        //清空input的值
        this.addEvent(this.fileObj, 'click', function() {
            this.value = '';
        })
    }

    //初始化裁剪对象
    Vue.prototype.initilize = function(opt) {
        // 初始化裁剪对象
        this.cropper = new Cropper(this.preview, {
            aspectRatio: opt.aspectRatio ? opt.aspectRatio : 1,
            viewMode: 1,
            background: false,
            zoomable: false,
            center: false
        });
    }
    
    //图片转码方法
    Vue.prototype.getObjectURL = function(file) {
        let url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
    
    //点击确定进行裁剪
    Vue.prototype.crop = function() {
        let self = this;
        let image = new Image();
        let croppedCanvas;
        let roundedCanvas;
        // Crop
        croppedCanvas = this.cropper.getCroppedCanvas();
        // Round
        roundedCanvas = this.getRoundedCanvas(croppedCanvas);
        let imgData = roundedCanvas.toDataURL();
        image.src = imgData;
        //判断图片是否大于100k,不大于直接上传，反之压缩
        if (imgData.length < (100 * 1024)) {
            // this.uploadCallback(imgData)
            this.postImg(imgData);
        } else {
            image.onload = function() {
                //压缩处理
                let data = self.compress(image);
                // self.uploadCallback(data)
                self.postImg(data);
            }
        }
    }

    //获取裁剪图片资源
    Vue.prototype.getRoundedCanvas = function(sourceCanvas) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let width = sourceCanvas.width;
        let height = sourceCanvas.height;
        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        context.rect(0, 0, width, height);
        context.fill();
        return canvas;
    }

    //图片上传
    Vue.prototype.postImg = function(data) {
        let self = this;
        // this.destoried();
        document.querySelector('.crop_loading').style.display = 'block';
        // window.setTimeout(function() {
        //     document.querySelector('.crop_loading').style.display = 'none';
        //     document.querySelector('.crop_success').style.display = 'block';
        //     //裁剪完后摧毁对象
        //     self.destoried();
        // }, 3000)        
        let type = data.split(":")[1].split(";")[0];
        let extension = type.split('/')[1];
        var text = window.atob(data.split(",")[1]); // base64解码
        var buffer = new ArrayBuffer(text.length); // 不能访问的内存
        var ubuffer = new Uint8Array(buffer); // 8位无符号整数值的类型化数组
        for (var i = 0; i < text.length; i++) {
            ubuffer[i] = text.charCodeAt(i); // 字符的 Unicode 编码
        }
        var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
        var blob;
        if (Builder) {
            var builder = new Builder();
            builder.append(buffer);
            blob = builder.getBlob(type);
        } else {
            blob = new window.Blob([buffer], {type: type});
        }
        var _self = this;
        setTimeout(function(){
            _self.uploadCallback(data)
            _self.destoried();
        },1000)
        

        // this.$http.post('/album/auth', {extension: extension}).then((response) => {
        //     response = response.body;
        //     var request = new FormData();
        //     request.append('OSSAccessKeyId', response.accessid);
        //     request.append('policy', response.policy);
        //     request.append('signature', response.signature);
        //     request.append('key', response.dir);
        //     request.append('callback', response.callback);
        //     request.append('expire', response.expire);
        //     request.append('file', blob);
        //     request.append('success_action_status', "200");
        //     this.$http.post(response.host, request, {processData: false, cache: false, async: false, contentType: false,}).then((response) => {
        //                         
        //         // return response;
        //     });
        // });
    }

    //图片压缩
    Vue.prototype.compress = function(img, Orientation) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');
        //瓦片canvas
        let tCanvas = document.createElement("canvas");
        let tctx = tCanvas.getContext("2d");
        let initSize = img.src.length;
        let width = img.width;
        let height = img.height;
        // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        let ratio;
        if ((ratio = width * height / 4000000) > 1) {
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
        } else {
            ratio = 1;
        }
        canvas.width = width;
        canvas.height = height;
        //铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //如果图片像素大于100万则使用瓦片绘制
        let count;
        if ((count = width * height / 1000000) > 1) {
            count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
            // 计算每块瓦片的宽和高
            let nw = ~~(width / count);
            let nh = ~~(height / count);
            tCanvas.width = nw;
            tCanvas.height = nh;
            for (let i = 0; i < count; i++) {
                for (let j = 0; j < count; j++) {
                    tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                }
            }
        } else {
            ctx.drawImage(img, 0, 0, width, height);
        }
        // //修复ios上传图片的时候 被旋转的问题
        // if (Orientation != "" && Orientation != 1) {
        //     switch (Orientation) {
        //         case 6: //需要顺时针（向左）90度旋转
        //             this.rotateImg(img, 'left', canvas);
        //             break;
        //         case 8: //需要逆时针（向右）90度旋转
        //             this.rotateImg(img, 'right', canvas);
        //             break;
        //         case 3: //需要180度旋转
        //             this.rotateImg(img, 'right', canvas); //转两次
        //             this.rotateImg(img, 'right', canvas);
        //             break;
        //     }
        // }
        //进行最小压缩
        let ndata = canvas.toDataURL('image/jpeg', 0.5);
        console.log('压缩前：' + initSize);
        console.log('压缩后：' + ndata.length);
        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
        return ndata;
    }

    //图片旋转
    Vue.prototype.rotateImg = function(img, direction, canvas) {
        //最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0;
        const max_step = 3;
        if (img == null) return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = img.height;
        let width = img.width;
        let step = 2;
        if (step == null) {
            step = min_step;
        }
        if (direction == 'right') {
            step++;
            //旋转到原位置，即超过最大值
            step > max_step && (step = min_step);
        } else {
            step--;
            step < min_step && (step = max_step);
        }
        //旋转角度以弧度值为参数
        let degree = step * 90 * Math.PI / 180;
        let ctx = canvas.getContext('2d');
        switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
        }
    }

    Vue.prototype.baseStr = function() {
        return data;
    }

    //销毁原来的对象
    Vue.prototype.destoried = function() {
        // let self = this;
        // //移除事件
        // this.removeEvent(this.clickBtn, 'click', null);
        // this.removeEvent(this.cancelBtn, 'click', null);
        // this.removeEvent(this.fileObj, 'click', null);
        //移除裁剪框
        this.reagion.parentNode.removeChild(this.reagion);
        //销毁裁剪对象
        // this.cropper.destroy();
        this.cropper = null;
    }

    //添加事件
    Vue.prototype.addEvent = function(obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        } else {
            obj.attachEvent('on' + type, fn);
        }
    }

    //移除事件
    Vue.prototype.removeEvent = function(obj, type, fn) {
        if (obj.removeEventListener) {
            obj.removeEventListener(type, fn, false);
        } else {
            obj.detachEvent('on' + type, fn);
        }
    }

  }
}