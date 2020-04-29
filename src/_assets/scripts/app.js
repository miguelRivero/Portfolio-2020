import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

// Without jQuery
// Define a convenience method and use it
var ready = (callback) => {
	if (document.readyState != "loading") callback();
	else document.addEventListener("DOMContentLoaded", callback);
};

ready(() => {
	/* Do things after DOM has fully loaded */

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
	var anchors = document.getElementsByTagName("a");

	// SCROLL SNAP
	//First the variables our app is going to use need to be declared

	//References to DOM elements
	let $slidesContainer = document.getElementById("showcase");
	let $slides = $slidesContainer.querySelectorAll(".scroll-block");
	let $slide_index = 0;
	let $currentSlide = $slides[$slide_index];

	//Animating flag - is our app animating
	let isAnimating = false;

	//The height of the window
	let pageHeight = window.innerHeight;

	//Going to the first slide
	goToSlide($currentSlide);

	/*
	 *   Adding event listeners
	 * */

	// window.on("resize", onResize).resize();
	window.addEventListener("resize", onResize);
	// window.on("mousewheel DOMMouseScroll", onMouseWheel);
	window.addEventListener("wheel", onMouseWheel);

	/*
	 *   When user scrolls with the mouse, we have to change slides
	 * */
	function onMouseWheel(event) {
		//Normalize event wheel delta
		let delta = event.wheelDelta / 30 || -event.detail;

		//If the user scrolled up, it goes to previous slide, otherwise - to next slide
		if (delta < -1) {
			goToNextSlide();
		} else if (delta > 1) {
			goToPrevSlide();
		}

		//event.preventDefault();
	}

	/*
	 *   If there's a previous slide, slide to it
	 * */
	function goToPrevSlide() {
		if ($currentSlide.previousElementSibling) {
			goToSlide($currentSlide.previousElementSibling);
		}
	}

	/*
	 *   If there's a next slide, slide to it
	 * */
	function goToNextSlide() {
		if ($currentSlide.nextElementSibling) {
			goToSlide($currentSlide.nextElementSibling);
		}
	}

	/*
	 *   Actual transition between slides
	 * */
	function goToSlide($slide) {
		//If the slides are not changing and there's such a slide
		if (!isAnimating) {
			//setting animating flag to true
			isAnimating = true;
			
			$currentSlide = $slide;
			let _index = $currentSlide.getAttribute('index')
			//Sliding to current slide
			gsap.to($slidesContainer, 1, {
				scrollTo: { y: pageHeight * _index },
				onComplete: onSlideChangeEnd
			});
		}
	}

	/*
	 *   Once the sliding is finished, we need to restore "isAnimating" flag.
	 *   You can also do other things in this function, such as changing page title
	 * */
	function onSlideChangeEnd() {
		isAnimating = false;
	}

	/*
	 *   When user resize it's browser we need to know the new height, so we can properly align the current slide
	 * */
	function onResize(event) {
		//This will give us the new height of the window
		var newPageHeight = window.innerHeight();

		/*
		 *   If the new height is different from the old height ( the browser is resized vertically ), the slides are resized
		 * */
		if (pageHeight !== newPageHeight) {
			pageHeight = newPageHeight;

			//This can be done via CSS only, but fails into some old browsers, so I prefer to set height via JS
			gsap.set([$slidesContainer, $slides], { height: pageHeight + "px" });

			//The current slide should be always on the top
			gsap.set($slidesContainer, {
				scrollTo: { y: pageHeight * $currentSlide.index() },
			});
		}
	}

	// END SCROLL SNAP

	const _duration = 1;
	const ease_1 = "power2";
	// the animation to use
	const tl = gsap.timeline({ paused: true });
	tl.staggerFromTo(
		"#arrowdown",
		_duration,
		{ bottom: "20px" },
		{ bottom: "-100px", ease: ease_1 }
	)
		.staggerFromTo(
			"#main-title",
			_duration,
			{ autoAlpha: 1 },
			{ top: -10, autoAlpha: 0, ease: ease_1 }
		)
		.staggerFromTo(
			"#topname",
			_duration,
			{ top: -10, autoAlpha: 0 },
			{ top: 40, autoAlpha: 1, ease: ease_1 }
		);
	// The start and end positions in terms of the page scroll
	const startY = innerHeight / 10;
	const finishDistance = innerHeight / 5;
	let requestId = null;
	// Listen to the scroll event
	window.addEventListener("scroll", function (e) {
		// Prevent the update from happening too often (throttle the scroll event)
		if (!requestId) {
			requestId = requestAnimationFrame(update);
		}
	});

	update();

	function update() {
		tl.progress((scrollY - startY) / finishDistance);
		// Let the scroll event fire again
		requestId = null;
	}
});
