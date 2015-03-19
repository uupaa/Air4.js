(function(global) {

var atlas = global["atlas"];
var clock = global["clock"];

// http://www.tomytec.co.jp/dot-s/lineup/luigi/list.html
// http://www.tomytec.co.jp/dot-s/lineup/mario/list.html
// http://www.mpsnet.co.jp/HobbyNet/photos/ensky-z121108L.jpg
//  "0123456789abcdef"
var MARIO_X = [
    "                ",
    "      1111      ",
    "   3 111111 3   ",
    " 33323233232333 ",
    " 33223233232233 ",
    " 33222333322233 ",
    "   2222332222   ",
    "    23222232    ",
    "    23333332    ",
    "   1113333111   ",
    "  221122221122  ",
    "  222112211222  ",
    "  222131131222  ",
    "  222111111222  ",
    "   2211111122   ",
    "                ",
    "                ",
];
var MARIO_R = [
    "     11111      ",
    "    111111111   ",
    "    2223323     ",
    "   2323332333   ",
    "   23223332333  ",
    "   2233332222   ",
    "     3333333    ",
    "    221222      ",
    "   2221221222   ",
    "  222211112222  ",
    "  332131131233  ",
    "  333111111333  ",
    "  331111111133  ",
    "    111  111    ",
    "   222    222   ",
    "  2222    2222  ",
];
var MARIO_R_RUN1 = [
    "                ",
    "     11111      ",
    "    111111111   ",
    "    2223323     ",
    "   2323332333   ",
    "   23223332333  ",
    "   2233332222   ",
    "     3333333    ",
    "    222212 3    ",
    "   3222222333   ",
    "  3312222233    ",
    "  221111111     ",
    "  211111111     ",
    " 22111 111      ",
    " 2    222       ",
    "      2222      ",
];
var MARIO_R_RUN2 = [
    "     11111      ",
    "    111111111   ",
    "    2223323     ",
    "   2323332333   ",
    "   23223332333  ",
    "   2233332222   ",
    "     3333333    ",
    "  22221122      ",
    "332222111222333 ",
    "333 22131112233 ",
    "33  1111111  2  ",
    "   11111111122  ",
    "  111111111122  ",
    " 22111   11122  ",
    " 222            ",
    "  222           ",
];
var MARIO_R_RUN3 = [
    "     11111      ",
    "    111111111   ",
    "    2223323     ",
    "   2323332333   ",
    "   23223332333  ",
    "   2233332222   ",
    "     3333333    ",
    "     21222      ",
    "    2221122     ",
    "   2221131113   ",
    "   2222111113   ",
    "   122333111    ",
    "    1233111     ",
    "     111222     ",
    "     2222222    ",
    "     2222       ",
];
var MARIO_R_JUMP = [
    "             333",
    "      11111  333",
    "     11111111133",
    "     2223323 222",
    "    232333233322",
    "    232233323332",
    "    22333322222 ",
    "      33333332  ",
    "  22222122212   ",
    " 222222212221  2",
    "3322222211111  2",
    "333  12111313122",
    " 3 2 11111111122",
    "  22211111111122",
    " 2221111111     ",
    " 2  1111        ",
];
var MARIO_R_BRAKE = [
    "       111111   ",
    "     111111112  ",
    "      323222222 ",
    "    333333233233",
    "   3322332233233",
    "    22333333233 ",
    "     331222111  ",
    "    22211233311 ",
    "    22222233321 ",
    "    22222233111 ",
    "     2222111111 ",
    "      11112221  ",
    "      11122221  ",
    "       1222112 2",
    "           22222",
    "           2222 ",
];
var MARIO_R_SUPER = [
    "      11111     ",
    "    1111113     ",
    "   11111133     ",
    "   11111111111  ",
    "   222332333    ",
    "  233233223333  ",
    "  2332233333333 ",
    " 22332233323333 ",
    " 2233333222222  ",
    " 2223333322222  ",
    "   2233333333   ",
    "    1333332     ",
    "    21222212    ",
    "   2212222122   ",
    "  222122221222  ",
    " 22221222212222 ",
    " 22211222211222 ",
    "2222111111112222",
    "2222111111112222",
    "2222131111312222",
    "3333111111113333",
    "3333111111113333",
    " 33111111111333 ",
    " 33111111111133 ",
    "  11111  11111  ",
    " 11111    11111 ",
    " 11111    11111 ",
    " 11111    11111 ",
    "  2222    2222  ",
    "  2222    2222  ",
    "222222    222222",
    "222222    222222",
];
var MARIO_R_SUPER_SQUAT = [
    "                ",
    "                ",
    "                ",
    "                ",
    "                ",
    "                ",
    "                ",
    "                ",
    "                ",
    "       111111   ",
    "     11111113   ",
    "    111111133   ",
    "    11111111111 ",
    "    222332333   ",
    "   233233223333 ",
    "  22333233323333",
    "  2233333222222 ",
    "  1123333322222 ",
    " 22212333333333 ",
    " 22212222332232 ",
    "222212222222212 ",
    "2222122222222122",
    "2222122222221122",
    "2222132222211222",
    "2222111111112222",
    "2222211111122222",
    "2223331111333222",
    "1233331111333321",
    "1333311111133331",
    " 1332      2331 ",
    "  2222    2222  ",
    "222222    222222",
];
var MARIO_R_SUPER_JUMP = [
    "            333 ",
    "           33233",
    "      1111133223",
    "    111111133333",
    "   1111111122222",
    "   1111111111122",
    "   2223323332222",
    "  23323323333322",
    "  23322333333332",
    " 223322333233332",
    " 22333332222222 ",
    " 22233333222232 ",
    " 22223333333322 ",
    "    11112212222 ",
    " 2222221121222  ",
    "22222222122122  ",
    "22222222112122  ",
    "2233222211221   ",
    "2333322111123   ",
    "3333321113111   ",
    "3333311111111   ",
    "3 33111111111   ",
    " 331111111111  2",
    "   1111111111 22",
    "   2111111112222",
    "2221221111112222",
    "2221112211112222",
    "2221111122112222",
    "22211111        ",
    "2221111         ",
    "22              ",
    "2               ",
];

var PALLETS = {
    mario1: { 1: "#EA1E1A", 2: "#A37F00", 3: "#FFD382" },
    luigi1: { 1: "#FFFFFF", 2: "#49A131", 3: "#FFD382" },
};

var mario_r = [
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R.join("").split(""), PALLETS.mario1, 16, 16, 0, 0, 2);
            }, { aid: "mario_r", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN1.join("").split(""), PALLETS.mario1, 16, 16, 0, 0, 2);
            }, { aid: "mario_r_run1", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN2.join("").split(""), PALLETS.mario1, 16, 16, 0, 0, 2);
            }, { aid: "mario_r_run2", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN3.join("").split(""), PALLETS.mario1, 16, 16, 0, 0, 2);
            }, { aid: "mario_r_run3", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_JUMP.join("").split(""), PALLETS.mario1, 16, 16, 0, 0, 2);
            }, { aid: "mario_r_jump", sw: 32, sh: 32 }),
];
var mario_l = [
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R.join("").split(""), PALLETS.mario1, 16, 16, 0, 0, 2, true);
            }, { aid: "mario_l", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN1.join("").split(""), PALLETS.mario1, 16, 16, 0, 0, 2, true);
            }, { aid: "mario_l_run1", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN2.join("").split(""), PALLETS.mario1, 16, 16, 0, 0, 2, true);
            }, { aid: "mario_l_run2", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN3.join("").split(""), PALLETS.mario1, 16, 16, 0, 0, 2, true);
            }, { aid: "mario_l_run3", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_JUMP.join("").split(""), PALLETS.mario1, 16, 16, 0, 0, 2, true);
            }, { aid: "mario_l_jump", sw: 32, sh: 32 }),
];

