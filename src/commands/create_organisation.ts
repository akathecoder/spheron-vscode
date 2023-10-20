import { spawn } from "child_process";
import * as vscode from "vscode";

export async function create_organisation() {
  const command = "spheron";
  let args = ["create-organization"];

  const name = await vscode.window.showInputBox({
    placeHolder: "Name",
    prompt: "Enter Organisation Name",
  });
  if (name === "" || name === undefined) {
    vscode.window.showErrorMessage(
      "Name is required to create Organisation"
    );
return;
  }

  const userName = await vscode.window.showInputBox({
    placeHolder: "Username",
    prompt: "Enter user name",
  });
  if (userName === "" || userName === undefined) {
    vscode.window.showErrorMessage(
      "Username is required to create Organisation"
    );
    return;
  }

  args.push("--name" , name.toLowerCase());
  args.push("--username" , userName.toLowerCase());

  const childProcess = spawn(command, args);

  childProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  childProcess.on("close", (code) => {
    if (code === 0) {
      vscode.window.showInformationMessage("Organisation created successfully");
    } else {
      console.log(`child process exited with code ${code}`);
    }
  });
}
