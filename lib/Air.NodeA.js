(function(global) {
"use strict";

// --- dependency modules ----------------------------------
var Node = global["Air"]["Node"];

// --- define / local variables ----------------------------
//var _isNodeOrNodeWebKit = !!global.global;
//var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
//var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

// --- class / interfaces ----------------------------------
function NodeA(boss,      // @arg Air
               id,        // @arg NodeIDUINT32 - node id (unique).
               type,      // @arg NodeTypeString - node type
               options) { // @arg Object - { name, param, cues, loops, autoplay }
                          // @options.cues      Cue|CueArray
                          // @options.loops     Integer = 1 - loop times.
                          // @options.autoplay  Boolean = false - auto play
                          // @desc Animation Node
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(options, "Object|omit"),    NodeA, "options");
      //$valid($keys(options, "loops|autoplay"), NodeA, "options");
        if (options) {
            $valid($type(options.cues,     "Cue|CueArray"), NodeA, "options.cues");
            $valid($type(options.loops,    "Integer|omit"), NodeA, "options.loops");
            $valid($type(options.autoplay, "Boolean|omit"), NodeA, "options.autoplay");
        }
    }
//}@dev

    Node.apply(this, [boss, id, "NodeA", options]); // call super

    var cues = options["cues"];

    this._loops     = options["loops"] || 1;
    // --- resource ---
    this._cueIndex  = 0;        // cur index
    this._cues      = Array.isArray(cues) ? cues : [cues];
    this._cue       = _getCurrentCue(this); // current cue. { id, frames, delays, track }
    this._ctx       = null;     // surface canvas context.
    this._atlas     = null;     // Atlas
    // --- internal state ---
    this._adjust    = false;    // adjust the last modified time to timeStamp.
    this._playing   = options["autoplay"];  // now playing
    // --- event handler -----------------------------------
    this._handler = {
        play:       null,       // NodeA#onplay(event:Object - { target: AirNode, type: "play" }):void
        pause:      null,       // NodeA#onpause(event:Object - { target: AirNode, type: "pause" }):void
        ended:      null,       // NodeA#onended(event:Object - { target: AirNode, type: "ended" }):CommandString
        enterframe: null,       // NodeA#onenterframe(event:Object - { target: AirNode, type: "enterframe", timeStamp: 0.0 }):void
    };
    // --- view --------------------------------------------
    this._view = {
        sx:         1.0,        // scale x
        sy:         1.0,        // scale y
        x:          0,          // offset x of animation frame.
        y:          0,          // offset y of animation frame.
        px:         0.0,        // pivot x
        py:         0.0,        // pivot y
        // ----
        ti:         0,          // current track index
        tz:         0,          // track length
        lastAID:    "",         // last aid
        nextDelay:  0,          // next frame delay time (ms).
        lastModTime:0.0,        // last modified/updated time.
        fourceUpdate: true,
    };
    this._view.tz = this._cue.track.length * this._loops;
    this._view.lastAID = this["aid"];
}

