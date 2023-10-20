import { spawn } from "child_process";
import * as vscode from "vscode";

export async function publish() {
  const command = "spheron";
  let args = ["publish"];

  const outputChannel = vscode.window.createOutputChannel("Spheron Publish");

  const childProcess = spawn(command, args);

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    outputChannel.appendLine(`stderr: ${data}`);
  });

  childProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    outputChannel.appendLine(`stdout: ${data}`);
  });

  childProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    outputChannel.appendLine(`child process exited with code ${code}`);
  });
}
