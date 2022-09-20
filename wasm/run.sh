# emcc \
# -Wl,--import-memory \
# $1.c -Os -s \
# WASM=1 -s SIDE_MODULE=1 \
# -o compiled/$1.wasm


emcc --no-entry $1.c -o compiled/$1.wasm \
-s STANDALONE_WASM \
-s WARN_ON_UNDEFINED_SYMBOLS=0 \
-s EXPORTED_FUNCTIONS='[_main]'
