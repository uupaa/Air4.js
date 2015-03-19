var ModuleTestAir4 = (function(global) {

var _isNodeOrNodeWebKit = !!global.global;
var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

var test = new Test("Air4", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
    }).add([
        testAir4_value,
        testAir4_concat,
        testAir4_concat$,
    ]);

if (_runOnBrowser || _runOnNodeWebKit) {
    //test.add([]);
} else if (_runOnWorker) {
    //test.add([]);
} else if (_runOnNode) {
    //test.add([]);
}

// --- test cases ------------------------------------------
function testAir4_value(test, pass, miss) {

    var instance = new Air4("a");

    if (instance.value === "a") {
        instance.value = "b";

        if (instance.value === "b") {
            test.done(pass());
            return;
        }
    }
    test.done(miss());
}

function testAir4_concat(test, pass, miss) {

    var result = {
            0: new Air4(   ).concat("a") === "a", // true
            1: new Air4("b").concat("b") === "bb" // true
        };

    if (/false/.test(JSON.stringify(result, null, 2))) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testAir4_concat$(test, pass, miss) {

    var result = {
            0: new Air4(   ).concat$("a").value === "a", // true
            1: new Air4("b").concat$("b").value === "bb" // true
        };

    if (/false/.test(JSON.stringify(result, null, 2))) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

return test.run().clone();

})((this || 0).self || global);

