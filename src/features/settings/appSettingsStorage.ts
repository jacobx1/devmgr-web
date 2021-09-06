import { AppSettings } from './types';

export const getSettings = (): AppSettings => {
  const rawSettings = localStorage.getItem('appSettings');
  let settings: AppSettings = {
    githubBaseUrl: '',
    githubToken: '',
    engineers: [],
  };
  if (rawSettings) {
    const parsedSettings = JSON.parse(rawSettings) as AppSettings;
    settings = {
      ...settings,
      ...parsedSettings,
    };
  }
  return settings;
};

export const setSettings = (settings: AppSettings) => {
  localStorage.setItem('appSettings', JSON.stringify(settings));
};
