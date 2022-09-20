#include "include.h"
#include <stdlib.h>
#include <stdio.h>

int counter = 0;

exportable(void) myButton () {
  char *outstr = malloc(100);
  sprintf(outstr, "My Counter is: %i", counter++);
  window_alert(STRING, INT_FROM(outstr));
  free(outstr);
} 

int main () {
  console_string("Hello,World!");
  console_double(10.2);
  console_int(100);

  eventTarget_addEventListener("foo", "click", "myButton");
  Element_setProperty("text", "innerText", STRING, "open up the console ->");
  eval("console.log('hello from WASM')");
  return 0;
}