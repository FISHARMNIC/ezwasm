#include "wasm.h"

int counter = 0;

exported(void) myButtonHandler()
{
  window_alert(FMT_STR("My Counter is: %i", counter++));
}

exported(void) input_enter_handle()
{
  char inputBuffer[MAX_STR_SIZE];
  // <input id="input"/> 
  element_getProperty("input", "value", inputBuffer);
  // <p id="inputOut"></p>
  element_setProperty("inputOut", "innerText", inputBuffer);
}

int main()
{
  console_string("Hello,World!");
  console_double(10.2);
  console_int(100);

  // <button id="myButton"> Hello World! </button> <br>
  eventTarget_addEventListener("myButton", "click", "myButtonHandler");
  
  // <p id="text"></p>
  element_setProperty("text", "innerText", "open up the console ->");
  element_setProperty("text", "style.color", "red");

  eval("console.log('hello from WASM')");
  
  // <button id="input_enter"> Enter</button>
  eventTarget_addEventListener("input_enter", "click", "input_enter_handle");

  return 0;
}