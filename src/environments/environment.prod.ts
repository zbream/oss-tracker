export const environment = {
  production: true,
  useMocks: false,
  contact: '',
  firebase: {
    config: {
      apiKey: '<your-key>',
      authDomain: '<your-project-authdomain>',
      databaseURL: '<your-database-URL>',
      projectId: '<your-project-id>',
      storageBucket: '<your-storage-bucket>',
      messagingSenderId: '<your-messaging-sender-id>',
    },
    name: 'oss-tracker-angular',
    functionsRegion: 'us-central1',
    functionsEmulatorOrigin: undefined,
    // functionsEmulatorOrigin: 'http://localhost:5000',
  },
};
