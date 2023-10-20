import { spawn } from "child_process";
import * as vscode from "vscode";

export async function logout() {
  const command = "spheron";
  let args = ["logout"];

  const childProcess = spawn(command, args);

  childProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  childProcess.on("close", (code) => {
    if (code === 0) {
      vscode.window.showInformationMessage("Logged out successfully");
    } else {
      console.log(`child process exited with code ${code}`);
    }
  });
}
