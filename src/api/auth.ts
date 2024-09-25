import request from './request';

const resource = '/api/v1';

async function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

interface ProjectResponse {
  data: Project;
}

interface Project {
  organization: string | null;
}

interface GetProjectParams {
  uuid: string;
}

export default {
  async getFlowToken(): Promise<any> {
    return request.$http.get(`${resource}/internal/user-api-token`);
  },
  async getProject({ uuid }: GetProjectParams): Promise<ProjectResponse> {
    return request.$http.get(`/v1/organization/project/${uuid}/`);
  },
  async getFlowOrganization(projectUuid: string): Promise<string | null> {
    const response = await this.getProject({ uuid: projectUuid });
    const project = response.data;

    if (project.organization) {
      return project.organization;
    } else {
      await sleep(3);
      return await this.getFlowOrganization(projectUuid);
    }
  },
};
