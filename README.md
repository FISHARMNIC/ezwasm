# ezwasm
A simple framework that allows live interaction between C and HTML on a website
```
#include "wasm.h"

int counter = 0;

exported(void) myButtonHandler()
{
  window_alert(strfmt("My Counter is: %i", counter++));
}

exported(void) input_enter_handle()
{
  // <input id="input"/> 
  // <p id="inputOut"></p>

  char * inputBuffer = element_getProperty("input", "value");
  element_setProperty("inputOut", "innerText", inputBuffer);
  wclose(inputBuffer);
}

int main()
{
  console_string("Hello,World!");
  console_double(10.2);
  console_int(100);
  console_printf("Hello %i %s", 123, "World");
  
  // <button id="myButton"> Hello World! </button> <br>
  eventTarget_addEventListener("myButton", "click", "myButtonHandler");
  
  // <p id="text"></p>
  element_setProperty("text", "innerText", "open up the console ->");
  element_setProperty("text", "style.color", "red");

  eval("console.log('hello from WASM')");
  
  char * date = eval_rstr("(new Date).toString()");
  console_string(date);
  wclose(date);

  // <button id="input_enter"> Enter</button>
  eventTarget_addEventListener("input_enter", "click", "input_enter_handle");

  return 0;
}
```
