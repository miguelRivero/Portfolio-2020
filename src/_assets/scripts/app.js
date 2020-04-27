import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

window.onload = function () {

	// BACKGROUND ANIMATION //
	var canvas = document.getElementById("canvas_background");
	var ctx = canvas.getContext("2d");

	var width = 0;
	var height = 0;

	var iBubbles = 2;

	var aBubblesX = [];
	var aBubblesY = [];
	var aBubblesSize = [];
	var aBubblesSpeed = [];
	var aZeroOrOne = [];

	var random = (min, max) => {
		if (typeof max === "undefined") {
			return Math.random() * (min[1] - min[0]) + min[0];
		} else {
			return Math.random() * (max - min) + min;
		}
	};

	class NumberElementConfig {
		constructor(values, xMinMax, yMinMax, sizeMinMax, speedMinMax) {
			this.values = values;
			this.x = xMinMax;
			this.y = yMinMax;
			this.size = sizeMinMax;
			this.speed = speedMinMax;
		}
	}

	class NumberElement {
		constructor(numberElementConfig) {
			this.config = numberElementConfig;
			this.spawn();
		}

		spawn() {
			this.value = this.config.values[Math.floor(random(0, 2))];
			this.size = random(this.config.size);
			this.speed = random(this.config.speed);
			this.x = random(this.config.x);
			this.y = random(this.config.y);

			this.viewportOffset = this.config.size[1] + 20;

			if (Math.abs(this.speed) < 1) {
				this.speed += this.speed < 0 ? -1 : 1;
			}

			this.setSpawnPosition();
		}

		respawn() {
			this.spawn();
		}

		setSpawnPosition() {
			if (this.speed < 0) {
				let key = ["x", "y"][Math.floor(random(0, 2))];
				let value = key === "x" ? innerWidth : innerHeight;
				this[key] = value + this.size;
			} else {
				let key = ["x", "y"][Math.floor(random(0, 2))];
				this[key] = 0 - this.size;
			}
		}

		isInViewport() {
			if (
				this.x < 0 - this.viewportOffset ||
				this.y < 0 - this.viewportOffset ||
				this.x > innerWidth + this.viewportOffset ||
				this.y > innerHeight + this.viewportOffset
			) {
				return false;
			} else {
				return true;
			}
		}

		move() {
			this.x += this.speed;
			this.y += this.speed;
		}
	}

	class NumberElementCollector {
		constructor(count = 40, spawnTimeout = 80) {
			this.numberElements = [];

			let generator = () => {
				if (count != this.numberElements.length) {
					this.numberElements.push(this.generateNumberElement());
					setTimeout(generator, spawnTimeout);
				}
			};
			generator();
		}

		get() {
			return this.numberElements;
		}

		moveAll() {
			for (let i = 0; i < this.numberElements.length; ++i) {
				let element = this.numberElements[i];
				element.move();
				if (!element.isInViewport()) {
					element.respawn();
				}
			}
		}

		generateNumberElement() {
			return new NumberElement(
				new NumberElementConfig(
					["0", "1"],
					[0, innerWidth], // x
					[0, innerHeight], // y
					[15, 25], // size
					[-0.1, 0.1] // speed
				)
			);
		}
	}

	var numberElementCollector = new NumberElementCollector();

	var draw = () => {
		ctx.beginPath();
		ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
		for (let numberElement of numberElementCollector.get()) {
			ctx.font = numberElement.size / 1.5 + "px arial black";
			ctx.textBaseline = "bottom";
			ctx.textAlign = "left";
			ctx.fillText(numberElement.value, numberElement.x, numberElement.y);
		}
		ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
		ctx.stroke();
	};

	var process = () => {
		width = canvas.width = innerWidth;
		height = canvas.height = innerHeight;

		numberElementCollector.moveAll();
		draw();

		requestAnimationFrame(process);
	};
	process();
	// END BACKGROUND ANIMATION //

	// CLICKS
    var topEl = document.getElementById("top");
    var scrollContainer = document.getElementById("scroll-container");
    var mainTitleEl = document.getElementById("main-title");
    var showcaseEl = document.getElementById("showcase");
	var topBtn = document.getElementById("topname");
	var arrowBtn = document.getElementById("arrowdown");
	var _ease = "power3.out"
	var _ease_rough = "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp:  false})"
    var anchors = document.getElementsByTagName("a");
    
    for (var i = 0, length = anchors.length; i < length; i++) {
      var anchor = anchors[i];
      anchor.addEventListener('click', function() {
        // `this` refers to the anchor tag that's been clicked
        event.preventDefault();
        const linkId = this.getAttribute('href');
        gsap.to(scrollContainer, .75, {ease: _ease, scrollTo: {y:linkId}})
      }, true);
    };

	// topBtn.addEventListener("click", () => {
    //     // event.preventDefault()
    //     gsap.to(scrollContainer, {duration: .5, scrollTo: '#main-title'});
    // });
    
	// arrowBtn.addEventListener("click", () => {
    //     event.preventDefault()
    //     gsap.to(scrollContainer, {duration: .5, scrollTo: '#showcase'});
	// });

    // var scrolling = 0;

    // $("body").on("click", ".main-nav a", function(event) {
    //     scrolling = 1;
    //     event.preventDefault();
    //     const linkId = $(this).attr("href");
    //     gsap.to(scrollContainer, 0.5, {scrollTo: {y:linkId},onComplete:scrollingOff})
    // });
        

	// SCROLL SNAP
// 	const sections = [mainTitleEl, showcaseEl];
// 	// const sections = [...document.querySelectorAll(".scroll-block")];

// 	let options = {
// 		rootMargin: "0px",
// 		threshold: .25,
// 	},
// 	_duration = .75;

// 	const callback = (entries, observer) => {
// 		entries.forEach((entry) => {
// 			const { target } = entry;
// 			console.log(entry.intersectionRatio)
// 			if (target.id === 'main-title' && entry.intersectionRatio >= options.threshold) {
// 				console.log("1")
// 				console.log(target.id)
// 				gsap.fromTo("#topname", {opacity: 1}, {opacity: 0, ease: _ease_rough, duration: _duration});
// 				gsap.fromTo("#main-title", {opacity: 0}, {opacity: 1, ease: _ease, duration: _duration});
// 				gsap.fromTo("#arrowdown", {opacity: 0}, {opacity: 1, ease: _ease, duration: _duration});
// 				// } else {
// 					// }
// 					// target.classList.add("opacity-100");
// 				} else {
// 					console.log("2")
// 					console.log(target.id)
// 				// if (target.id === 'showcase') {
// 					gsap.fromTo("#topname", {opacity: 0}, {opacity: 1, ease: _ease_rough, duration: _duration});
// 					gsap.fromTo("#main-title", {opacity: 1}, {opacity: 0, ease: _ease, duration: _duration});
// 					gsap.fromTo("#arrowdown", {opacity: 1}, {opacity: 0, ease: _ease, duration: _duration});
// 				// target.classList.remove("opacity-100");
// 			}
// 		});
// 	};

// 	const observer = new IntersectionObserver(callback, options);

// 	// sections.forEach((section, index) => {
// 		observer.observe(sections[0]);
// 	// });

// 	// END SCROLL SNAP
	const _duration = 1;
	const ease_1 = 'elastic'
	// the animation to use
	const tl = gsap.timeline({paused: true});
	// tl.from("#topname", {opacity: 1});
	tl.staggerFromTo('#main-title', 1, {autoAlpha:1}, {top: -10, autoAlpha:0, ease: ease_1})
		.staggerFromTo('#topname', 1, {top:-10, autoAlpha: 0}, {top:40, autoAlpha: 1,  ease: ease_1});
	// The start and end positions in terms of the page scroll
	const startY = innerHeight / 10;
	const finishDistance = innerHeight / 5;
	let requestId = null
	// Listen to the scroll event
	window.addEventListener('scroll', function(e) {
		// Prevent the update from happening too often (throttle the scroll event)
		if (!requestId) {
			requestId = requestAnimationFrame(update);
		}
	});

	update();

	function update() {
		// console.log('ipdate')
		// console.log(scrollY)
		// Update our animation
		tl.progress((scrollY - startY) / finishDistance);
		
		// Let the scroll event fire again
		requestId = null;
	}

};