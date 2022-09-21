#include <stdint.h>
#include <emscripten.h>
#include <stdlib.h>
#include <stdio.h>


#define MAX_STR_SIZE 1000

extern void console_string(char * output);
extern void console_int(int number);
extern void console_double(double number);

extern void eventTarget_addEventListener(char * id, char * event, char * fn_as_string);
extern void element_setProperty(char * id, char * properties, char * string);
extern void element_getProperty(char * id, char * properties, char * outString);
extern void window_alert(char * string);

extern void eval(char* evalstr);
extern void js_sleep(int seconds);

char _outstr_[100];
char * _os_p_ = _outstr_;

#define FMT_STR(fmt, ...) ({\
    _os_p_ = _outstr_;\
    sprintf(_os_p_, fmt, __VA_ARGS__);\
    _outstr_;\
    })

#define exported(type) type EMSCRIPTEN_KEEPALIVE

#define STRING 0
#define NUMBER 1

#define PASSABLE(t) (uint64_t)(t)