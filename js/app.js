/**
 * Created by Administrator on 2016/9/24.
 */
requirejs.config({
    baseUrl:"js/",//配置基础路径；
  paths:{
        z:"zepto.min",//起别名
        zT:'zepto-touch',
       iP:'iscroll-probe'
   }
});
requirejs(['z','zT','iP'],function($) {

        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);//阻止浏览器的默认行为

        var myScroll = new IScroll(".container", {
            /*scrollbars:true,//滚动条
             mouseWheel:false,//滚轮是否开启
             interactiveScrollbars:true,//是否可拖拽滚动条
             shrinkScrollbars:"scale",//滚动条有弹性
             bounce:true,//网页的反弹
             startY:0,//设置初始滚动位置
             scrollX:false,//默认值,设置水平不滚动
             scrollY:true,//默认值,设置垂直默认滚动*/
            probeType: 1,//1滚动不繁忙时触发，2表示隔一段时间出发，3表示每一像素触发
            click: true//让a连接跳转有效
        });

        var webScrollObj = {
            appendNode: $('.append'),
            loadNode: $('.reload'),
            reLoadBool: false,
            appendBool: false
        };

        myScroll.on("scroll", function () {
            var loadAppendHeight = webScrollObj.loadNode.height();//得到加载更多的高度
            console.log(this.y, loadAppendHeight, this.wrapperHeight, this.maxScrollY);//this.y滚去的距离;//this.wrapperHeight可视区域;this.maxScrollY可以滚动的最大高度
            if (this.y > loadAppendHeight)//刷新
            {
                webScrollObj.loadNode.text('松开刷新');
                webScrollObj.reLoadBool = true;
            }
            else if (this.y - this.maxScrollY < -loadAppendHeight)//加载更多
            {
                //console.log(11);
                webScrollObj.appendNode.text('松开加载');
                webScrollObj.appendBool = true;
            }

            if (this.maxScrollY == 0) {//判断是否现实加载更多的文字
                webScrollObj.appendNode.hide();
            }
            else {
                webScrollObj.appendNode.show();
            }

        });


        myScroll.on("scrollEnd", function () {
            if (webScrollObj.reLoadBool) {//下拉刷新
                window.location.reload();
            }

            var that = this;
            if (webScrollObj.appendBool) {//加载更多，请求ajax
                webScrollObj.appendBool = false;//进入bool值为false；
                $.ajax({
                    type: "get",
                    url: "json/json.json",
                    dataType: 'json',
                    success: function (arr) {
                        var ul = $('<ul/>');//创建ul
                        for (var i in arr) {
                            var li = $("<li/>");//创建li
                            li.text(arr[i].a);
                            ul.append(li);
                        }
                        $('#list').append(ul.html());
                        ul = null;
                        webScrollObj.appendNode.text('更多加载');
                        that.refresh();//（更新）重新计算滚动高度。
                    },
                    error: function (a, b, c) {
                        alert("请求有误，稍后重试");
                    }
                });
            }

        });

});


















