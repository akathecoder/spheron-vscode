import { spawn } from "child_process";
import * as os from "os";
import * as vscode from "vscode";

export async function installExtension() {
  const packageToInstall = "@spheron/cli";
  let command;
  const args = ["install", "-g", packageToInstall];

  if (os.platform() === "darwin" || os.platform() === "linux") {
    command = "sudo npm";
  } else {
    command = "npm";
  }

  const password = await vscode.window.showInputBox({
    placeHolder: "Password",
    prompt: "Enter User Password",
    // password: true,
  });
  if (password === "") {
    vscode.window.showErrorMessage(
      "Password is needed to install the spheron cli"
    );
  }

  if (password !== undefined) {
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
