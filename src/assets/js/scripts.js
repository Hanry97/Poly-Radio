var Framer = {

	countTicks: 360,

	frequencyData: [],

	tickSize: 10,

	PI: 360,

	index: 0,

	loadingAngle: 0,

	init: function (scene) {
		this.canvas = document.querySelector('canvas');
		this.scene = scene;
		this.context = scene.context;
		this.configure();
	},

	configure: function () {
		this.maxTickSize = this.tickSize * 9 * this.scene.scaleCoef;
		this.countTicks = 360 * Scene.scaleCoef;
	},

	draw: function () {
		this.drawTicks();
		this.drawEdging();
	},

	drawTicks: function () {
		this.context.save();
		this.context.beginPath();
		this.context.lineWidth = 1;
		this.ticks = this.getTicks(this.countTicks, this.tickSize, [0, 90]);
		for (var i = 0, len = this.ticks.length; i < len; ++i) {
			var tick = this.ticks[i];
			this.drawTick(tick.x1, tick.y1, tick.x2, tick.y2);
		}
		this.context.restore();
	},

	drawTick: function (x1, y1, x2, y2) {
		var dx1 = parseInt(this.scene.cx + x1);
		var dy1 = parseInt(this.scene.cy + y1);

		var dx2 = parseInt(this.scene.cx + x2);
		var dy2 = parseInt(this.scene.cy + y2);

		var gradient = this.context.createLinearGradient(dx1, dy1, dx2, dy2);
		gradient.addColorStop(0, '#FE4365');
		gradient.addColorStop(0.6, '#FE4365');
		gradient.addColorStop(1, '#F5F5F5');
		this.context.beginPath();
		this.context.strokeStyle = gradient;
		this.context.lineWidth = 2;
		this.context.moveTo(this.scene.cx + x1, this.scene.cx + y1);
		this.context.lineTo(this.scene.cx + x2, this.scene.cx + y2);
		this.context.stroke();
	},

	setLoadingPercent: function (percent) {
		this.loadingAngle = percent * 2 * Math.PI;
	},

	drawEdging: function () {
		this.context.save();
		this.context.beginPath();
		this.context.strokeStyle = 'rgba(254, 67, 101, 0.5)';
		this.context.lineWidth = 1;

		var offset = Tracker.lineWidth / 2;
		this.context.moveTo(this.scene.padding + 2 * this.scene.radius - Tracker.innerDelta - offset, this.scene.padding + this.scene.radius);
		this.context.arc(this.scene.cx, this.scene.cy, this.scene.radius - Tracker.innerDelta - offset, 0, this.loadingAngle, false);

		this.context.stroke();
		this.context.restore();
	},

	getTicks: function (count, size, animationParams) {
		size = 10;
		var ticks = this.getTickPoitns(count);
		var x1, y1, x2, y2, m = [], tick, k;
		var lesser = 160;
		var allScales = [];
		for (var i = 0, len = ticks.length; i < len; ++i) {
			var coef = 1 - i / (len * 2.5);
			var delta = ((this.frequencyData[i] || 0) - lesser * coef) * this.scene.scaleCoef;
			if (delta < 0) {
				delta = 0;
			}
			tick = ticks[i];
			if (animationParams[0] <= tick.angle && tick.angle <=  animationParams[1]) {
				k = this.scene.radius / (this.scene.radius - this.getSize(tick.angle, animationParams[0], animationParams[1]) - delta);
			} else {
				k = this.scene.radius / (this.scene.radius - (size + delta));
			}
			x1 = tick.x * (this.scene.radius - size);
			y1 = tick.y * (this.scene.radius - size);
			x2 = x1 * k;
			y2 = y1 * k;
			m.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
			if (i < 20) {
				var scale = delta / 50;
				scale = scale < 1 ? 1 : scale;
				allScales.push(scale);
			}
		}
		var sum = allScales.reduce(function(pv, cv) { return pv + cv; }, 0) / allScales.length;
		this.canvas.style.transform = 'scale('+sum+')';
		return m;
	},

	getSize: function (angle, l, r) {
		var m = (r - l) / 2;
		var x = (angle - l);
		var h;

		if (x == m) {
			return this.maxTickSize;
		}
		var d = Math.abs(m - x);
		var v = 70 * Math.sqrt(1 / d);
		if (v > this.maxTickSize) {
			h = this.maxTickSize - d;
		} else {
			h = Math.max(this.tickSize, v);
		}

		if (this.index > this.count) {
			this.index = 0;
		}

		return h;
	},

	getTickPoitns: function (count) {
		var coords = [], step = this.PI / count;
		for (var deg = 0; deg < this.PI; deg += step) {
			var rad = deg * Math.PI / (this.PI / 2);
			coords.push({ x: Math.cos(rad), y: -Math.sin(rad), angle: deg });
		}
		return coords;
	}
};
'use strict';

