import { defineStore } from 'pinia';
import auth from '@/api/auth';
import setLocal from '../utils/storage';

interface AuthState {
  token: string | null;
  org: string | null;
  project: string | null;
  flowOrg: string | null;

  flowToken: string | null;
  loadingFlowToken: boolean | null;
  errorFlowToken: unknown | null;
}

export const auth_store = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    org: null,
    project: null,
    flowOrg: null,

    flowToken: null,
    loadingFlowToken: null,
    errorFlowToken: null,
  }),
  getters: {
    authenticated(state: AuthState): boolean {
      return !!state.token;
    },
  },
  actions: {
    async externalLogin({ token }: { token: string }) {
      if (!token) return;
      this.token = token;
      setLocal('authToken', token);
    },
    async selectedOrg({ org }: { org: string }) {
      if (!org) return;
      this.org = org;
      setLocal('org', org);
    },
    async selectedProject({ project }: { project: string }) {
      if (!project) return;
      this.project = project;
      setLocal('project', project);
    },
    async selectedFlowOrg({ flowOrg }: { flowOrg: string }) {
      if (!flowOrg) return;
      this.flowOrg = flowOrg;
      setLocal('flowOrg', flowOrg);
    },
    retriveAuthToken() {
      if (window.localStorage) {
        const token = window.localStorage.getItem('authToken');
        if (token) {
          this.token = token;
          setLocal('authToken', token);
        }
      }
    },
    retriveSelectedOrg() {
      if (window.localStorage) {
        const org = window.localStorage.getItem('org');
        if (org) {
          this.org = org;
          setLocal('org', org);
        }
      }
    },
    retriveSelectedProject() {
      if (window.localStorage) {
        const project = window.localStorage.getItem('project');
        if (project) {
          this.project = project;
          setLocal('project', project);
        }
      }
    },
    retriveSelectedFlowOrg() {
      if (window.localStorage) {
        const flowOrg = window.localStorage.getItem('flowOrg');
        if (flowOrg) {
          this.flowOrg = flowOrg;
          setLocal('flowOrg', flowOrg);
        }
      }
    },
    async getFlowToken() {
      this.loadingFlowToken = true;
      this.errorFlowToken = null;
      this.flowToken = null;
      try {
        const { data } = await auth.getFlowToken();
        this.flowToken = data.api_token;
        this.loadingFlowToken = false;
      } catch (err) {
        this.errorFlowToken = err;
        this.loadingFlowToken = false;
      }
    },
  },
});
