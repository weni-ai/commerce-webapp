import { defineStore } from 'pinia';
import feature from '@/api/feature';

interface FeatureState {
  features: any[];
  errorFeatures: any;
  loadingFeatures: boolean;
}

export const useFeatureStore = defineStore('feature', {
  state: (): FeatureState => ({
    features: [],
    errorFeatures: null,
    loadingFeatures: false,
  }),
  getters: {
    features(state: FeatureState): boolean {
      return !!state.features;
    },
  },
  actions: {
    async getFeatures(uuid: string | null) {
      if (!uuid) return;
      this.loadingFeatures = true;
      try {
        this.features = await feature.getFeature(uuid);
      } catch (error) {
        this.errorFeatures = error;
      }
      this.loadingFeatures = false;
    },
  },
});
