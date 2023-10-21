import { spawn } from "child_process";
import * as os from "os";
import * as vscode from "vscode";

export async function install() {
  const packageToInstall = "@spheron/cli";
  let command;
  const args = ["install", "-g", packageToInstall];

  if (os.platform() === "darwin" || os.platform() === "linux") {
    command = "sudo npm i -g @spheron/cli";

    const terminal = vscode.window.createTerminal("Spheron Install");

    terminal.sendText(command);
    terminal.show();
  } else {
    command = "npm";

    const childProcess = spawn(command, args);

    childProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    childProcess.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }
}
