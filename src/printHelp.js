import { printVersion } from "./printVersion.js";

export async function printHelp() {
  await printVersion();
  console.log(`
USAGE:
    js-compute-runtime [FLAGS] [OPTIONS] [ARGS]

FLAGS:
    -h, --help                                              Prints help information
    -V, --version                                           Prints version information

OPTIONS:
    --engine-wasm <engine-wasm>                             The JS engine Wasm file path
    --enable-weval                                          Enable experimental weval mode which will partially evaluate the SpiderMonkey JS interpreter together with JS scripts, ahead-of-time, to produce compiled code
    --enable-experimental-high-resolution-time-methods      Enable experimental high-resolution fastly.now() method

ARGS:
    <input>     The input JS script's file path [default: bin/index.js]
    <output>    The file path to write the output Wasm module to [default: bin/main.wasm]
`);
}
