window.MAX_STR_SIZE = 1000;
window.worker = 0;
window.worker_stream = 0;

const STRING = 0;
const NUMBER = 1;

var wasm_global;
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
    element_getProperty: (char_p_id, char_p_properties, write_to) => {
        create_wasm_string(write_to,
            eval(`document.getElementById("${wasm_string(char_p_id)}").${wasm_string(char_p_properties)}`)
        )
    },
    // ------------ Other ------------
    eval: (char_p_str) => { eval(wasm_string(char_p_str)) },
    js_sleep: async (sec) => { await new Promise(r => setTimeout(r, Number(sec))) }
}

function create_wasm_string(address, str) {
    str = str.split("").map(x => x.charCodeAt(0))
    str.push(0)
    var mem = new Uint8Array(memory.buffer, address, MAX_STR_SIZE)
    mem.set(new Uint8Array(str))
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