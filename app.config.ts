module.exports = {
  expo: {
    name: 'Nomad',
    slug: 'digital-nomad-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'digitalnomadapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.coffstack.digitalnomadapp',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#1B1B1B',
      },
      edgeToEdgeEnabled: true,
      package: 'com.coffstack.digitalnomadapp',
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#1B1B1B',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      'expo-font',
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '2dff9c6b-d747-47b3-b823-1c0405d021c7',
      },
    },
  },
};
