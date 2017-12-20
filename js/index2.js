$(function() {
  
  var testPaper = {

    init: function() {
      this.mousePressed = false;
      this.lastX;
      this.lastY;
      this.ctx;
      this.canvas = document.getElementById('canvas');
      if (!this.canvas.getContext) return alert("您的浏览器不支持 canvas 标签");
      this.setHtmlFont();
      this.setCanvas();
      this.load();
    },
    setHtmlFont: function() {
      this.dpr = window.devicePixelRatio;
      var scale = 1 / this.dpr;
      document.querySelector('meta[name="viewport"]').setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
      var iWidth = document.documentElement.clientWidth;
      document.getElementsByTagName('html')[0].style.fontSize = iWidth / 16 + 'px';
    },
    GetQueryString: function(name) {
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if(r!=null)return  unescape(r[2]); return null;
    },
    setCanvas: function() {
      // this.canvas.width = this.GetQueryString('w')*this.dpr;
      // this.canvas.height = this.GetQueryString('h')*this.dpr;
      var width = this.GetQueryString('w');
      var height = this.GetQueryString('h');
      console.log(width);
      this.canvas.style.width = width + "px";
      this.canvas.style.height = height + "px";
      this.canvas.height = height * this.dpr;
      this.canvas.width = width * this.dpr;
    },

    load: function() {
      

    }

  }

});

