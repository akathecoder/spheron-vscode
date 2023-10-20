import { spawn } from "child_process";
import * as vscode from "vscode";

export async function login() {
  const command = "spheron";
  let args = ["login"];

  const provider = await vscode.window.showQuickPick(
    ["GitHub", "GitLab", "Bitbucket"],
    {
      title: "Select a provider",
      canPickMany: false,
    }
  );

  if (provider === undefined) {
    return;
  }

  args.push("--" + provider.toLowerCase());

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
