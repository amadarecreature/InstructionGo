/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/three/build/three.module.js":
/*!**************************************************!*\
  !*** ./node_modules/three/build/three.module.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


/***/ }),

/***/ "./src/main/ts/Canvas3dManager.ts":
/*!****************************************!*\
  !*** ./src/main/ts/Canvas3dManager.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Canvas3dManager\": () => (/* binding */ Canvas3dManager)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar Canvas3dManager = /** @class */ (function () {\n    function Canvas3dManager(canvas, height, width) {\n        this._canvas = canvas;\n        this._canvas.height = height;\n        this._canvas.width = width;\n        this._camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera(45, width / height, 1, 1000);\n        this._camera.position.set(0, 0, 1000);\n        this._renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer({ canvas: canvas });\n        this._scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();\n        this._renderer.setSize(width, height);\n    }\n    Canvas3dManager.prototype.viewBall = function (radius, centerPosition) {\n        var _this = this;\n        console.info(\"viewBall\");\n        // ①ジオメトリを作成\n        var geometry = new three__WEBPACK_IMPORTED_MODULE_0__.SphereGeometry(300, 100, 100);\n        // マテリアルを作成\n        var material = new three__WEBPACK_IMPORTED_MODULE_0__.MeshPhongMaterial({ color: 0xFF0000 });\n        // メッシュを作成\n        var mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(geometry, material);\n        // 3D空間にメッシュを追加\n        this._scene.add(mesh);\n        var light = new three__WEBPACK_IMPORTED_MODULE_0__.DirectionalLight(0xffffff);\n        light.position.set(1, 1, 1);\n        this._scene.add(light);\n        var tick = function () {\n            requestAnimationFrame(tick);\n            mesh.rotation.x += 0.05;\n            mesh.rotation.y += 0.05;\n            // 描画\n            _this._renderer.render(_this._scene, _this._camera);\n        };\n        tick();\n    };\n    return Canvas3dManager;\n}());\n\n\n\n//# sourceURL=webpack://piched-ball-viewer/./src/main/ts/Canvas3dManager.ts?");

/***/ }),

/***/ "./src/main/ts/PointerPosition.ts":
/*!****************************************!*\
  !*** ./src/main/ts/PointerPosition.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PointerPosition\": () => (/* binding */ PointerPosition)\n/* harmony export */ });\nvar PointerPosition = /** @class */ (function () {\n    function PointerPosition(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n    return PointerPosition;\n}());\n\n\n\n//# sourceURL=webpack://piched-ball-viewer/./src/main/ts/PointerPosition.ts?");

/***/ }),

/***/ "./src/main/ts/index.ts":
/*!******************************!*\
  !*** ./src/main/ts/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Canvas3dManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Canvas3dManager */ \"./src/main/ts/Canvas3dManager.ts\");\n/* harmony import */ var _PointerPosition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PointerPosition */ \"./src/main/ts/PointerPosition.ts\");\n\n\nvar MainProcess = /** @class */ (function () {\n    function MainProcess() {\n        this.mainCanvas = document.getElementById(\"mainCanvas\");\n        this.btnForward1 = document.getElementById(\"btnForward1\");\n        this.init();\n        this.canvasMgr = new _Canvas3dManager__WEBPACK_IMPORTED_MODULE_0__.Canvas3dManager(this.mainCanvas, 800, 600);\n        this.canvasMgr.viewBall(100, new _PointerPosition__WEBPACK_IMPORTED_MODULE_1__.PointerPosition(240, 240));\n    }\n    MainProcess.prototype.init = function () {\n    };\n    return MainProcess;\n}());\n// Mainクラスを実行する。\nwindow.addEventListener(\"load\", function () { return new MainProcess(); });\n\n\n//# sourceURL=webpack://piched-ball-viewer/./src/main/ts/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/ts/index.ts");
/******/ 	
/******/ })()
;