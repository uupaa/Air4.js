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
function ImageFrame(atlas,     // @arg Atlas
                    image,     // @arg HTMLImageElement
                    options) { // @arg Object = {} - { aid, sx, sy, sw, sh, ... }
    options = options || {};

    this._aid = options["aid"] || ("ImageFrame" + (++_frameCounter));
    this._sx = options["sx"] || 0;
    this._sy = options["sy"] || 0;
    this._sw = options["sw"] || image.naturalWidth;
    this._sh = options["sh"] || image.naturalHeight;
    if (!image.complete || !image.naturalWidth || !image.naturalHeight) {
        throw TypeError("IS NOT LOADED: " + image.src);
    }
    atlas["add"](this._aid, image, this._sx, this._sy, this._sw, this._sh);
}
ImageFrame["prototype"] = Object.create(ImageFrame, {
    "constructor":  { "value": ImageFrame },
    "aid":          { "get": function() { return this._aid; } },
});

// --- implements ------------------------------------------

// --- validate / assertions -------------------------------
//{@dev
//function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
//function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
global["Air_" in global ? "Air_" : "Air"]["ImageFrame"] = ImageFrame; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

