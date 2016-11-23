	var touchSlide = function(opt) {
		this.opt = opt || {};
		this.ele = this.opt.ele || '.no';
		this.container = document.querySelector(this.ele);
		this.callbakc = this.opt.callback || ''; //滑动后的回调函数---暂时没写
		this.checkRight = false;
		this.star = 0; //滑动的起始位置
		this.init();
	};
	touchSlide.prototype = {
		constructor: touchSlide,
		init: function() {
			if(this.container == null){
				console.warn('ele: is null');
				return;
			}
			this.addListeners();
		},
		addListeners: function() {
			var self = this,
				item = this.container.querySelectorAll('li');
			for(var i = 0; i < item.length; i++) {
				(function(num) {
					item[num].addEventListener('touchstart', function(e) {
						if(e.target.tagName == 'A') return; //如果目标是滑块的a标签，则直接return
						if(self.hasClass(this, 'active')) {
							self.sildeAnim(this);
						} else {
							var active = self.container.querySelectorAll('.active');
							if(active.length > 0) {
								self.removeClass(active[0], 'active');
								self.sildeAnim(active[0]);
							}
						}
						e.preventDefault();
					});
					//添加滑动事件
					item[num].addEventListener('touchmove', self.touchMove(item[num], self));
					item[num].addEventListener('touchend', function(e) {
						self.star = 0; //离开屏幕后让滑动的起始位置为零
					});
				})(i);
			}
		},
		touchMove: function(th, self) {
			var that = th,
				rigthDom = that.querySelector('.view-cell-right'),
				leftDom = that.querySelector('.view-cell-left'),
				rightDomWidth = rigthDom.offsetWidth;
			return function(e) {
				var touchs = e.touches,
					move = touchs[0].pageX, //移动的位置,判断移动方向
					sLength = move - self.star; //移动的距离
				self.addClass(that, 'active');
				if(self.star <= 0) {
					self.star = touchs[0].pageX;
				}
				if(Math.abs(sLength) > 70) { //当偏移量大于70时
					if(sLength < 0) { //向左滑动
						self.checkRight = !self.checkRight;
						rigthDom.style.transform = 'translate(0px, 0px)';
						rigthDom.style.webkitTransform = 'translate(0px, 0px)';
						leftDom.style.transform = 'translate(-' + rightDomWidth + 'px, 0px)';
						leftDom.style.webkitTransform = 'translate(-' + rightDomWidth + 'px, 0px)';
					} else if(sLength > 0) { //向右滑动
						self.checkRight = !self.checkRight;
					}
				}
			};
		},
		hasClass: function(obj, cls) {
			return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		},
		addClass: function(obj, cls) {
			if(!this.hasClass(obj, cls)) obj.className += " " + cls;
		},
		removeClass: function(obj, cls) {
			if(this.hasClass(obj, cls)) {
				var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
				obj.className = obj.className.replace(reg, ' ');
			}
		},
		siblingElem: function(elem) {
			var _nodes = [],
				_elem = elem;
			while((elem = elem.previousSibling)) {
				if(elem.nodeType === 1) {
					_nodes.push(elem);
					break;
				}
			}
			elem = _elem;
			while((elem = elem.nextSibling)) {
				if(elem.nodeType === 1) {
					_nodes.push(elem);
					break;
				}
			}
			return _nodes;
		},
		sildeAnim: function(dom) {
			var rigthDom = dom.querySelector('.view-cell-right'),
				leftDom = dom.querySelector('.view-cell-left');
			setTimeout(function(){
				leftDom.style.transform = 'translate(0px, 0px)';
				leftDom.style.webkitTransform = 'translate(0px, 0px)';
			},50);
			rigthDom.style.transform = 'translateX(100%)';
			rigthDom.style.webkitTransform = 'translateX(100%)';
		}
	}