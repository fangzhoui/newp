/**
 *   
 *   compress{
    
 }

 *   
 *   
 *       cropper 第三方的一个裁剪库
 *       exif    获取图片源信息，解决ios图片旋转的问题
 * */

// data:
// type:
// extension:
// compress:{
//     data:
//     type:
//     extension:
// }
// url
import EXIF from 'exif-js'

export function $compressImg(files,callback){
    var list = [];
    var len = files.length;
    loopCompressImg(0);
    function loopCompressImg(x) {
        startCompress(files[x])
        .then(function(data){
            list.push(data)
            x++;
            if (x < len) {
                loopCompressImg(x);
            } else {
                callback(list)
            }
        })
    }

    function startCompress (file){
        var p = new Promise(function(resolve, reject){
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                var result = this.result;
                var img = new Image();
                img.src = result;
                EXIF.getData(file, function() {
                    var obj = {};
                    obj.data = file;
                    obj.type = file.type;
                    obj.extension = file.type.split('/')[1];
                    var Orientation = EXIF.getTag(this, 'Orientation');

                    if (img.complete) {
                        var data = compress(img, Orientation);
                        obj.url = data;
                        obj.compress = packImg(data);
                        resolve(obj);
                    } else {
                        img.onload = function(){
                            var data = compress(img, Orientation);
                            obj.url = data;
                            obj.compress = packImg(data);
                            resolve(obj);
                        }
                    }
                });
            }
        });
        return p;   
    }

    function packImg(data){
        var type = data.split(":")[1].split(";")[0];
        var extension = type.split('/')[1];
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
        var compressObj = {
            data: blob,
            type: type,
            extension: extension
        }
        return compressObj;
    }
    //图片转码方法
    var getObjectURL = function(file) {
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
    //图片压缩
    var compress = function(img, Orientation) {
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
        //修复ios上传图片的时候 被旋转的问题
        if (Orientation != "" && Orientation != 1) {
            switch (Orientation) {
                case 6: //需要顺时针（向左）90度旋转
                    rotateImg(img, 'left', canvas);
                    break;
                case 8: //需要逆时针（向右）90度旋转
                    rotateImg(img, 'right', canvas);
                    break;
                case 3: //需要180度旋转
                    rotateImg(img, '111', canvas); //转180
                    break;
            }
        }
        //进行最小压缩
        let ndata = canvas.toDataURL('image/jpeg', 0.5);
        console.log('压缩前：' + initSize);
        console.log('压缩后：' + ndata.length);
        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
        return ndata;
    }

    //图片旋转
    var rotateImg = function(img, direction, canvas) {
        //最小与最大旋转方向，图片旋转4次后回到原方向
        if (img == null) return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = img.height;
        let width = img.width;
        let step = 2;
        if (direction == 'right') {
            step = 3;
        } else if (direction == 'left') {
            step = 1;
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
}

