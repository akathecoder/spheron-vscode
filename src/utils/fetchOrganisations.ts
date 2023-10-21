import axios from "axios";
import { ProjectType } from "./projectModal";

export async function fetchOrganisations(): Promise<
  {
    appType: string;
    id: string;
    name: string;
    username: string;
  }[]
> {
  const result = await axios.get("/api-keys/scope");

  console.log(result);

  if (result.status === 200) {
    console.log(result.data);
    return result.data.organizations;
  }

  return [];
}

export async function fetchProjects(orgId: string): Promise<ProjectType[]> {
  const result = await axios.get(`/organization/${orgId}/projects`);

  console.log(result);

  if (result.status === 200) {
    console.log(result.data);
    return result.data.projects;
  }

  return [];
}