var luigi_r = [
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R.join("").split(""), PALLETS.luigi1, 16, 16, 0, 0, 2);
            }, { aid: "luigi_r", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN1.join("").split(""), PALLETS.luigi1, 16, 16, 0, 0, 2);
            }, { aid: "luigi_r_run1", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN2.join("").split(""), PALLETS.luigi1, 16, 16, 0, 0, 2);
            }, { aid: "luigi_r_run2", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN3.join("").split(""), PALLETS.luigi1, 16, 16, 0, 0, 2);
            }, { aid: "luigi_r_run3", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_JUMP.join("").split(""), PALLETS.luigi1, 16, 16, 0, 0, 2);
            }, { aid: "luigi_r_jump", sw: 32, sh: 32 }),
];

var luigi_l = [
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R.join("").split(""), PALLETS.luigi1, 16, 16, 0, 0, 2, true);
            }, { aid: "luigi_l", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN1.join("").split(""), PALLETS.luigi1, 16, 16, 0, 0, 2, true);
            }, { aid: "luigi_l_run1", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN2.join("").split(""), PALLETS.luigi1, 16, 16, 0, 0, 2, true);
            }, { aid: "luigi_l_run2", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_RUN3.join("").split(""), PALLETS.luigi1, 16, 16, 0, 0, 2, true);
            }, { aid: "luigi_l_run3", sw: 32, sh: 32 }),
        new Air.CanvasFrame(atlas, function(ctx, options) {
                drawDots(ctx, MARIO_R_JUMP.join("").split(""), PALLETS.luigi1, 16, 16, 0, 0, 2);
            }, { aid: "luigi_l_jump", sw: 32, sh: 32 }),
];

