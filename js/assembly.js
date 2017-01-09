/*本文件目前包含两个组件: 1. 轮播图组件; 2. 鼠标轮动页面组件*/

(function(){
	/*轮播图组件
		1.构造函数中传入轮播图总父级的id
		2.配置参数: 
			1) 图片数据
			2) 图片的父级元素
			3) 下标的标签名 例: i
			4) 下标的父级元素
			5) 上一张按钮元素
			6) 下一张按钮元素
			7) 回调函数，在点击图片之后执行
	 * */
	window.TabImg = function(id) {
		this.obj = document.getElementById(id);
		this.index = 0;
		this.timer = null;
		this.subCode = null;
		this.width = document.documentElement.clientWidth || document.body.clientWidth;
		this.settings = {
			data: [],
			imgParObj: null,
			subTag: 'i',
			subParCode: null,
			nextBtn: null,
			prevBtn: null,
			callBack: function(){}
		}
	}
	TabImg.prototype.init = function (json) {
		this.settings = tools.extend(this.settings,json);
		this.randerSubCode();
		this.settings.subParCode && this.fnSubCode();
		this.settings.nextBtn && this.nextPrevBtn();
		this.setTime();
		this.overOutPar();
		this.touchFn();
		this.imgs = this.obj.getElementsByTagName('img');
		var _this = this;
		//如果home不存在，window上的resize事件绑定
		
		window.addEventListener('resize',fnRsize);
		function fnRsize(){
			_this.width = document.documentElement.clientWidth || document.body.clientWidth;
			if (document.getElementById('home')) {
				window.removeEventListener('resize',fnRsize);
			}
		}
	}
	TabImg.prototype.touchFn = function () {
		var startX, disX, num = 0;
		var _this = this;
		this.settings.imgParObj.addEventListener('touchstart',function(ev){
			startX = _this.touchStart(ev);
		});
		this.settings.imgParObj.addEventListener('touchmove',function(ev){
			disX = _this.touchsMove(ev,disX,startX);
			/*if ( disX >= 10 ) {
				console.log(60);
				clearInterval(this.timer);
			}*/
		});
		this.settings.imgParObj.addEventListener('touchend',function(){
			_this.touchsEnd(disX);
		});
		
	}
	TabImg.prototype.touchStart = function (ev) {
		var touchs = ev.changedTouches[0];
		return touchs.pageX;
	}
	TabImg.prototype.touchsMove = function(ev,disX,startX) {
		
		var touchs = ev.changedTouches[0];
		disX = touchs.pageX - startX;
		if ( disX>0 ) {
			num = this.index -1;
			num = num<0? this.settings.data.length-1: num;
			this.imgs[1].parentNode.setAttribute('fileId',data[this.index].id);
			this.imgs[1].src = this.settings.data[this.index].img;
			
			this.imgs[0].parentNode.setAttribute('fileId',data[num].id);
			this.imgs[0].src = this.settings.data[num].img;
			move.css(this.settings.imgParObj,'translateX',-this.width+disX);
		
		} else if ( disX<0 ) {
			num = this.index +1;
			num %= this.settings.data.length;
			this.imgs[0].parentNode.setAttribute('fileId',data[this.index].id);
			this.imgs[0].src = this.settings.data[this.index].img;
			
			this.imgs[1].parentNode.setAttribute('fileId',data[num].id);
			this.imgs[1].src = this.settings.data[num].img;
			move.css(this.settings.imgParObj,'translateX',disX);
		}
		return disX;
	}
	TabImg.prototype.touchsEnd = function (disX) {
		var _this = this;
		if ( Math.abs(disX) >= this.width/3 ) {
			disX>0? move.mTween(this.settings.imgParObj,{'translateX': 0},400,'linear'):
				move.mTween(this.settings.imgParObj,{'translateX': -this.width},400,'linear');
			this.index = num;
		} else {
			disX>0? move.mTween(this.settings.imgParObj,{'translateX': -this.width},400,'linear'):
				move.mTween(this.settings.imgParObj,{'translateX': 0},400,'linear');
		}
		/*console.log(6)
		this.timer = setInterval(function(){
			console.log(1)
			_this.nextBtn();
		},1600)*/
	}
	TabImg.prototype.overOutPar = function () {
		var _this = this;
		this.obj.addEventListener('mouseenter',function(){
			clearInterval(_this.timer);
		});
		
		this.obj.addEventListener('mouseleave',function(){
			clearInterval(_this.timer);
			_this.timer = setInterval(function(){
				_this.nextBtn();
			},1600)
		});
	}
	TabImg.prototype.setTime = function () {
		var _this = this;
		clearInterval(this.timer);
		
		this.timer = setInterval(function(){
			
			_this.nextBtn();
			
		},1600)
	}
	TabImg.prototype.fnSubCode = function () {
		var _this = this;
		for ( var i=0; i<this.subCode.length; i++ ) {
			this.subCode[i].addEventListener('click',function(){
				var activeObj = tools.getByClass('active',_this.settings.subParCode)[0];
				if ( activeObj.index > this.index ) {
					_this.prevBtn(this.index);
				} else if (activeObj.index < this.index ) {
					_this.nextBtn(this.index);
				}
			});
			
		}
	}
	TabImg.prototype.nextPrevBtn = function () {
		var _this = this;
		this.settings.nextBtn.addEventListener('click',function(){
			_this.nextBtn();
		})
		this.settings.prevBtn.addEventListener('click',function(){
			_this.prevBtn();
		})
	}
	TabImg.prototype.nextBtn = function (num) {
		//如果home不存在，清除定时器
		if (!document.getElementById('home')) {
			clearInterval(this.timer);
			return;
		};
		num = typeof(num) === 'undefined'? this.index +1: num;
		num %= this.settings.data.length;
		
		move.css(this.settings.imgParObj,'translateX',0);
		this.imgs[0].parentNode.setAttribute('fileId',data[this.index].id);
		this.imgs[0].src = this.settings.data[this.index].img;
		
		this.subCodeClear(num);
		this.imgs[1].parentNode.setAttribute('fileId',data[num].id);
		this.imgs[1].src = this.settings.data[num].img;
		move.mTween(this.settings.imgParObj,{'translateX': -this.width},400,'linear');
		this.index = num;
		this.settings.callBack();
	}
	TabImg.prototype.prevBtn = function (num) {
		num = typeof(num) === 'undefined'? this.index -1: num;
		num = num<0? this.settings.data.length-1: num;
		
		move.css(this.settings.imgParObj,'translateX',-this.width);
		this.imgs[1].parentNode.setAttribute('fileId',data[this.index].id);
		this.imgs[1].src = this.settings.data[this.index].img;
		
		this.subCodeClear(num);
		this.imgs[0].parentNode.setAttribute('fileId',data[num].id);
		this.imgs[0].src = this.settings.data[num].img;
		move.mTween(this.settings.imgParObj,{'translateX': 0},400,'linear');
		this.index = num;
		this.settings.callBack();
	}
	
	TabImg.prototype.subCodeClear = function (num) {
		for ( var i=0; i<this.subCode.length; i++ ) {
			tools.rmClass(this.subCode[i],'active');
		}
		tools.addClass(this.subCode[num],'active');
	}
	
	TabImg.prototype.randerSubCode = function () {
		this.settings.subParCode.innerHTML = '';
		this.subCode = this.settings.subParCode.getElementsByTagName(this.settings.subTag);
		for ( var i=0; i<this.settings.data.length; i++ ) {
			var tag = document.createElement(this.settings.subTag);
			tag.index = i;
			if ( i === this.index ) {
				tag.className = 'active';
			}
			this.settings.subParCode.appendChild(tag);
		}
	}
	
	TabImg.prototype.extend = function (obj1,obj2,onOff) {
		if ( arguments.length === 1 && window.toString.call(arguments[0]) === '[object Object]' ) {
			this.extend(this.__proto__,arguments[0]);
		} else {
			obj1 = obj1 || {};
			for ( var attr in obj2 ) {
				if ( obj2.hasOwnProperty(attr) ) {
					if ( typeof obj2[attr] === 'object' && onOff ) {//真: 深度克隆
						obj1[attr] = Array.isArray(obj2[attr])? []: {};
						extend(obj1[attr],obj2[attr],onOff);
					} else {
						obj1[attr] = obj2[attr];
					}
				}
			}
			return obj1;
		}
	}
	
	/*鼠标轮动页面组件
		1. 
	 * */
	window.Scroll = function (id) {
		this.obj = document.getElementById(id);
		this.settings = {
			wheelObj: window
		};
	}
	Scroll.prototype = {
		constructor: Scroll,
		init: function (json) {
			if (json) this.settings = extend(this.settings,json); 
			this.scrollMouse();
			this.touchFn(this.obj);
		},
		scrollMouse: function () {
			var _this = this;
			this.wheel(function(upDown){
				var nowY = move.css(_this.obj,'translateY');
				nowY = upDown? nowY-15: nowY + 15;
				
				if ( -nowY>=_this.obj.scrollHeight+140-window.innerHeight ) {
					nowY = -(_this.obj.scrollHeight+140-window.innerHeight);
				} else if (nowY>=0) {
					nowY = 0;	
				}
				
				move.css(_this.obj,'translateY',nowY)
			})
		},
		wheel: function(callBack) {
			this.settings.wheelObj.addEventListener('DOMMouseScroll',fnWheel);
			this.settings.wheelObj.addEventListener('mousewheel',fnWheel);
			
			function fnWheel(ev){
				var upDown;
				if ( ev.detail ) {
					/*ev.detail: 火狐版*/
					upDown = ev.detail > 0? true: false;
				} else {
					/*ev.wheelDelta: 谷歌版*/
					upDown = ev.wheelDelta<0? true: false;
				}
				/*upDown是真就是下滚，否则就是上滚*/
				callBack(upDown);
			}
		},
		touchFn: function (obj,callBack) {
			var _this = this;
			var disY, nowY, lastTime, disTime, lastMouse, disMouse;
			
			move.css(this.obj,'translateZ',.01);//作用：优化用3d
			
			obj.addEventListener('touchstart',function(ev){
				var touchs = ev.changedTouches[0];
				disTime = disMouse = 0;
				disY = touchs.pageY - move.css(_this.obj,'translateY');
			})
			obj.addEventListener('touchmove',function(ev){
				var touchs = ev.changedTouches[0];
				var nowTime = new Date().getTime();
				var nowMouse = touchs.pageY;
				nowY = touchs.pageY - disY;
				move.css(_this.obj,'translateY',nowY);
				disTime = nowTime - lastTime;
				lastTime = nowTime;
				disMouse = nowMouse - lastMouse;
				lastMouse = nowMouse;
			})
			obj.addEventListener('touchend',function(ev){
				
				var s = disMouse / disTime;
				s = (isNaN(s) || s == 0 )? 0.01: s;
				var target = parseInt(Math.abs(s*30))*(Math.abs(s*10)/(s*10));
				
				nowY  = target + nowY;
				if ( nowY>=0 ) {
					nowY = 0;
				} else if (nowY<=-(_this.obj.scrollHeight+140-window.innerHeight)) {
					nowY=-(_this.obj.scrollHeight+140-window.innerHeight);
				}
				move.mTween(_this.obj,{'translateY':nowY},nowY*20,'easeOut');
			})
		},
		extend: function (obj1,obj2,onOff) {
			if ( arguments.length === 1 && window.toString.call(arguments[0]) === '[object Object]' ) {
				this.extend(this.__proto__,arguments[0]);
			} else {
				obj1 = obj1 || {};
				for ( var attr in obj2 ) {
					if ( obj2.hasOwnProperty(attr) ) {
						if ( typeof obj2[attr] === 'object' && onOff ) {//真: 深度克隆
							obj1[attr] = Array.isArray(obj2[attr])? []: {};
							extend(obj1[attr],obj2[attr],onOff);
						} else {
							obj1[attr] = obj2[attr];
						}
					}
				}
				return obj1;
			}
		}
	}
	
	
	function extend(obj1,obj2,onOff) {
		obj1 = obj1 || {};
		for ( var attr in obj2 ) {
			if ( obj2.hasOwnProperty(attr) ) {
				if ( typeof obj2[attr] === 'object' && onOff ) {//真: 深度克隆
					obj1[attr] = Array.isArray(obj2[attr])? []: {};
					extend(obj1[attr],obj2[attr],onOff);
				} else {
					obj1[attr] = obj2[attr];
				}
			}
		}
		return obj1;
	}
	
	
	/*canvas鼠标事件
		1. 
	 * */
	window.ImgEvent = function(canvas,x,y) {
		/*如果x,y这个位置有颜色就返回false，没有颜色返回true*/
		var cxt = canvas.getContext('2d');
		var height = canvas.height;
		var width = canvas.width;
		var oTop = canvas.getBoundingClientRect().top;
		var oLeft = canvas.getBoundingClientRect().left;
		
		var data = cxt.getImageData(0,0,width,height).data;
		var arrOpacity = [];
		for ( var i=0; i<data.length/4; i++ ) {
			var num = i%width
			if ( i%width == 0 ) {
				arrOpacity[Math.floor(i/width)] = [];
			}
			arrOpacity[Math.floor(i/width)].push(data[i*4+3]); 
		}
		return arrOpacity[Math.round(y-oTop)][Math.round(x-oLeft)] === 0? true: false;
	}
	
})()
