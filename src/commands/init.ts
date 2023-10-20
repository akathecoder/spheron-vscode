import { spawn } from "child_process";
import * as vscode from "vscode";
import { selectWorkspace } from "../utils/selectWorkspace";

export async function init() {
  const command = "spheron";
  let args = ["init"];

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

  const workspace = await selectWorkspace();

  if (workspace === undefined) {
    return;
  }

  args.push("[ --path", workspace, "]");

  const project = await vscode.window.showInputBox({
    prompt: "Enter Project Name (optional)",
  });

  if (project !== undefined && project !== "") {
    args.push("[ --project", project, "]");
  }

  const framework = await vscode.window.showQuickPick(
    [
      "static",
      "react",
      "vue",
      "angular",
      "next",
      "preact",
      "nuxt2",
      "docusaurus",
      "hugo",
      "eleventy",
      "svelte",
      "gatsby",
      "sanity",
      "ionicreact",
      "vite",
      "scully",
      "stencil",
      "brunch",
      "ionicangular",
    ],
    {
      title: "Select a framework (optional)",
      canPickMany: false,
    }
  );

  if (framework !== undefined && framework !== "") {
    args.push("[ --framework", framework, "]");
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
        `Succesfully created Spheron Project.`
      );
    } else {
      vscode.window.showErrorMessage(`child process exited with code ${code}`);
    }
  });
}
