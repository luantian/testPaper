

;(function() {
  window.onload = function() {
    var testPaper = {
      init: function() {
        this.canvas = this.$("#canvas");
        if (!this.canvas.getContext) return alert("您的浏览器不支持 canvas 标签");
        this.setHtmlFont();
        this.setCanvas();
        this.load();
      },
      setHtmlFont() {
        this.dpr = window.devicePixelRatio;
        var scale = 1 / this.dpr;
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        var iWidth = document.documentElement.clientWidth;
        document.getElementsByTagName('html')[0].style.fontSize = iWidth / 16 + 'px';
      },
      GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
      },
      setCanvas() {
        // this.canvas.width = this.GetQueryString('w')*this.dpr;
        // this.canvas.height = this.GetQueryString('h')*this.dpr;
        var width = this.GetQueryString('w');
        var height = this.GetQueryString('h');
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
        this.canvas.height = height * this.dpr;
        this.canvas.width = width * this.dpr;
      },
      $: function(argu) {
        return document.querySelector(argu);
      },
      load: function() {
        // this.x = [];//记录鼠标移动是的X坐标 
        // this.y = [];//记录鼠标移动是的Y坐标 
        // this.clickDrag = [];
        this.step = -1;
        this.stepData = [];
        this.lock = false;//鼠标移动前，判断鼠标是否按下
        this.isEraser = false;
        //this.Timer=null;//橡皮擦启动计时器 
        //this.radius=5; 
        this.storageColor = "#000000";
        // this.eraserRadius = 15;//擦除半径值 
        this.color = ["#000000", "#FF0000", "#80FF00", "#00FFFF", "#808080", "#FF8000", "#408080", "#8000FF", "#CCCC00"];//画笔颜色值 
        // this.fontWeight = [2, 5, 8];
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = "round";//context.lineJoin - 指定两条线段的连接方式 
        this.ctx.lineWidth = 2;//线条的宽度 
        this.ctx.scale(this.dpr, this.dpr);
        this.iptCha = this.$("#cha");       //关闭按钮
        this.iptClear = this.$("#clear");       //删除按钮
        this.iptNext = this.$("#qianjin");     //上一步按钮
        this.iptPrev = this.$("#fanhui1");     //下一步按钮
        this.w = this.canvas.width;//取画布的宽 
        this.h = this.canvas.height;//取画布的高 
        this.lastX = 0;
        this.lastY = 0;
        this.fingerLen = 0;
        this.touch = ("createTouch" in document);//判定是否为手持设备 
        this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代 
        this.MoveEvent = this.touch ? "touchmove" : "mousemove";
        this.EndEvent = this.touch ? "touchend" : "mouseup";
        this.bind();
      },
      bind: function () {
        var t = this;
        /*清除画布*/
        this.iptClear.onclick = function () {
          t.clear();
        };
        /*撤销操作*/
        this.iptPrev.onclick = function() {
          // t.step--;
          // t.clear();
          // if (t.step <= -1) return t.step = -1;
          // t.ctx.putImageData(t.stepData[t.step], 0, 0);
          t.ctx.restore();
        },
        this.iptNext.onclick = function() {
          // if (t.step == t.stepData.length - 1) return;
          // t.step++;
          // t.ctx.putImageData(t.stepData[t.step], 0, 0);
        },
        /*鼠标按下事件，记录鼠标位置，并绘制，解锁lock，打开mousemove事件*/
        this.canvas['on' + t.StartEvent] = function (e) {
          var touch = t.touch ? e.touches[0] : e;
          t.fingerLen = t.touch ? e.touches.length : 0;
          t.lastX = touch.clientX - touch.target.offsetLeft;//鼠标在画布上的x坐标，以画布左上角为起点 
          t.lastY = touch.clientY - touch.target.offsetTop;//鼠标在画布上的y坐标，以画布左上角为起点 
          t.lock = t.fingerLen == 1 ? true : false;
        };
        /*鼠标移动事件*/
        this.canvas['on' + t.MoveEvent] = function (e) {
          var touch = t.touch ? e.touches[0] : e;
          var _x = touch.clientX - touch.target.offsetLeft;//鼠标在画布上的x坐标，以画布左上角为起点 
          var _y = touch.clientY - touch.target.offsetTop;//鼠标在画布上的y坐标，以画布左上角为起点 
          if (t.lock)//t.lock为true则执行
          {
            t.ctx.beginPath(); // 开始绘制路径，必须调用
            t.ctx.moveTo(t.lastX, t.lastY); // 将绘图游标移动到到上一点
            t.ctx.lineTo(_x, _y); // 从上一点开始绘制一条到(x,y)的直线
            t.ctx.closePath();
            t.ctx.stroke(); // 描边路径
          } else {
            t.canvas.style.left = touch.clientX - t.lastX + 'px';
            t.canvas.style.top = touch.clientY - t.lastY + 'px';
          }
          t.lastX = _x;
          t.lastY = _y;
        };
        this.canvas['on' + t.EndEvent] = function (e) {
          // setTimeout(function() {
          //   var imgData=t.ctx.getImageData(0, 0, t.w, t.h);
          //   t.stepData[t.step+1] = imgData;
          //   t.step++;
          // }, 10);
          
          /*重置数据*/
          t.lock = false;
        };
      },
      clear: function () {
        this.ctx.clearRect(0, 0, this.w, this.h);//清除画布，左上角为起点 
      },
      preventDefault: function (e) {
        /*阻止默认*/
        var touch = this.touch ? e.touches[0] : e;
        if (this.touch) touch.preventDefault();
        else window.event.returnValue = false;
      }
    }

    testPaper.init();
  }
})();