var Tracker = {

	innerDelta: 20,

	lineWidth: 7,

	prevAngle: 0.5,

	angle: 0,

	animationCount: 10,

	pressButton: false,

	init: function (scene) {
		this.scene = scene;
		this.context = scene.context;
		this.initHandlers();
	},

	initHandlers: function () {
		var that = this;

		this.scene.canvas.addEventListener('mousedown', function (e) {
			if (that.isInsideOfSmallCircle(e) || that.isOusideOfBigCircle(e)) {
				return;
			}
			that.prevAngle = that.angle;
			that.pressButton = true;
			that.stopAnimation();
			that.calculateAngle(e, true);
		});

		window.addEventListener('mouseup', function () {
			if (!that.pressButton) {
				return;
			}
			var id = setInterval(function () {
				if (!that.animatedInProgress) {
					that.pressButton = false;
					Player.context.currentTime = that.angle / (2 * Math.PI) * Player.source.buffer.duration;
					clearInterval(id);
				}
			}, 100);
		});

		window.addEventListener('mousemove', function (e) {
			if (that.animatedInProgress) {
				return;
			}
			if (that.pressButton && that.scene.inProcess()) {
				that.calculateAngle(e);
			}
		});
	},

	isInsideOfSmallCircle: function (e) {
		var x = Math.abs(e.pageX - this.scene.cx - this.scene.coord.left);
		var y = Math.abs(e.pageY - this.scene.cy - this.scene.coord.top);
		return Math.sqrt(x * x + y * y) < this.scene.radius - 3 * this.innerDelta;
	},

	isOusideOfBigCircle: function (e) {
		return Math.abs(e.pageX - this.scene.cx - this.scene.coord.left) > this.scene.radius ||
				Math.abs(e.pageY - this.scene.cy - this.scene.coord.top) > this.scene.radius;
	},

	draw: function () {
		if (!Player.source.buffer) {
			return;
		}
		if (!this.pressButton) {
			this.angle = Player.context.currentTime / Player.source.buffer.duration * 2 * Math.PI || 0;
		}
		this.drawArc();
	},

	drawArc: function () {
		this.context.save();
		this.context.strokeStyle = 'rgba(254, 67, 101, 0.8)';
		this.context.beginPath();
		this.context.lineWidth = this.lineWidth;

		this.r = this.scene.radius - (this.innerDelta + this.lineWidth / 2);
		this.context.arc(
				this.scene.radius + this.scene.padding,
				this.scene.radius + this.scene.padding,
				this.r, 0, this.angle, false
		);
		this.context.stroke();
		this.context.restore();
	},

	calculateAngle: function (e, animatedInProgress) {
		this.animatedInProgress = animatedInProgress;
		this.mx = e.pageX;
		this.my = e.pageY;
		this.angle = Math.atan((this.my - this.scene.cy - this.scene.coord.top) / (this.mx - this.scene.cx - this.scene.coord.left));
		if (this.mx < this.scene.cx + this.scene.coord.left) {
			this.angle = Math.PI + this.angle;
		}
		if (this.angle < 0) {
			this.angle += 2 * Math.PI;
		}
		if (animatedInProgress) {
			this.startAnimation();
		} else {
			this.prevAngle = this.angle;
		}
	},

	startAnimation: function () {
		var that = this;
		var angle = this.angle;
		var l = Math.abs(this.angle) - Math.abs(this.prevAngle);
		var step = l / this.animationCount, i = 0;
		var f = function () {
			that.angle += step;
			if (++i == that.animationCount) {
				that.angle = angle;
				that.prevAngle = angle;
				that.animatedInProgress = false;
			} else {
				that.animateId = setTimeout(f, 20);
			}
		};

		this.angle = this.prevAngle;
		this.animateId = setTimeout(f, 20);
	},

	stopAnimation: function () {
		clearTimeout(this.animateId);
		this.animatedInProgress = false;
	}
};
'use strict';

var Scene = {

	padding: 120,

	minSize: 740,

	optimiseHeight: 982,

	_inProcess: false,

	init: function () {
		this.canvasConfigure();
		this.initHandlers();

		Framer.init(this);
		Tracker.init(this);
		Controls.init(this);

		this.startRender();
	},

	canvasConfigure: function () {
		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d');
		this.context.strokeStyle = '#FE4365';
		this.calculateSize();
	},

	calculateSize: function () {
		this.scaleCoef = Math.max(0.5, 740 / this.optimiseHeight);

		var size = Math.max(this.minSize, 1/*document.body.clientHeight */);
		this.canvas.setAttribute('width', size);
		this.canvas.setAttribute('height', size);
		//this.canvas.style.marginTop = -size / 2 + 'px';
		//this.canvas.style.marginLeft = -size / 2 + 'px';

		this.width = size;
		this.height = size;

		this.radius = (size - this.padding * 2) / 2;
		this.cx = this.radius + this.padding;
		this.cy = this.radius + this.padding;
		this.coord = this.canvas.getBoundingClientRect();
	},

	initHandlers: function () {
		var that = this;
		window.onresize = function () {
			that.canvasConfigure();
			Framer.configure();
			that.render();
		};
	},

	render: function () {
		var that = this;
		requestAnimationFrame(function () {
			that.clear();
			that.draw();
			if (that._inProcess) {
				that.render();
			}
		});
	},

	clear: function () {
		this.context.clearRect(0, 0, this.width, this.height);
	},

	draw: function () {
		Framer.draw();
		Tracker.draw();
		Controls.draw();
	},

	startRender: function () {
		this._inProcess = true;
		this.render();
	},

	stopRender: function () {
		this._inProcess = false;
	},

	inProcess: function () {
		return this._inProcess;
	}
};
'use strict';


var Controls = {

	init: function (scene) {
		this.scene = scene;
		this.context = scene.context;
	}

};
'use strict';

var Player = {

	init: function () {
		Framer.setLoadingPercent(1);
		Scene.init();
	}

};

Player.init();