var mario_cue_r1 = new Air.Cue("MARIO_SEEK",           [mario_r[0], mario_l[0]],             [500, 500],      [0, 1, 0, 1]         );
var mario_cue_r2 = new Air.Cue("MARIO_WALK_TO_RIGHT",  [mario_r[1], mario_r[2], mario_r[3]], [100, 100, 100], _times([0, 1, 2], 4) );
var mario_cue_l2 = new Air.Cue("MARIO_WALK_TO_LEFT",   [mario_l[1], mario_l[2], mario_l[3]], [100, 100, 100], _times([0, 1, 2], 4) );
var mario_cue_lj = new Air.Cue("MARIO_JUMP",           [mario_l[4]],                         [500],           [0]                  );

var luigi_cue_r1 = new Air.Cue("LUIGI_SEEK",           [luigi_r[0], luigi_l[0]],             [500, 500],      [0, 1, 0, 1]         );
var luigi_cue_r2 = new Air.Cue("LUIGI_WALK_TO_RIGHT",  [luigi_r[1], luigi_r[2], luigi_r[3]], [100, 100, 100], _times([0, 1, 2], 4) );
var luigi_cue_l2 = new Air.Cue("LUIGI_WALK_TO_LEFT",   [luigi_l[1], luigi_l[2], luigi_l[3]], [100, 100, 100], _times([0, 1, 2], 4) );

var mario_cues = [mario_cue_r1, mario_cue_r2, mario_cue_r1, mario_cue_l2, mario_cue_lj];
var luigi_cues = [luigi_cue_r2, luigi_cue_r1, luigi_cue_l2, luigi_cue_r1];

function _times(array, times) {
    var rv = [];

    for (var i = 0; i < times; ++i) {
        rv.push(array);
    }
    return Array.prototype.concat.apply([], rv);
}
function drawDots(ctx, dotData, pallet, dataWidth, dataHeight, dx, dy, zoom, reverse) {
    dx = dx || 0;
    dy = dy || 0;
    zoom = zoom || 2;
    reverse = reverse || false;

    for (var y = 0; y < dataHeight; ++y) {
        for (var x = 0; x < dataWidth; ++x) {
            var i = y * dataWidth + (reverse ? dataWidth - x - 1 : x);
            var color = pallet[parseInt(dotData[i], 10) || 0] || "transparent";

            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(dx * zoom + x * zoom, dy * zoom + y * zoom, zoom, zoom);
            ctx.closePath();
        }
    }
}

function _marioAction(event) {
    var node = event.target;

    switch (node.cue.id) {
    case "MARIO_SEEK": break;
    case "MARIO_WALK_TO_RIGHT": node.x += 5; break;
    case "MARIO_WALK_TO_LEFT": node.x -= 5; break;
    case "MARIO_JUMP":
        if (!node.junp) {
            node.jump = {
                y:  0, // current position
                py: 0, // prev position
                by: node.y, // begin position
                f:  13,  // 初速
            };
            _jump(node.jump);
            node.jump.f = -1;
            //setTimeout(_jumpTick, 16);
            clock.on(_jumpTick);
        }
        break;
    }

    function _jumpTick() {
        node.y = node.jump.by - node.jump.y;
        _jump(node.jump);

        if (node.jump.y <= 0) { // finished
            clock.off(_jumpTick);
            node.y = node.jump.by;
            node.jump = null;
            node.command("NEXT_CUE");
        } else {
            //setTimeout(_jumpTick, 16);
        }
    }
}
function _jump(data) {
    var ty = data.y;

    data.y  += (data.y - data.py) + data.f;
    data.py = ty;
}

function _luigiAction(event) {
    var node = event.target;
    switch (node.cueIndex) {
    case 0: node.x += 5; break;
    case 1: break;
    case 2: node.x -= 5; break;
    case 3: break;
    }
}

// ---------------------------------
function MarioAsset() {
}

MarioAsset.prototype.get = function(name) {
    switch (name) {
    case "mario_cues": return mario_cues;
    case "luigi_cues": return luigi_cues;
    case "mario_action": return _marioAction;
    case "luigi_action": return _luigiAction;
    }
};

global["MarioAsset"] = MarioAsset;

})((this || 0).self || global);

