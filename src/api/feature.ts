import request from './request';

const resource: string = '/v2/feature';
const integrated_resource: string = '/v2/integrated_feature/';

export default {
  async getFeature(uuid: string): Promise<any> {
    return await request.$http
      .get(`${resource}/${uuid}/?category=PASSIVE`)
      .then((r) => r.data);
  },
  async getIntegratedFeatures(uuid: string) {
    return await request.$http
      .get(`${integrated_resource}/${uuid}/`)
      .then((r) => r.data);
  },
};
