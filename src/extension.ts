import { spawn } from "child_process";
import * as vscode from "vscode";
import { init } from "./commands/init";
import { install } from "./commands/install";
import { login } from "./commands/login";
import { upload } from "./commands/upload";
import { create_organisation } from "./commands/create_organisation";
import { configure } from "./commands/configure";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("spheron-extention.install", () => {
      install();
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
    vscode.commands.registerCommand("spheron-extention.init", () => {
      init();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("spheron-extention.publish", () => {
      init();
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

  context.subscriptions.push(
    vscode.commands.registerCommand("spheron-extention.create_organisation", () => {
      create_organisation();
    })
  );
  
  context.subscriptions.push(
    vscode.commands.registerCommand("spheron-extention.configure", () => {
      configure();
    })
  );
}

export function deactivate() {}
