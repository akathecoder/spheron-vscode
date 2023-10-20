import * as vscode from "vscode";

export async function selectWorkspace() {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace found.");
    return;
  }

  const workspaceFolderInfos = workspaceFolders.map((folder) => {
    return { name: folder.name, uri: folder.uri };
  });

  if (workspaceFolderInfos.length === 1) {
    return workspaceFolderInfos[0].uri.fsPath;
  }

  const selectedWorkspace = await vscode.window.showQuickPick(
    workspaceFolderInfos.map((folder) => folder.name),
    {
      placeHolder: "Select a workspace",
    }
  );

  if (!selectedWorkspace) {
    vscode.window.showErrorMessage("No workspace selected.");
    return;
  }

  return workspaceFolderInfos.find(
    (folder) => folder.name === selectedWorkspace
  )?.uri.fsPath;
}
