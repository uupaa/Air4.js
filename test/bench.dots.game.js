(function(global) {
    var CHARACTERS = 1200;
    //var CHARACTERS = 1;


    function Game(resource) { // @arg Object - { atlas, clock, render, asset }
        this._atlas  = resource["atlas"];
        this._clock  = resource["clock"];
        this._render = resource["render"];
        this._asset  = resource["asset"];
        this._setup();
        this._clock.start();
        this._render.start();
    }
    Game.prototype._setup = function() {
        var that = this;

        var mario_cues   = this._asset.get("mario_cues");
        var mario_action = this._asset.get("mario_action")
        var luigi_cues   = this._asset.get("luigi_cues");
        var luigi_action = this._asset.get("luigi_action")

        for (var i = 0, iz = CHARACTERS / 2; i < iz; ++i) {
            _createNode(i, mario_cues, mario_action);
            _createNode(i, luigi_cues, luigi_action);
        }

        function _createNode(index, cues, action) {
            var node = that._render.createNode("NodeA", { name: "node-" + index, cues: cues, loops: 1 });
            node.x = (Math.random() * 960);
            node.y = (Math.random() * 640);

            node.onenterframe = action;
            node.onended = function(event) {
                if (event.target.cue.id === "MARIO_JUMP") {
                    //
                } else {
                    return "NEXT_CUE";
                }
            };
            var scale = (((Math.random() * 1.8 + 0.2) * 10) | 0) / 10;
            node.sx = scale;
            node.sy = scale;
            that._render.rootNode.add(node);

            setTimeout(function() {
                node.play();
            }, (Math.random() * 2000) | 0);
        }
    };
    Game.prototype.play = function() {
        this._render.start();
    };
    Game.prototype.pause = function() {
        this._render.pause();
    };
    // ----------------------------------------------------


    var canvas = document.querySelector("#dots");
    var ctx = canvas.getContext("2d");
    ctx.webkitImageSmoothingEnabled = false;

    var atlas = global["atlas"];
    var clock = global["clock"];
    var air   = new Air({ ctx: ctx, atlas: atlas, clock: clock });
    var asset = new MarioAsset();

    var game = new Game({ atlas: atlas, clock: clock, render: air, asset: asset });

    // export to global
    global["game"] = game;

})((this || 0).self || global);

