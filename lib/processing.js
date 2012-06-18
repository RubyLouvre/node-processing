
/**
 * Module dependencies.
 */

var fs = require('fs')
  , util = require('util')
  , jsdom = require('jsdom')
  , pkg = require('../package')
  , patch = require('./patch')
  , XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
  , Canvas = require('./canvas')
  , Image = Canvas.Image
  , document = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>')
  , window = document.createWindow()
  , navigator = window.navigator
  , HTMLImageElement = window.HTMLImageElement
  , createElement = document.createElement
  , noop = function() {}
  , processing = fs.readFileSync('./deps/processing-js/processing.js');

/**
 * Expose `version`.
 */

exports.version = pkg.version;

/**
 * Expose `window`.
 */

exports.window = window;

/**
 * Expose `document`.
 */

exports.document = document;

/**
 * Make `Canvas` instance of `HTMLCanvasElement`.
 */

function HTMLCanvasElement() {}
Canvas.prototype.__proto__ = HTMLCanvasElement.prototype;

/**
 * Evaluating Processing source code.
 *
 * FIXME: `Processing` leaks to global object.
 */

eval(processing.toString('utf-8'));

/**
 * Expose `Processing`.
 */

exports.Processing = Processing;

/**
 * Return processing instance.
 *
 * @param {Canvas} canvas
 * @param {String} path
 * @return {Processing}
 */

exports.createInstance = function(canvas, path) {
  var src;
  
  if (1 == arguments.length) {
    path = canvas;
    canvas = document.createElement('canvas');
  } else if ('string' === typeof canvas) {
    src = canvas;
    canvas = document.createElement('canvas');
  }
    
  if (!src) {
    src = fs.readFileSync(path).toString();
  }
  
  return patch(new Processing(canvas, src), path);
};

/**
 * Integrate with node-canvas.
 */

document.createElement = function() {
  if ('canvas' === arguments[0]) {
    return new Canvas();
  } else if ('img' === arguments[0]) {
    return new Image();
  }
  return createElement.apply(this, arguments);
};