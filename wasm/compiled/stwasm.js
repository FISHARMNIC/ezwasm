window.MAX_STR_SIZE = 1000;
window.worker = 0;
window.worker_stream = 0;

const STRING = 0;
const NUMBER = 1;

var wasm_global;
var memory;

var env = {
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
    window_alert: (int_type, any_value) => {
        if (int_type == STRING) {
            alert(wasm_string(Number(any_value)))
        }
        else {
            alert(Number(any_value))
        }
    },
    Element_setProperty: (char_p_el, char_p_property, int_setType, char_p_value) => {
        var otype = Number(char_p_value);
        if (int_setType == STRING) {
            otype = wasm_string(otype)
        }
        document.getElementById(wasm_string(char_p_el))[wasm_string(char_p_property)] = otype;
    },
    // ------------ Other ------------
    eval: (char_p_str) => { eval(wasm_string(char_p_str)) }
}

function wasm_init(url, imp) {
    return fetch(url)
        .then(res => res.arrayBuffer())
        .then(bytes => WebAssembly.compile(bytes))
        .then(module => WebAssembly.instantiate(module, imp))
        .then(instance => instance.exports);
}

function wasm_string(base) {
    var strBuf = new Uint8Array(memory.buffer, base, MAX_STR_SIZE);

    var i = 0;
    while (strBuf[i] != 0 && i < MAX_STR_SIZE)
        i++

    return new TextDecoder().decode(strBuf).slice(0, i);
}

function wasm_runFunction(str_fn) {
    wasm_global[str_fn]()
}

wasm_init('main.wasm', { env })
    .then(m => {
        wasm_global = m
        memory = m.memory;
        m.main();
    });