NodeA["prototype"] = Object.create(Node["prototype"], {
    "constructor":  { "value": NodeA            },
    // --- methods ---
  //"setup":        { "value": NodeA_setup      },
    "play":         { "value": NodeA_play       },
    "pause":        { "value": NodeA_pause      },
    "tick":         { "value": NodeA_tick       },
  //"add":          { "value": NodeA_add        },
  //"swap":         { "value": NodeA_swap       },
  //"insert":       { "value": NodeA_insert     },
  //"remove":       { "value": NodeA_remove     },
  //"reorder":      { "value": NodeA_reorder    },
  //"sortOrder":    { "value": NodeA_sortOrder  },
    "command":      { "value": NodeA_command    }, // NodeA#command(command:String, param:Any):Any
    // --- accessors ---
    "aid":          { "get": function()  { var fi = this._cue.track[this._view.ti % this._cue.track.length];
                                           return this._cue.frames[fi]["aid"]; } },
    "cue":          { "get": function()  { return this._cue; } },
    "cues":         { "get": function()  { return this._cues; } },
    "cueIndex":     { "get": function()  { return this._cueIndex; },
                      "set": function(v) { this._cueIndex = v % this._cues.length;
                                           this._cue = _getCurrentCue(this);
                                           this._view.ti = 0;
                                           this._view.tz = this._cue.track.length * this._loops;
                                           this._view.lastAID = this["aid"];
                                           // keep lastModTime and nextDelay
                                           this._view.fourceUpdate = true; } },
    "track":        { "get": function()  { return { "track": this._cue.track, "position": this._view.ti }; },
                      "set": function(v) { this._view.ti = v % this._cue.track.length;
                                           this._view.lastAID = this["aid"];
                                           this._view.nextDelay = 0;
                                           this._view.lastModTime = 0.0;
                                           this._view.fourceUpdate = true;
                                           this["update"](-1); } }, // redraw last aid(redraw current frame)
    // --- event handlers ---
    "onplay":       { "set": function(v) { this._handler.play       = v; } },
    "onpause":      { "set": function(v) { this._handler.pause      = v; } },
    "onended":      { "set": function(v) { this._handler.ended      = v; } },
    "onenterframe": { "set": function(v) { this._handler.enterframe = v; } },
    // --- render property accessors ---
    "x":            { "set": function(v) { this._view.x = v | 0;  },
                      "get": function()  { return this._view.x; } },
    "y":            { "set": function(v) { this._view.y = v | 0;  },
                      "get": function()  { return this._view.y; } },
    "px":           { "set": function(v) { this._view.px = v | 0;  },
                      "get": function()  { return this._view.px; } },
    "py":           { "set": function(v) { this._view.py = v | 0;  },
                      "get": function()  { return this._view.py; } },
    "sx":           { "set": function(v) { this._view.sx = v;  },
                      "get": function()  { return this._view.sx; } },
    "sy":           { "set": function(v) { this._view.sy = v;  },
                      "get": function()  { return this._view.sy; } },
});

// --- implements ------------------------------------------
function NodeA_play() {
    if (this._view.ti >= this._view.tz) { this._view.ti = 0; }
    if (!this._playing) {
        this._playing = true;
        this._adjust  = true;
    }
}
function NodeA_pause() {
    if (this._playing) {
        this._playing = false;
    }
}
function NodeA_tick(timeStamp        // @arg Number - time stamp. -1 is redraw last aid
                    /*, deltaTime */ // @arg Number - delta time
                    /*, count */) {  // @arg Integer - callback count
    var update = false;
    var view = this._view;

    if (timeStamp >= 0 && this._playing) {
        if (this._adjust) {
            this._adjust = false;
            view.lastModTime = timeStamp;
        }
        if (view.fourceUpdate) {
            view.fourceUpdate = false;
            update = true;
        }
        if (!update) {
            if (timeStamp - view.lastModTime >= view.nextDelay) {
                timeStamp = view.lastModTime +  view.nextDelay;
                update = true;
            }
        }
        if (update) {
            if (this._handler.enterframe) {
                this._handler.enterframe({ "type": "enterframe", "target": this, "timeStamp": timeStamp });
            }
            var cue = this._cue;
            // udpate last modified time, nextDelay, lastAID
            view.lastModTime = timeStamp;
            view.nextDelay   = cue.delays[view.ti % cue.delays.length];
            view.lastAID     = this["aid"];
        }
    }
    this._atlas["draw"](view.lastAID, this._ctx, view.x - view.px, view.y - view.py,
                                                 view.sx, view.sy);
    if (update) {
        if (++view.ti >= view.tz) {
            this._playing = false;
            if (this._handler.ended) {
                this["command"]( this._handler.ended({ "type": "ended", "target": this }) || "" );
            }
        }
    }
}

function NodeA_command(command) {
    switch (command) {
    case "NEXT_CUE":
        this._cueIndex = (this._cueIndex + 1) % this._cues.length;
        this._cue = _getCurrentCue(this);
        this._view.ti = 0;
        this._view.tz = this._cue.track.length * this._loops;
        this._playing = true;
        break;
    case "GOTO_TOP":
        this._view.ti = 0;
        this._playing = true;
        break;
    }
}

function _getCurrentCue(that) {
    var cue = that._cues[that._cueIndex]; // current cue

    return {
        id:     cue.id,
        frames: cue.frames,
        delays: cue.delays,
        track:  cue.track,
    };
}

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
global["Air_" in global ? "Air_" : "Air"]["NodeA"] = NodeA; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

