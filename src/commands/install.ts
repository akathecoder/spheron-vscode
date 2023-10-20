import { spawn } from "child_process";
import * as os from "os";
import * as vscode from "vscode";

export async function install() {
  const packageToInstall = "@spheron/cli";
  let command;
  const args = ["install", "-g", packageToInstall];

  if (os.platform() === "darwin" || os.platform() === "linux") {
    command = "sudo npm";

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
      const echoEvent = spawn("echo", [password]);
      const childProcess = spawn(command, args);

      echoEvent.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
        childProcess.stdin.write(data);
      });

      echoEvent.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      echoEvent.on("close", (code) => {
        if (code !== 0) {
          console.log(`Process exited with code ${code}`);
        }
        childProcess.stdin.end();
      });

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
