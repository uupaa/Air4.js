(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _isNodeOrNodeWebKit = !!global.global;
//var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
//var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

var _frameCounter = 0;

// --- class / interfaces ----------------------------------
function CanvasFrame(atlas,     // @arg Atlas
                     render,    // @arg Function - render function(ctx, options) { ... }
                     options) { // @arg Object = {} - { aid, sx, sy, sw, sh, ... }
    options = options || {};

    this._aid = options["aid"] || ("CanvasFrame" + (++_frameCounter));
    this._sx = options["sx"] || 0;
    this._sy = options["sy"] || 0;
    this._sw = options["sw"] || 300;
    this._sh = options["sh"] || 150;

    var ctx = _createCanvas(this._sw, this._sh);

    render(ctx, options);

    //ctx.canvas.style.cssText = "border: 1px sold red; backgground: navy";
    //document.body.appendChild(ctx.canvas);

    atlas["add"](this._aid, ctx.canvas, this._sx, this._sy, this._sw, this._sh);
}
CanvasFrame["prototype"] = Object.create(CanvasFrame, {
    "constructor":  { "value": CanvasFrame },
    "aid":          { "get": function() { return this._aid; } },
});

// --- implements ------------------------------------------
function _createCanvas(w, h) {
    var canvas = document.createElement("canvas");

    canvas.width  = w;
    canvas.height = h;

    return canvas.getContext("2d");
}

// --- validate / assertions -------------------------------
//{@dev
//function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
//function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
global["Air_" in global ? "Air_" : "Air"]["CanvasFrame"] = CanvasFrame; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

