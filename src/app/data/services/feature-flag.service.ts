import { Injectable } from '@angular/core';
//import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';
import {
  RemoteConfig,
  fetchAndActivate,
  getValue,
  fetchConfig as fetchfire,
  activate,
} from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  constructor(private remoteConfig: RemoteConfig) {
    this.initRemoteConfig();
  }

  async initRemoteConfig() {
    try {

      this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
      this.remoteConfig.defaultConfig = {
        new_feature_enabled: 'true', 
      };
      await fetchfire(this.remoteConfig); 
      await activate(this.remoteConfig);
      fetchAndActivate(this.remoteConfig);
    } catch (error) {
      console.error('Error initializing Remote Config', error);
    }
  }

  async isNewFeatureEnabled(): Promise<boolean> {
    const reponse: any = await getValue(
      this.remoteConfig,
      'new_feature_enabled'
    );
    return reponse._value === 'true';
  }
}
