import request from './request';

const resource = '/api/v1';

export default {
  getFlowToken(): Promise<any> {
    return request.$http.get(`${resource}/internal/user-api-token`);
  },
};
