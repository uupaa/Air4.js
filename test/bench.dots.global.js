(function(global) {

// create global instance
Atlas["VERBOSE"] = true;
Atlas["VERBOSE_VERBOSE"] = false;
global["BENCHMARK"] = true;

var perf = global["BENCHMARK"] ? new Perf({ x: 1000, y: 30 }) : {};
var atlas = new Atlas();
var clock = new Clock([], { vsync: true, suspend: true, start: false });

global["perf"]  = perf;
global["atlas"] = atlas;
global["clock"] = clock;


global["Easing"]["jump"] = function(jump, // @arg Object - { y, ing, cy, py, cv }
                                    iv,   // @arg Integer = 13 - initial velocity
                                    iy) { // @arg Integer = 0 - initial y
    if (!jump["ing"]) {
        jump["ing"] = true;
        jump["y"]   = 0;
        jump.py  = 0;  // previous y
        jump.cy  = 0;  // current y
        jump.iy  = iy; // initial y
        jump.cv  = iv; // current velocity
        _jump(jump);
        jump.cv = -1;
    } else {
        jump["y"] = jump.iy - jump.cy;
        _jump(jump);

console.log(jump.cy);
        if (jump.cy <= 0) { // finished
            jump["y"] = jump.iy; // TODO:
            jump["ing"] = false;
        }
    }
    return jump;

    function _jump(jump) {
        var cy = jump.cy;

        jump.cy += (jump.cy - jump.py) + jump.cv;
        jump.py = cy;
    }
};



global["Easing"]["jump2"] = function(jump, // @arg Object - { y, ing, cy, py, cv }
                                     iv,   // @arg Integer = 13 - initial velocity
                                     iy,   // @arg Integer = 0 - initial y
                                     tick, done) {
    if (!jump["ing"]) {
        // --- init ---
        jump["ing"] = true;
        jump["y"]   = 0;
        jump.py  = 0;  // previous y
        jump.cy  = 0;  // current y
        jump.iy  = iy; // initial y
        jump.cv  = iv; // current velocity
        _jump(jump);
        jump.cv = -1;
        jump.tick = tick;
        jump.done = done;

        //clock.on(tick);
debugger;
        clock.on(_tick);
    } else {
        jump["y"] = jump.iy - jump.cy;
        _jump(jump);

        if (jump.cy <= 0) { // finished
            jump["y"] = jump.iy; // TODO:
            jump["ing"] = false;
            //clock.off(jump.tick);
            clock.off(_tick);
            jump.done();
            jump.tick = null;
            jump.done = null;
        }
    }
    return jump;

    function _tick() {
        var y = Easing.jump2(jump)["y"];
        if (jump.tick && jump.tick(y)) {
            console.log("STOP!");
            debugger; // STOP
        }
    }

    function _jump(jump) {
        var cy = jump.cy;

        jump.cy += (jump.cy - jump.py) + jump.cv;
        jump.py = cy;
    }
};








function Jump3(velocity, y, fn) {
    this._run       = true;
    this._velocity  = velocity;

    this._py        = 0;        // previous y
    this._cy        = velocity; // current y
    this._iy        = y;
    this._cv        = -1;       // current velocity

    this._fn        = fn;

    this._tick      = Jump3_tick.bind(this);
    clock.on(this._tick);
}
Jump3["prototype"] = Object.create(Jump3, {
    "constructor":          { "value": Jump3 },
    "reuse":                { "value": Jump3_reuse },
});
function Jump3_reuse() {
    this._py = 0;
    this._cy = this._velocity;
    this._cv = -1;
    clock.on(this._tick);
}
function Jump3_tick() {
    var y  = this._iy - this._cy;
    var cy = this._cy;

    this._cy += (this._cy - this._py) + this._cv;
    this._py = cy;

    var result = this._fn(y, this._cy, this._iy);
    if (result === true) {
        // end
        this._run = false;
        clock.off(this._tick);
    } else {
        ;
    }
}

global["Jump3"] = Jump3;



















})((this || 0).self || global);

