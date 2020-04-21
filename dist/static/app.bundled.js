/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/_assets/scripts/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/_assets/scripts/app.js":
/*!************************************!*\
  !*** ./src/_assets/scripts/app.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("console.log(`I was loaded at ${Date(Date.now()).toString()}`);\nvar canvas = document.getElementById(\"canvas_background\");\nvar ctx = canvas.getContext(\"2d\");\nvar width = 0;\nvar height = 0;\nvar iBubbles = 2;\nvar aBubblesX = [];\nvar aBubblesY = [];\nvar aBubblesSize = [];\nvar aBubblesSpeed = [];\nvar aZeroOrOne = [];\n\nvar random = (min, max) => {\n  if (typeof max === 'undefined') {\n    return Math.random() * (min[1] - min[0]) + min[0];\n  } else {\n    return Math.random() * (max - min) + min;\n  }\n};\n\nclass NumberElementConfig {\n  constructor(values, xMinMax, yMinMax, sizeMinMax, speedMinMax) {\n    this.values = values;\n    this.x = xMinMax;\n    this.y = yMinMax;\n    this.size = sizeMinMax;\n    this.speed = speedMinMax;\n  }\n\n}\n\nclass NumberElement {\n  constructor(numberElementConfig) {\n    this.config = numberElementConfig;\n    this.spawn();\n  }\n\n  spawn() {\n    this.value = this.config.values[Math.floor(random(0, 2))];\n    this.size = random(this.config.size);\n    this.speed = random(this.config.speed);\n    this.x = random(this.config.x);\n    this.y = random(this.config.y);\n    this.viewportOffset = this.config.size[1] + 20;\n\n    if (Math.abs(this.speed) < 1) {\n      this.speed += this.speed < 0 ? -1 : 1;\n    }\n\n    this.setSpawnPosition();\n  }\n\n  respawn() {\n    this.spawn();\n  }\n\n  setSpawnPosition() {\n    if (this.speed < 0) {\n      let key = ['x', 'y'][Math.floor(random(0, 2))];\n      let value = key === 'x' ? innerWidth : innerHeight;\n      this[key] = value + this.size;\n    } else {\n      let key = ['x', 'y'][Math.floor(random(0, 2))];\n      this[key] = 0 - this.size;\n    }\n  }\n\n  isInViewport() {\n    if (this.x < 0 - this.viewportOffset || this.y < 0 - this.viewportOffset || this.x > innerWidth + this.viewportOffset || this.y > innerHeight + this.viewportOffset) {\n      return false;\n    } else {\n      return true;\n    }\n  }\n\n  move() {\n    this.x += this.speed;\n    this.y += this.speed;\n  }\n\n}\n\nclass NumberElementCollector {\n  constructor(count = 40, spawnTimeout = 80) {\n    this.numberElements = [];\n\n    let generator = () => {\n      if (count != this.numberElements.length) {\n        this.numberElements.push(this.generateNumberElement());\n        setTimeout(generator, spawnTimeout);\n      }\n    };\n\n    generator();\n  }\n\n  get() {\n    return this.numberElements;\n  }\n\n  moveAll() {\n    for (let i = 0; i < this.numberElements.length; ++i) {\n      let element = this.numberElements[i];\n      element.move();\n\n      if (!element.isInViewport()) {\n        element.respawn();\n      }\n    }\n  }\n\n  generateNumberElement() {\n    return new NumberElement(new NumberElementConfig(['0', '1'], [0, innerWidth], // x\n    [0, innerHeight], // y\n    [15, 25], // size\n    [-0.1, 0.1] // speed\n    ));\n  }\n\n}\n\nvar numberElementCollector = new NumberElementCollector();\n\nvar draw = () => {\n  ctx.beginPath();\n  ctx.fillStyle = \"rgba(255, 255, 255, 0.1)\";\n\n  for (let numberElement of numberElementCollector.get()) {\n    ctx.font = numberElement.size / 1.5 + 'px arial black';\n    ctx.textBaseline = 'bottom';\n    ctx.textAlign = 'left';\n    ctx.fillText(numberElement.value, numberElement.x, numberElement.y);\n  }\n\n  ctx.fillStyle = \"rgba(255, 255, 255, 0.07)\";\n  ctx.fill();\n  ctx.lineWidth = 1;\n  ctx.strokeStyle = \"rgba(255, 255, 255, 0.08)\";\n  ctx.stroke();\n};\n\nvar process = () => {\n  width = canvas.width = innerWidth;\n  height = canvas.height = innerHeight;\n  numberElementCollector.moveAll();\n  draw();\n  requestAnimationFrame(process);\n};\n\nprocess();\n\n//# sourceURL=webpack:///./src/_assets/scripts/app.js?");

/***/ })

/******/ });