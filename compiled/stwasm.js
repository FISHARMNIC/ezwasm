window.MAX_STR_SIZE = 1000;
window.worker = 0;
window.worker_stream = 0;

const STRING = 0;
const NUMBER = 1;

window.wasm_global = 0;
window.memory = [];

var env = {
    // ------------ Constants ------------
    MAX_STR_SIZE,
    // ------------ Console Object ------------
    console_string: (char_p) => {
        console.log(wasm_string(char_p));
    },
    console_double: (d) => console.log(d),
    console_int: (d) => console.log(d),
    // ------------ EventTarget Object ------------
    eventTarget_addEventListener: (char_p_id, char_p_event, void_p_fn) => {
        document.getElementById(wasm_string(char_p_id)).addEventListener(wasm_string(char_p_event), function () {
            wasm_runFunction(wasm_string(void_p_fn))
        })
    },
    // ------------ Window Object ------------
    window_alert: (any_value) => {
        alert(wasm_string(any_value))
    },
    element_setProperty: (char_p_el, char_p_property, char_p_value) => {
        eval(`document.getElementById("${wasm_string(char_p_el)}").${wasm_string(char_p_property)} = "${wasm_string(char_p_value)}"`);
    },
    element_getProperty: (char_p_id, char_p_properties) => {
        var evl = String(eval(`document.getElementById("${wasm_string(char_p_id)}").${wasm_string(char_p_properties)}`))
        var at = malloc(evl.length)
        create_wasm_string(at, evl);
        return at
    },
    // ------------ Other ------------
    eval: (char_p_str) => { eval(wasm_string(char_p_str)) },
    eval_rstr: (char_p_str) => {
        var evl = String(eval(wasm_string(char_p_str)));
        var at = malloc(evl.length);
        create_wasm_string(at, eval(wasm_string(char_p_str)));
        return at;
    },
    js_sleep: async (sec) => { await new Promise(r => setTimeout(r, Number(sec))) }
}

function malloc(size) {
    return wasm_global.stackAlloc(size);
}

function wasm_write_memory(address, data)
{
    var mem = new Uint8Array(memory.buffer, address, MAX_STR_SIZE)
    mem.set(new Uint8Array(data))
}

function create_wasm_string(address, str) {
    str = str.split("").map(x => x.charCodeAt(0))
    str.push(0)
    wasm_write_memory(address, str)
}

function wasm_string(base) {
    var strBuf = new Uint8Array(memory.buffer, base, MAX_STR_SIZE);

    var i = 0;
    while (strBuf[i] != 0 && i < MAX_STR_SIZE)
        i++

    return new TextDecoder().decode(strBuf).slice(0, i);
}

function wasm_runFunction(str_fn, params) {
    if (params) {
        wasm_global[str_fn](...params)
        return
    }
    wasm_global[str_fn]()
}

function wasm_write_int32 (addr, dec) {
    var binStr = "00000000000000000000000000000000" + (dec >>> 0).toString(2);
    //console.log(binStr)
    var bit8str = [];

    var reps = 0;
    var index = binStr.length
    while (reps < 4) {
        bit8str.push(binStr.substring(index - 8, index))
        index -= 8;
        reps ++;
    }
    bit8str = bit8str.reverse().map(x => parseInt(x, 2))
    wasm_write_memory(addr, binStr);
}


function wasm_init(url, imp) {
    return fetch(url)
        .then(res => res.arrayBuffer())
        .then(bytes => WebAssembly.compile(bytes))
        .then(module => WebAssembly.instantiate(module, imp))
        .then(instance => instance.exports);
}

; (async function main() {
    wasm_init('main.wasm', { env })
        .then(m => {
            wasm_global = m
            memory = m.memory;
            m.main();
        });
})()