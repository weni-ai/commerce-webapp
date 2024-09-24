import request from './request';

const resource: string = '/v2/feature';

export default {
  async getFeature(uuid: string): Promise<any> {
    return await request.$http
      .get(`${resource}/${uuid}/?category=PASSIVE`)
      .then((r) => r.data);
  },
};
