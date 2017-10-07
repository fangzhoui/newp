export function $slider_img(obj,callback) {
    this.slider = obj;
    //初始化
    this.init = function(child,index){
        // this.slider.addEventListener('touchstart',this.events,false);
        let childDom = this.slider.getElementsByClassName(child);
        this.events.width = childDom[0].clientWidth;
        console.log("w"+this.events.width)
        this.events.height = childDom[0].clientHeight;
        this.events.length = childDom.length;
        this.events.index = parseInt(index) || 0;
        this.slider.style.transform = "translate("+-this.events.index*this.events.width+"px, 0px)";
        this.slider.addEventListener('touchstart',this.events,false);
        // let self = this;
        // this.slider.addEventListener('webkitTransitionEnd' , function(){
        //     setTimeout(function(){
        //         self.slider.addEventListener('touchstart',self.events,false);
        //     },100);
        // } , false)
    };
    this.events = {
        slider: this.slider,
        state: false,
        width: 0,
        height: 0,
        index: 0,
        length: 0,
        handleEvent:function(event){
            if(event.type == 'touchstart'){
                this.start(event);
            }else if(event.type == 'touchmove'){
                this.move(event);
            }else if(event.type == 'touchend'){
                this.end(event);
            }
        },//滑动开始
        start:function(e){
            e.preventDefault();
            if(e.targetTouches.length > 1 || e.scale && e.scale !== 1) return;
            var touch = e.targetTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个
            var st = window.getComputedStyle(this.slider, null);
            var tr = st.getPropertyValue("-webkit-transform") ||
                        st.getPropertyValue("-moz-transform") ||
                        st.getPropertyValue("-ms-transform") ||
                        st.getPropertyValue("-o-transform") ||
                        st.getPropertyValue("transform") ||
                        "FAIL";
            this.startPos = {
                transformX:tr.split(',')[4],
                x:touch.pageX,
                y:touch.pageY,
                time:+new Date
            };
            this.endPos = {
                x:0,
                y:0
            };
            this.slider.addEventListener('touchmove',this,false);
            this.slider.addEventListener('touchend',this,false);
            this.slider.style.transition = "-webkit-transform 0ms ease-out";
            this.slider.style.transition = "transform 0ms ease-out";
        },//移动
        move:function(e){//当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if(e.targetTouches.length > 1 || e.scale && e.scale !== 1) return;
            e.preventDefault();
            var touch = e.targetTouches[0];
            this.endPos = {
                x:touch.pageX - this.startPos.x,
                y:touch.pageY - this.startPos.y
            };
            var tem = parseFloat(this.endPos.x) + parseFloat(this.startPos.transformX);
            if( touch.pageX < 2 || touch.pageX >= window.screen.availWidth - 2|| touch.pageY < 2 || touch.pageY >= window.screen.availHeight - 2){
                this.slider.removeEventListener('touchmove',this,false);
                this.end();
                return;
            }

            // if (this.endPos.y > 10 || this.endPos.y < -10) {
            //     this.moveend = true;
            //     return false;
            // }
            // if (this.endPos.x > 10 || this.endPos.x < -10) {
            //     this.slider.style.transform = "translate("+tem+"px, 0px)";
            // }
            // this.moveX = tem;

            this.slider.style.transform = "translate("+tem+"px, 0px)";
        },//滑动释放
        end:function(e){
            if (!e || e.targetTouches.length == 0) {
                // console.log(e.targetTouches)
                this.slider.style.transition = "-webkit-transform 250ms ease-out";
                this.slider.style.transition = "transform 250ms ease-out";
                console.log(this.endPos.x)
                if (this.endPos.x < -50 ) {
                    this.index++
                    if (this.index >= this.length) {
                        this.index = this.length - 1;
                        console.log("已经是最后一张了")
                        dd.device.notification.toast({
                            text: "已经是最后一张了",
                            duration: 1,
                        })
                    }
                } else if (this.endPos.x > 50 ){
                    this.index--
                    if (this.index < 0) {
                        this.index = 0
                        console.log("已经是第一张了")
                        dd.device.notification.toast({
                            text: "已经是第一张了",
                            duration: 1,
                        })
                    }
                }
                let moveX= -this.index * this.width;
                this.slider.style.transform = "translate("+moveX+"px, 0px)";
                callback(this.index);
            }
            // if (this.endPos.x != 0) {
            //     this.slider.removeEventListener('touchstart',this,false);
            // }
            this.slider.removeEventListener('touchmove',this,false);
            this.slider.removeEventListener('touchend',this,false);
        },
    };
}
