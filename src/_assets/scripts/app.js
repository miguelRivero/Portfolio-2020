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

	// SCROLL SNAP
	//First the variables our app is going to use need to be declared

	//References to DOM elements
	const $slidesContainer = document.getElementById("scroll-container");
	const $slides = $slidesContainer.querySelectorAll(".scroll-block");
	let $currentSlide = $slides[0];
	
	//Animating flag - is our app animating
	let isAnimating = false;
	
	//The height of the window
	let pageHeight = window.innerHeight;
	
	const _duration = .3;
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
			{ top: '3%', autoAlpha: 1, ease: ease_1 }
		);

	//Going to the first slide
	goToSlide($currentSlide);

	/*
	 *   Adding event listeners
	 * */

	window.addEventListener("resize", onResize);
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
			let _index = $slide.getAttribute('index')
			let _y = pageHeight * _index
			//Sliding to current slide
			gsap.to($slidesContainer, 1, {
				scrollTo: { y: _y },
				onComplete: onSlideChangeEnd,
				onStart: introAnimation,
				onStartParams: [_index]
			});
		}
	}

	/*
	 *   Once the sliding is finished, we need to restore "isAnimating" flag.
	 *   You can also do other things in this function, such as changing page title
	 * */
	function introAnimation(index) {
		if (index === '1') {
			tl.play(0)
		} else if (index === '0') {
			tl.reverse()
		} else if (index === '4') {
			gsap.fromTo("footer", {opacity: 0}, {opacity: 1, duration: _duration, delay: 1, ease: ease_1});
		} else {
			gsap.to("footer", {opacity: 0, duration: 0.1, ease: ease_1});
		}
	}

	function onSlideChangeEnd() {
		isAnimating = false;
	}

	/*
	 *   When user resize it's browser we need to know the new height, so we can properly align the current slide
	 * */
	function onResize() {
		console.log('resize')
		//This will give us the new height of the window
		let newPageHeight = window.innerHeight;
		let _index = $currentSlide.getAttribute('index')

		/*
		 *   If the new height is different from the old height ( the browser is resized vertically ), the slides are resized
		 * */
		if (pageHeight !== newPageHeight) {
			pageHeight = newPageHeight;

			//This can be done via CSS only, but fails into some old browsers, so I prefer to set height via JS
			gsap.set([$slidesContainer, $slides], { height: pageHeight + "px" });

			//The current slide should be always on the top
			gsap.set($slidesContainer, {
				scrollTo: { y: pageHeight * _index },
			});
		}
	}

	// END SCROLL SNAP

	//TOPNAME LINK
	const _topName = document.getElementById("topname");
	_topName.addEventListener("click", function(){
		goToSlide($slides[0])
		
	});
	//END TOPNAME LINK	

	//TOPNAME LINK
	const aboutBtn = document.getElementById("nav-about-btn");
	// let about_clicked = false; 
	let aboutAnimation = gsap.timeline({ paused: true, reversed: true });
	aboutAnimation.staggerFromTo(['#scroll-container', '#topname', '#arrowdown'], 0.25, {opacity: 1}, {opacity: 0, ease: ease_1}, 0.1)
		.staggerFromTo("#about", 0.5, { xPercent: -100, x: 0 }, { xPercent: 0, x: 0, ease: ease_1});

	aboutBtn.addEventListener("click", aboutIn, false);
	
	// function toggleAbout() {
	// 	if (about_clicked) {
	// 		gsap.to('#about', 0.5, { left: '-100%'})
	// 	} else {
		// 		gsap.to('#about', 0.5, { left: '0'})
		// 	}
		// 	about_clicked = !about_clicked
		// }
		
		function aboutIn() {
			if (aboutAnimation.reversed()){
				aboutAnimation.play()
				aboutBtn.innerHTML = 'Hide';
			} else {
				aboutAnimation.reverse();
				aboutBtn.innerHTML = 'About';
		}
	}
	
	//END TOPNAME LINK	
});



