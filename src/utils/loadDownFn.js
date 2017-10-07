export function $loadDownFn(obj,callback){
    this.slider = obj;
    //初始化
    this.init = function(child,number,direction){
        this.slider.addEventListener('touchstart',this.events,false);
    };
    this.events = {
        slider: this.slider,
        state: false,
        handleEvent:function(event){
            // console.log(event)
            if(event.type == 'touchstart'){
                this.start(event);
            }else if(event.type == 'touchmove'){
                this.move(event);
            }else if(event.type == 'touchend'){
                this.end(event);
            }
        },//滑动开始
        start:function(){
            if (this.state) {return false;}
            var getScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var getVisibleHeight = window.screen.availHeight;
            var getScrollHeight = document.documentElement.scrollHeight;
            if (getVisibleHeight + getScrollTop + getVisibleHeight * 0.4 >= getScrollHeight) {
                callback();
                this.state = true;
            }
            this.slider.addEventListener('touchmove',this,false);
            this.slider.addEventListener('touchend',this,false);
        },//移动
        move:function(event){//当屏幕有多个touch或者页面被缩放过，就不执行move操作
            var getScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var getVisibleHeight = window.screen.availHeight;
            var getScrollHeight = document.documentElement.scrollHeight;
            if (getVisibleHeight + getScrollTop + getVisibleHeight * 0.4 >= getScrollHeight) {
                if (!this.state) {
                    callback();
                    this.state = true;
                }
            }
        },//滑动释放
        end:function(event){
            var getScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var getVisibleHeight = window.screen.availHeight;
            var getScrollHeight = document.documentElement.scrollHeight;
            if (getVisibleHeight + getScrollTop + getVisibleHeight * 0.4 >= getScrollHeight) {
                if (!this.state) {
                    callback();
                    this.state = true;
                }
            }
            //解绑事件
            this.slider.removeEventListener('touchmove',this,false);
            this.slider.removeEventListener('touchend',this,false);
        },
    };
}


