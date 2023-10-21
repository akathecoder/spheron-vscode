export interface ProjectType {
  _id: string;
  passwordProtection: PasswordProtection;
  type: string;
  deploymentEnvironments: DeploymentEnvironment[];
  latestDeployment: LatestDeployment;
  state: string;
  hookId: string;
  skipAllRelative: boolean;
  name: string;
  url: string;
  organization: string;
  provider: string;
  configuration: Configuration2;
  createdBy: string;
  repositoryId: string;
  providerOrganizationId: string;
  environmentVariables: any[];
  prCommentIds: any[];
  createdAt: string;
  updatedAt: string;
  domains: Domain[];
}

export interface PasswordProtection {
  enabled: boolean;
  credentials: any[];
}

export interface DeploymentEnvironment {
  _id: string;
  branches: string[];
  status: string;
  isFree: boolean;
  name: string;
  protocol: string;
  createdAt: string;
  updatedAt: string;
}

export interface LatestDeployment {
  _id: string;
  configuration: Configuration;
  gitProviderPreferences: GitProviderPreferences;
  commitMessage: string;
  buildDirectory: any[];
  status: string;
  buildTime: number;
  memoryUsed: number;
  failedMessage: string;
  pickedUpByDeployerAt: number;
  encrypted: boolean;
  skipAllRelative: boolean;
  topic: string;
  project: string;
  deploymentEnvironmentName: string;
  commitId: string;
  deploymentInitiator: string;
  branch: string;
  externalRepositoryName: any;
  protocol: string;
  isFromRequest: boolean;
  logs: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Configuration {
  nodeVersion: string;
  framework: string;
  workspace: string;
  installCommand: string;
  buildCommand: string;
  publishDir: string;
}

export interface GitProviderPreferences {
  prComments: boolean;
  commitComments: boolean;
  buildStatus: boolean;
  githubDeployment: boolean;
}

export interface Configuration2 {
  _id: string;
  nodeVersion: string;
  framework: string;
  workspace: string;
  installCommand: string;
  buildCommand: string;
  publishDir: string;
}

export interface Domain {
  _id: string;
  verified: boolean;
  deploymentEnvironmentIds: string[];
  version: string;
  name: string;
  link: string;
  projectId: string;
  type: string;
  appType: number;
  createdAt: string;
  updatedAt: string;
}
