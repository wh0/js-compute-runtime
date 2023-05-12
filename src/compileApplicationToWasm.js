import { dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import { isFile } from "./isFile.js";
import { isFileOrDoesNotExist } from "./isFileOrDoesNotExist.js";
import wizer from "@bytecodealliance/wizer";
import weval from "@cfallin/weval";
import { precompile } from "./precompile.js";
import { bundle } from "./bundle.js";
import { containsSyntaxErrors } from "./containsSyntaxErrors.js";

export async function compileApplicationToWasm(input, output, wasmEngine, enableExperimentalHighResolutionTimeMethods = false, enableWeval = false) {
  try {
    if (!(await isFile(input))) {
      console.error(
        `Error: The \`input\` path does not point to a file: ${input}`
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(
      `Error: The \`input\` path points to a non-existant file: ${input}`
    );
    process.exit(1);
  }

  try {
    await readFile(input, { encoding: "utf-8" });
  } catch (error) {
    console.error(
      "Error: Failed to open the `input` (${input})",
      error.message
    );
    process.exit(1);
  }

  try {
    if (!(await isFile(wasmEngine))) {
      console.error(
        `Error: The \`wasmEngine\` path does not point to a file: ${wasmEngine}`
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(
      `Error: The \`wasmEngine\` path points to a non-existant file: ${wasmEngine}`
    );
    process.exit(1);
  }
  try {
    await mkdir(dirname(output), {
      recursive: true,
    });
  } catch (error) {
    console.error(
      `Error: Failed to create the \`output\` (${output}) directory`,
      error.message
    );
    process.exit(1);
  }

  try {
    if (!(await isFileOrDoesNotExist(output))) {
      console.error(
        `Error: The \`output\` path does not point to a file: ${output}`
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(
      `Error: Failed to check whether the \`output\` (${output}) is a file path`,
      error.message
    );
    process.exit(1);
  }

  if (containsSyntaxErrors(input)) {
    process.exit(1);
  }

  let contents = await bundle(input);

  let application = precompile(contents.outputFiles[0].text);

  try {
    let wizerProcess;
    let spawnEnv = 
      {
        stdio: [null, process.stdout, process.stderr],
        input: application,
        shell: true,
        encoding: "utf-8",
        env: {
          ENABLE_EXPERIMENTAL_HIGH_RESOLUTION_TIME_METHODS: enableExperimentalHighResolutionTimeMethods ? '1' : '0'
        }
      };
    if (enableWeval) {
      let wevalBinary = await weval();  // Lazily fetch the toolchain.
      wizerProcess = spawnSync(
        wevalBinary,
        [
          "-w",
          "-o",
          output,
          "-i",
          wasmEngine,
        ],
        spawnEnv
      );
    } else {
      wizerProcess = spawnSync(
        wizer,
        [
          "--inherit-env=true",
          "--allow-wasi",
          `--dir=.`,
          `--wasm-bulk-memory=true`,
          "-r _start=wizer.resume",
          `-o=${output}`,
          wasmEngine,
        ],
        spawnEnv
      );
    }
    if (wizerProcess.status !== 0) {
      throw new Error(`Wizer initialization failure`);
    }
    process.exitCode = wizerProcess.status;
  } catch (error) {
    console.error(`Error: Failed to compile JavaScript to Wasm: `, error.message);
    process.exit(1);
  }
}
