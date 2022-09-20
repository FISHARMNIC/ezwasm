#include <stdint.h>
#include <emscripten.h>

extern void console_string(char *);
extern void console_int(uint64_t);
extern void console_double(double);

extern void eventTarget_addEventListener(char *, char *, char *);
extern void Element_setProperty(char *, char *, int type, char *);
extern void window_alert(int, uint64_t);

extern void eval(char*);

#define exportable(type) type EMSCRIPTEN_KEEPALIVE

#define STRING 0
#define NUMBER 1

#define INT_FROM(t) (uint64_t)(t)