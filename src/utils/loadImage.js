export function $looploadImage (imglist,objlist){
    var x = -1;
    $loopArrayImage();
    $loopArrayImage();
    $loopArrayImage();
    function $loopArrayImage() {
        x++;
        if (x < imglist.length || x < objlist.length) {
            //  alert("123123")
        } else {
            return false;
        }
        $loadImage(imglist[x], objlist[x])
        .then(function(data){
            $loopArrayImage(x);
        })
    }
}

export function $loadImage (url, obj, fun) {
    var p = new Promise(function(resolve, reject){
        let img = new Image();
        img.src = url;
        img.onload = function() {
            var el = obj.getElementsByTagName("img")[0];
            if (el) {
                el.parentNode.removeChild(el);
            }
            img.onload = null;
            obj.appendChild(img)
            var parent = getSize(obj);
            var fwidth = parent.width;
            var fheight = parent.height;
            var iwidth = img.width;
            var iheight = img.height;
            if (fwidth / fheight > iwidth / iheight) {
                img.style.width = fwidth+"px";
                iheight = fwidth * iheight / iwidth;
                var tem = (fheight - iheight) / 2;
                img.style.marginTop = tem + "px";
            } else {
                img.style.height = fheight+"px";
                iwidth = fheight * iwidth / iheight;
                var tem = (fwidth - iwidth) / 2;
                img.style.marginLeft = tem + "px";
            }
            resolve(true);
            if (fun) {
                fun();
            }
        }
    });
    return p;
}



//判断对象类型
function getType(o){
    var _t;
    return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
}
//获取元素样式
function getStyle(el, styleName) {
    return el.style[styleName] ? el.style[styleName] : el.currentStyle ? el.currentStyle[styleName] : window.getComputedStyle(el, null)[styleName];
}
function getStyleNum(el, styleName) {
    return parseInt(getStyle(el, styleName).replace(/px|pt|em/ig,''));
}
function setStyle(el, obj){
    if (getType(obj) == "object") {
        for (s in obj) {
            var cssArrt = s.split("-");
            for (var i = 1; i < cssArrt.length; i++) {
             cssArrt[i] = cssArrt[i].replace(cssArrt[i].charAt(0), cssArrt[i].charAt(0).toUpperCase());
            }
            var cssArrtnew = cssArrt.join("");
            el.style[cssArrtnew] = obj[s];
        }
    } else if (getType(obj) == "string") {
        el.style.cssText = obj;
    }
}
function getSize(el) {
    if (getStyle(el, "display") != "none") {
        return { width: el.offsetWidth || getStyleNum(el, "width"), height: el.offsetHeight || getStyleNum(el, "height") };
    }
    var _addCss = { display: "", position: "absolute", visibility: 'hidden' };
    var _oldCss = {};
    for (i in _addCss) {
        _oldCss[i] = getStyle(el, i);
    }
    setStyle(el, _addCss);
    var _width = el.clientWidth || getStyleNum(el, "width");
    var _height = el.clientHeight || getStyleNum(el, "height");
    for (i in _oldCss) {
        setStyle(el, _oldCss);
    }
    return { width: _width, height: _height };
} 
