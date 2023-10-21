import { log } from "console";
import * as vscode from "vscode";
import { fetchOrganisations, fetchProjects } from "../utils/fetchOrganisations";
import {
  DeploymentEnvironment,
  Domain,
  ProjectType,
} from "../utils/projectModal";

type SpheronDeployment =
  | Organisation
  | Project
  | DeploymentEnvironments
  | DeploymentEnvironmentItem
  | GeneralTextBox
  | Domains
  | DomainItem;

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
        return Promise.resolve(Project.generateElement(element));
      } else if (element instanceof DeploymentEnvironments) {
        return Promise.resolve(DeploymentEnvironments.generateElement(element));
      } else if (element instanceof DeploymentEnvironmentItem) {
        return Promise.resolve(
          DeploymentEnvironmentItem.generateElement(element)
        );
      } else if (element instanceof Domains) {
        return Promise.resolve(Domains.generateElement(element));
      } else if (element instanceof DomainItem) {
        return Promise.resolve(DomainItem.generateElement(element));
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

  static generateElement(element: Project) {
    return [
      new GeneralTextBox(
        "ID: " + element.project._id,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Name: " + element.project.name,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "State: " + element.project.state,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Url: " + element.project.url,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Organization: " + element.project.organization,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Provider: " + element.project.provider,
        vscode.TreeItemCollapsibleState.None
      ),
      new DeploymentEnvironments(element.project.deploymentEnvironments),
      new Domains(element.project.domains),
    ];
  }
}

class DeploymentEnvironments extends vscode.TreeItem {
  deploymentEnvironments;
  constructor(deploymentEnvironments: DeploymentEnvironment[]) {
    super("DeploymentEnvironments", vscode.TreeItemCollapsibleState.Collapsed);
    this.deploymentEnvironments = deploymentEnvironments;
  }

  static generateElement(element: DeploymentEnvironments) {
    return element.deploymentEnvironments.map((deploymentEnvironment) => {
      return new DeploymentEnvironmentItem(
        deploymentEnvironment.name,
        deploymentEnvironment,
        vscode.TreeItemCollapsibleState.Collapsed
      );
    });
  }
}

class DeploymentEnvironmentItem extends vscode.TreeItem {
  deploymentEnvironment;
  constructor(
    label: string,
    deploymentEnvironment: DeploymentEnvironment,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.deploymentEnvironment = deploymentEnvironment;
  }

  static generateElement(element: DeploymentEnvironmentItem) {
    return [
      new GeneralTextBox(
        "ID: " + element.deploymentEnvironment._id,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Name: " + element.deploymentEnvironment.name,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Status: " + element.deploymentEnvironment.status,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Created At: " + element.deploymentEnvironment.createdAt,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Updated At: " + element.deploymentEnvironment.updatedAt,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Protocol: " + element.deploymentEnvironment.protocol,
        vscode.TreeItemCollapsibleState.None
      ),

      new GeneralTextBox(
        "isFree: " + element.deploymentEnvironment.isFree.toString(),
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Branches: " + element.deploymentEnvironment.branches.join(", "),
        vscode.TreeItemCollapsibleState.None
      ),
    ];
  }
}

class Domains extends vscode.TreeItem {
  domains;
  constructor(domains: Domain[]) {
    super("Domains", vscode.TreeItemCollapsibleState.Collapsed);
    this.domains = domains;
  }

  static generateElement(element: Domains) {
    return element.domains.map((domain) => {
      return new DomainItem(
        domain.name,
        domain,
        vscode.TreeItemCollapsibleState.Collapsed
      );
    });
  }
}

class DomainItem extends vscode.TreeItem {
  domain;
  constructor(
    label: string,
    domain: Domain,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.domain = domain;
  }

  static generateElement(element: DomainItem) {
    return [
      new GeneralTextBox(
        "ID: " + element.domain._id,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Link: " + element.domain.link,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Type: " + element.domain.type,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Project ID: " + element.domain.projectId,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Verified: " + element.domain.verified,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Version: " + element.domain.version,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Created At: " + element.domain.createdAt,
        vscode.TreeItemCollapsibleState.None
      ),
      new GeneralTextBox(
        "Updated At: " + element.domain.updatedAt,
        vscode.TreeItemCollapsibleState.None
      ),
    ];
  }
}

class GeneralTextBox extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.contextValue = "generalTextBox";
  }
}
