(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _isNodeOrNodeWebKit = !!global.global;
//var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
//var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

// --- class / interfaces ----------------------------------
function Cue(id,      // @arg id String = "" - cue name
             frames,  // @arg FrameArray - frame values, [frame, ...]
             delays,  // @arg DelayIntegerArray = null - delay timings (unit: ms), [0, 100, 200, ...]
             track) { // @arg FrameIndexIntegerArray = null - frame index track, [0, 1, 2, ...]
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(id,     "String"),                      Cue, "id");
        $valid($type(frames, "FrameArray"),                  Cue, "frames");
        $valid($type(delays, "DelayIntegerArray|omit"),      Cue, "delays");
        $valid($type(track,  "FrameIndexIntegerArray|omit"), Cue, "track");

        // frames.length is zero -> error
        $valid(frames.length, Cue, "frames");

        // search frames elements
        frames.forEach(function(frame) {
            $valid($type(frame, "ImageFrame|CanvasFrame|APNGFrame"), Cue, "frames");
        });
        // is valid frame index
        if (track) {
            track.forEach(function(frameIndex) {
                if (!(frameIndex in frames, Cue)) { console.error("frameIndex " + frameIndex + " is not found"); }
                $valid(frameIndex in frames, Cue, "track");
            });
        }
        // is valid delay time
        if (delays) {
            delays.forEach(function(delay) {
                if (delay < 0) { console.error("delay " + delay + " is invalid value"); }
                $valid(delay >= 0, Cue, "delays");
            });
        }
    }
//}@dev

    // single frame -> supply delays and track
    if (frames.length === 1) {
        if (delays === undefined) {
            delays = [0];
        }
        if (track === undefined) {
            track = [0];
        }
    }
    // supply delays elements
    if (delays.length !== track.length) {
        _fillLength(delays, track.length);
    }
    this._id     = id;
    this._frames = frames;
    this._delays = delays;
    this._track  = track;
}
Cue["prototype"] = Object.create(Cue, {
    "constructor":  { "value": Cue     },
    "id":           { "get": function()  { return this._id; } },
    "frames":       { "set": function(v) { this._frames = v; },
                      "get": function()  { return this._frames; } },
    "delays":       { "set": function(v) { this._delays = v; },
                      "get": function()  { return this._delays; } },
    "track":        { "set": function(v) { this._track = v; },
                      "get": function()  { return this._track; } },
});

// --- implements ------------------------------------------
// 配列の要素数がlengthより短い場合は、array全体のコピーを末尾に追加して行き、長さがlengthになるようにします
function _fillLength(array, length) {
    while (array.length < length) {
        Array.prototype.push.apply(array, array);
    }
    array.length = length;
}

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
global["Air_" in global ? "Air_" : "Air"]["Cue"] = Cue; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

