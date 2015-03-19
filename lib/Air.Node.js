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
function Node(boss,      // @arg Air
              id,        // @arg NodeIDUINT32 - node id (unique).
              type,      // @arg NodeTypeString - node type
              options) { // @arg Object = null - { name, param, ... }
                         // @desc Generic Node
    this._boss      = boss;
    this._id        = id;
    this._name      = options["name"] || "";
    this._type      = type;
    this._parent    = null; // parent node.
    this._visible   = true;
    this._children  = [];   // children node list.
}

Node["prototype"] = Object.create(Node, {
    "constructor":  { "value": Node             }, // new Node():Node
    // --- methods ---
    "setup":        { "value": Node_setup       },
    "play":         { "value": Node_play        },
    "pause":        { "value": Node_pause       },
    "tick":         { "value": Node_tick        }, // Node#tick(timeStamp:Number, deltaTime:Number, count:Integer):void
    "add":          { "value": Node_add         }, // Node#add(node:Node):Node
    "swap":         { "value": Node_swap        }, // Node#swap(node:Node, refNode:Node):Node
    "insert":       { "value": Node_insert      }, // Node#insert(node:Node, refNode:Node):Node
    "remove":       { "value": Node_remove      }, // Node#remove(node:Node):Node
    "reorder":      { "value": Node_reorder     }, // Node#reorder():void
    "sortOrder":    { "value": Node_sortOrder   }, // Node#sortOrder():void
    "command":      { "value": Node_command     }, // Node#command(command:String, param:Any):Any
    "find":         { "value": Node_find        }, // Node#find(selector:String):Node
    // --- accessors ---
    "parent":       { "get": function()  { return this._parent; },
                      "set": function(v) { this._parent = v;
                                           this._boss["notify"](this, "Node#setParent", v); } },
    "children":     { "get": function()  { return this._children; } },
    "first":        { "get": function()  { return this._children[0]; } },
    "last":         { "get": function()  { return this._children[this._children.length - 1]; } },
    "nth":          { "get": function()  { return this._children[n]; } },
    "id":           { "get": function()  { return this._id; } },
    "type":         { "get": function()  { return this._type; } },
    "order":        { "get": function()  { return this._order; },
                      "set": function(v) { this._order = v || 1;
                                           this._parent.sortOrder();
                                           this._boss["notify"](this, "Node#setOrder", this._order); } },
    "visible":      { "get": function()  { return this._visible; },
                      "set": function(v) { this._visible = !!v;
                                           this._boss["notify"](this, "Node#setVisible", !!v); } },
});

// --- implements ------------------------------------------
function Node_setup(resource) { // @arg Object - { ctx, atlas }
    if (resource["ctx"])   { this._ctx   = resource["ctx"];   }
    if (resource["atlas"]) { this._atlas = resource["atlas"]; }
}
function Node_play() {}
function Node_pause() {}

function Node_tick(timeStamp, // @arg Number
                   deltaTime, // @arg Number
                   count) {   // @arg Integer
    // no operation
}

function Node_add(node) { // @arg Node - child node
                          // @ret Node - added node
                          // @desc DOM.Node.appendChild
    if (node["parent"]) { // already attached? -> remove -> add
        node["parent"]["remove"](node);
    }
    node["parent"] = this; // set parent node
    this._children.push(node);
    this._boss["notify"](this, "Node#add", node);
    return node;
}

function Node_swap(node,      // @arg Node - child node
                   refNode) { // @arg Node - replace target child node
                              // @ret Node - replaced node
                              // @desc DOM.Node.replaceChild like method
                              // refNode が見つからない場合は add と同様に機能します
    var pos = this._children.indexOf(refNode);
    if (pos >= 0) {
        if (node["parent"]) { // already attached? -> remove
            node["parent"]["remove"](node);
        }
        node["parent"] = this;
        this._children.splice(pos, 1, node);
        this._boss["notify"](this, "Node#swap", node, refNode);
        return refNode;
    }
    return this["add"](node);
}

function Node_insert(node,      // @arg Node - child node
                     refNode) { // @arg Node - insert target child node
                                // @desc DOM.Node.insertBefore like method
                                // refNode が見つからない場合は add と同様に機能します
    if (refNode) {
        var pos = this._children.indexOf(refNode);
        if (pos >= 0) {
            node["parent"] = this; // set parent node
            this._children.splice(pos, 0, node);
            this._boss["notify"](this, "Node#insert", node, refNode);
            return node;
        }
    }
    return this["add"](node);
}

function Node_remove(node) { // @arg Node - remove target child node
                             // @ret Node - return removed node
                             // @desc DOM.Node.removeChild like method
    var pos = this._children.indexOf(node);
    if (pos >= 0) {
        this._children.splice(pos, 1);
        node["parent"] = null; // clear parent node
        this._boss["notify"](this, "Node#remove", node);
    }
    return node;
}

function Node_sortOrder() {
    this._children.sort(function(a, b) {
        return a["order"] - b["order"];
    });
    this._boss["notify"](this, "Node#sortOrder");
}

function Node_reorder() { // @desc 現在のNode順に従いorderを再割当てします。先頭のNodeのorderは1に、末尾のNodeのorderはchildren.lengthと等しくなります。
    for (var i = 0, iz = this._children.length; i < iz; ++i) {
        this._children[i].order = i + 1;
    }
    this._boss["notify"](this, "Node#reorder");
}

function Node_command(command, // @arg String
                      param) { // @ret Any
                               // @ret Any
}

function Node_find(selector) { // @arg String
                               // @ret Node
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
if (typeof module !== "undefined") {
    module["exports"] = Node;
}
global["Air_" in global ? "Air_" : "Air"]["Node"] = Node; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

