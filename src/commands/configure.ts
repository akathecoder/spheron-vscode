import { spawn } from "child_process";
import * as vscode from "vscode";

export async function configure() {
  const command = "spheron";
  let args = ["configure"];

  const organizationId = await vscode.window.showInputBox({
    placeHolder: "Organisation ID",
    prompt: "Enter Organisation ID",
  });
  if (organizationId === "" || organizationId === undefined) {
    vscode.window.showErrorMessage(
      "Organisation Id is required to configure"
    );
return;
  }


  args.push("--organization", organizationId.toLowerCase());

  const childProcess = spawn(command, args);

  childProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  childProcess.on("close", (code) => {
    if (code === 0) {
      vscode.window.showInformationMessage("Configured successfully");
    } else {
      console.log(`child process exited with code ${code}`);
    }
  });
}
