import axios from "axios";
import { spawn } from "child_process";
import * as vscode from "vscode";
import { configure } from "./commands/configure";
import { create_organisation } from "./commands/create_organisation";
import { init } from "./commands/init";
import { install } from "./commands/install";
import { login } from "./commands/login";
import { upload } from "./commands/upload";
import { SPHERON_ENDPOINT } from "./constants";
import { SpheronDeploymentsProvider } from "./treeProviders/nodeTreeProvider";
import { checkApiKey } from "./utils/checkApiKey";

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
    vscode.commands.registerCommand(
      "spheron-extention.create_organisation",
      () => {
        create_organisation();
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("spheron-extention.configure", () => {
      configure();
    })
  );

  axios.defaults.baseURL = SPHERON_ENDPOINT;
  if (context.globalState.get("apiKey") !== undefined) {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + context.globalState.get("apiKey");
  }

  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  if (!rootPath) {
    return;
  }
  const spheronDeploymentsProvider = new SpheronDeploymentsProvider(rootPath);

  vscode.window.createTreeView("deployments", {
    treeDataProvider: spheronDeploymentsProvider,
  });
  vscode.commands.registerCommand("deployments.addApiKey", async () => {
    const apiKey = await vscode.window.showInputBox({
      prompt: "Enter API Key",
    });

    if (apiKey !== undefined && apiKey !== "") {
      checkApiKey(apiKey).then((result) => {
        if (result === true) {
          context.globalState.update("apiKey", apiKey);
          axios.defaults.headers.common["Authorization"] = "Bearer " + apiKey;
          vscode.window.showInformationMessage(`Successfully added API Key.`);
        } else {
          vscode.window.showErrorMessage(`Invalid API Key.`);
        }
      });
    }
  });

  vscode.commands.registerCommand("deployments.removeApiKey", async () => {
    context.globalState.update("apiKey", "");
    vscode.window.showInformationMessage(`Successfully removed API Key.`);
  });

  vscode.commands.registerCommand("deployments.isApiKey", async () => {
    return context.globalState.get("apiKey");
  });

  vscode.commands.registerCommand("deployments.refresh", () =>
    spheronDeploymentsProvider.refresh()
  );
}

export function deactivate() {}
