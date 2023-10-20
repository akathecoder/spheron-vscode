import { spawn } from "child_process";
import * as vscode from "vscode";
import { installExtension } from "./commands/installExtension";
import { login } from "./commands/login";
import { upload } from "./commands/upload";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("spheron-extention.install", () => {
      installExtension();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("spheron-extention.login", () => {
      login();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("spheron-extention.upload", () => {
      upload();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("spheron-extention.test", () => {
      const childProcess = spawn("npm", ["-sss"]);

      childProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      childProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      childProcess.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
      });
    })
  );
}

export function deactivate() {}
