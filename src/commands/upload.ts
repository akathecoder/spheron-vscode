import { spawn } from "child_process";
import * as vscode from "vscode";
import { selectWorkspace } from "../utils/selectWorkspace";

export async function upload() {
  const command = "spheron";
  let args = ["upload"];

  const workspace = await selectWorkspace();

  if (workspace === undefined) {
    return;
  }

  args.push("--path", workspace);

  const protocol = await vscode.window.showQuickPick(
    ["Arweave", "Filecoin", "IPFS"],
    {
      title: "Select a protocol",
      canPickMany: false,
    }
  );

  if (protocol === undefined) {
    return;
  }

  args.push("--protocol", protocol.toLowerCase());

  const bucket = await vscode.window.showInputBox({
    prompt: "Enter Bucket",
  });

  if (bucket !== undefined && bucket !== "") {
    args.push("[ --bucket", bucket, "]");
  }

  const project = await vscode.window.showInputBox({
    prompt: "Enter Project Name (optional)",
  });

  if (project !== undefined && project !== "") {
    args.push("[ --project", project, "]");
  }

  const organizationId = await vscode.window.showInputBox({
    prompt: "Enter Organization ID (optional)",
  });

  if (organizationId !== undefined && organizationId !== "") {
    args.push("[ --organization", organizationId, "]");
  }

  const childProcess = spawn(command, args);

  childProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    if (data.toString().toLowerCase().includes("error")) {
      vscode.window.showErrorMessage(data.toString());
    }
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    vscode.window.showErrorMessage(data.toString());
  });

  childProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      vscode.window.showInformationMessage(
        `Succesfully uploaded to ${protocol}`
      );
    } else {
      vscode.window.showErrorMessage(`child process exited with code ${code}`);
    }
  });
}
