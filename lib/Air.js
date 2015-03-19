(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _isNodeOrNodeWebKit = !!global.global;
//var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
//var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

/*
var air = new Air();
var anode = air.createNode("NodeA", cues, options);
air.root.add(anode);
air.root.first.add(anode);
air.root.last.add(anode);
air.root.last.last.n(2).add(anode);
air.find(path).add(anode);
 */

// --- class / interfaces ----------------------------------
function Air(options) { // @arg Object = {} - { ctx, atlas, clock, render, decoder }
    options = options || {};

    this._tick  = _tick.bind(this);
    this._clock = options["clock"] || new Clock([], { vsync: true, suspend: true, start: true });
    this._atlas = options["atlas"] || null;
    // --- render tree ---
    this._dirty         = false;
    this._nodeCount     = 0;
    this._rootNode      = null;
//  this._nodeMap       = new WeakMap(); // { node: nodeid, ... }
//  this._nodeIDMap     = {};            // { nodeid: node, ... }
    this._renderNodes   = [];            // [ node, ...] // 全てを解決した状態のレンダリングノード
    // --- adjust time when paused ---
    this._pausedTime    = { begin: 0, total: 0 };
    this._suspendTime   = { begin: 0, total: 0 };     // suspended time.
    this._playing       = false;
    // --- view --------------------------------------------
    var ctx = options["ctx"];

    this._view = {
        ctx:    ctx,
        width:  ctx.canvas.width,
        height: ctx.canvas.height,
    };

    // --- build ---
    this._rootNode = this["createNode"]("Node", { "name": "root" });

    if (global["PageVisibilityEvent"]) {
        global["PageVisibilityEvent"]["on"](_onsuspend);
    }

    var that = this;

    function _onsuspend(hiddenState, eventType, suspendedTime) {
        // adjust pausedTime.total when Air#paused and page suspended.
        if (!that._playing && !hiddenState) {
            that._pausedTime.total -= suspendedTime;
        }
    }
}

//{@dev
Air["repository"] = "https://github.com/uupaa/Air.js"; // GitHub repository URL. http://git.io/Help
//}@dev

Air["prototype"] = Object.create(Air, {
    "constructor":  { "value": Air              }, // new Air(options:Object):Air
    "start":        { "value": Air_start        }, // Air#start():void
    "pause":        { "value": Air_pause        }, // Air#pause():void
    "stop":         { "value": Air_stop         }, // Air#stop():void
    "notify":       { "value": Air_notify       }, // Air#notify(target:Any, method:String, value:Any|undefined, param:Any|undefined):void
    // --- node methods ---
    "createNode":   { "value": Air_createNode   }, // Air#createNode(type:NodeClassNameString, options:Object = null):Node
    "getNodes":     { "value": Air_getNodes     }, // Air#getNodes(visible:Boolean = false):NodeArray
    "updateRenderTree":
                    { "value": Air_updateRenderTree }, // Air#updateRenderTree(force:Boolean = false):void
    // --- node accessors ---
    "rootNode":     { "get":   function() { return this._rootNode; } },
});

// --- implements ------------------------------------------
function Air_updateRenderTree(force) { // @arg Boolean = false - force update
    if (force || this._dirty) {
        this._renderNodes = this["getNodes"](true);
        this._dirty = false;
    }
}

function Air_getNodes(visible) { // @arg Boolean = false - enum visible nodes
                                 // @ret NodeArray - [node, ...]
                                 // @desc Tree traversal. breadth first search
    var result = [];
    var queue = [this._rootNode];

    for (var q = 0; q < queue.length; ++q) {
        Array.prototype.push.apply(queue, queue[q]["children"]);
    }
    if (!visible) {
        return queue.slice(1);
    }
    for (var i = 1, iz = queue.length; i < iz; ++i) {
        var node = queue[i];
        if (node["visible"]) {
            result.push(node);
        }
    }
    return result;
}

function _tick(timeStamp, // @arg Number - current time
               deltaTime, // @arg Number - delta time
               count) {   // @arg Integer - callback count
                          // @bind this
    if (this._dirty) { // dirty -> update render nodes.
        this["updateRenderTree"]();
    }
    timeStamp -= this._pausedTime.total; // adjust time when paused.

    var view = this._view;

    view.ctx.clearRect(0, 0, view.width, view.height);

//{@dev
    global["perf"]["a"];
//}@dev

    for (var i = 0, iz = this._renderNodes.length; i < iz; ++i) {
        var node = this._renderNodes[i];
        if (node) {
            node["tick"](timeStamp, deltaTime, count);
        }
    }
//{@dev
    global["perf"]["b"];
//}@dev
}

function Air_createNode(type,      // @arg NodeClassNameString
                        options) { // @arg Object = null - { name, params, ... }
                                   // @ret Node
    var id = ++this._nodeCount;
    var node = null;

    switch (type) {
    case "Node":  node = new Air.Node(this, id, type, options || {}); break;
    case "NodeA": node = new Air.NodeA(this, id, type, options || {}); break;
    default: throw new TypeError("UNKNOWN TYPE: " + type);
    }
//  this._nodeMap.set(node, id); // { node: id, ... }
//  this._nodeIDMap[id] = node;  // { id: node, ... }

    node["setup"]({
        "ctx":      this._view.ctx,
        "atlas":    this._atlas,
        "render":   this._render,
        "decoder":  this._decoder,
    });
    return node;
}

function Air_notify(target,  // @arg Any
                    method,  // @arg String
                    value,   // @arg Any|undefined
                    param) { // @arg Any|undefined
    switch (method) {
    case "Node#add":
    case "Node#swap":
    case "Node#insert":
    case "Node#remove":
    case "Node#setOrder":
    case "Node#sortOrder":
    case "Node#setParent":
    case "Node#setVisible":
        this._dirty = true; // set dirty flag
        break;
    case "Node#reorder":
        break;
    }
}

function Air_start() {
    if (!this._playing) {
        this._playing = true;

        this["updateRenderTree"]();

        if (this._pausedTime.begin) { // pause -> play, adjust time when paused.
            this._pausedTime.total += (this._clock["now"]() - this._pausedTime.begin);
            this._pausedTime.begin = 0;
        }
        this._clock.on(this._tick);
    }
}
function Air_pause() {
    if (this._playing) {
        this._playing = false;
        this._pausedTime.begin = this._clock["now"](); // adjust time when paused.
        this._clock.off(this._tick);
    }
}
function Air_stop() {
    this._playing = false;
    this._pausedTime.begin = 0;
    this._clock.off(this._tick);
}
/*
function Air_play(force) { // @arg Boolean = false
    this["updateRenderTree"]();

    if (force) {
        for (var i = 0, iz = this._renderNodes.length; i < iz; ++i) {
            var node = this._renderNodes[i];
            if (node && node["parent"] && node["visible"]) {
                node["play"]();
            }
        }
    }
    this._clock.on(this._tick);
}
function Air_pause(force) { // @arg Boolean = false
    this._clock.off(this._tick);

    if (force) {
        var nodes = this["getNodes"](false); // all nodes.
        for (var i = 0, iz = nodes.length; i < iz; ++i) {
            var node = nodes[i];
            if (node) {
                node["pause"]();
            }
        }
    }
}
 */

// --- validate / assertions -------------------------------
//{@dev
//function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
//function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if (typeof module !== "undefined") {
    module["exports"] = Air;
}
global["Air" in global ? "Air_" : "Air"] = Air; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

