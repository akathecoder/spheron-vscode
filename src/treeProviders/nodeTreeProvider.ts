import { log } from "console";
import * as vscode from "vscode";
import { fetchOrganisations, fetchProjects } from "../utils/fetchOrganisations";
import { ProjectType } from "../utils/projectModal";

type SpheronDeployment =
  | Organisation
  | Project
  | DeploymentEnvironments
  | GeneralTextBox
  | Domain;

export class SpheronDeploymentsProvider
  implements vscode.TreeDataProvider<SpheronDeployment>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    SpheronDeployment | undefined | null | void
  > = new vscode.EventEmitter<SpheronDeployment | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    SpheronDeployment | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: SpheronDeployment): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SpheronDeployment): Thenable<SpheronDeployment[]> {
    if (element) {
      if (element instanceof Organisation) {
        return Promise.resolve(
          this.getProjectsTree(element.id).then((projectTree) => {
            log(projectTree);
            return projectTree;
          })
        );
      } else if (element instanceof Project) {
        return Promise.resolve([
          new DeploymentEnvironments(
            "Deployment Environments",
            element.project,
            vscode.TreeItemCollapsibleState.Collapsed
          ),
        ]);
      } else if (element instanceof DeploymentEnvironments) {
        return Promise.resolve([
          new GeneralTextBox(
            JSON.stringify(element.project.deploymentEnvironments, null, 2),
            vscode.TreeItemCollapsibleState.Collapsed
          ),
        ]);
      }

      log(element.label);
      return Promise.resolve([]);
    } else {
      return vscode.commands
        .executeCommand("deployments.isApiKey")
        .then(async (result) => {
          if (result !== undefined) {
            const orgs = await fetchOrganisations();

            return orgs.map((org) => {
              return new Organisation(
                org.id,
                org.name,
                org.appType,
                org.username,
                vscode.TreeItemCollapsibleState.Collapsed
              );
            });
          }
          return [];
        });
    }
  }

  private async getProjectsTree(orgId: string) {
    const projects = await fetchProjects(orgId);
    return projects.map((project) => {
      return new Project(
        project.name,
        project,
        vscode.TreeItemCollapsibleState.Collapsed
      );
    });
  }

  private async getProjectTree(project: ProjectType) {}
}

class Organisation extends vscode.TreeItem {
  id = "";
  username = "";
  appType = "";

  constructor(
    id: string,
    label: string,
    appType: string,
    username: string,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.appType}`;
    this.description = this.appType;
    this.id = id;
    this.username = username;
    this.appType = appType;
  }
}

class Project extends vscode.TreeItem {
  project;

  constructor(
    label: string,
    project: ProjectType,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.project = project;
  }
}

class DeploymentEnvironments extends vscode.TreeItem {
  project;
  constructor(
    label: string,
    project: ProjectType,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.project = project;
  }
}

class Domain extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
  }
}

class GeneralTextBox extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
  }
}
