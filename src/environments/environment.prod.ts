export const environment = {
  production: true,
  useMocks: false,
  contact: '',
  firebase: {
    config: {
      apiKey: '<your-api-key>',
      authDomain: '<your-project-authdomain>',
      databaseURL: '<your-database-URL>',
      projectId: '<your-project-id>',
      storageBucket: '<your-storage-bucket>',
      messagingSenderId: '<your-messaging-sender-id>',
      appId: '<your-app-id>',
      measurementId: '<your-measurement-id>',
    },
    functionsRegion: 'us-central1',
    functionsLocal: true,
  },
};
