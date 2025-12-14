// jest.setup.js
// Global mocks and configuration for Jest

import 'react-native-gesture-handler/jestSetup';

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  ACCESS_CONTROL: {
    BIOMETRY_ANY: 'BIOMETRY_ANY',
  },
  ACCESSIBLE: {
    WHEN_UNLOCKED: 'WHEN_UNLOCKED',
  },
  AUTHENTICATION_TYPE: {
    BIOMETRICS: 'BIOMETRICS',
  },
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
      reset: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock @chuvincent/react-native-tts
jest.mock('@chuvincent/react-native-tts', () => {
  const mockTts = {
    getInitStatus: jest.fn(() => Promise.resolve('success')),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    speak: jest.fn(),
    stop: jest.fn(),
    setDefaultLanguage: jest.fn(),
    setDefaultRate: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockTts,
    ...mockTts,
  };
});



// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-fs
jest.mock('react-native-fs', () => ({
  mkdir: jest.fn(),
  moveFile: jest.fn(),
  copyFile: jest.fn(),
  pathForBundle: jest.fn(),
  pathForGroup: jest.fn(),
  getFSInfo: jest.fn(),
  getAllExternalFilesDirs: jest.fn(),
  unlink: jest.fn(),
  exists: jest.fn(),
  stopDownload: jest.fn(),
  resumeDownload: jest.fn(),
  isResumable: jest.fn(),
  stopUpload: jest.fn(),
  completeHandlerIOS: jest.fn(),
  readDir: jest.fn(),
  readDirAssets: jest.fn(),
  existsAssets: jest.fn(),
  readdir: jest.fn(),
  setReadable: jest.fn(),
  stat: jest.fn(),
  readFile: jest.fn(),
  read: jest.fn(),
  readFileAssets: jest.fn(),
  hash: jest.fn(),
  copyFileAssets: jest.fn(),
  copyFileAssetsIOS: jest.fn(),
  copyAssetsVideoIOS: jest.fn(),
  writeFile: jest.fn(),
  appendFile: jest.fn(),
  write: jest.fn(),
  downloadFile: jest.fn(),
  uploadFiles: jest.fn(),
  touch: jest.fn(),
  MainBundlePath: 'some/path',
  CachesDirectoryPath: 'some/path',
  DocumentDirectoryPath: 'some/path',
  ExternalDirectoryPath: 'some/path',
  ExternalStorageDirectoryPath: 'some/path',
  TemporaryDirectoryPath: 'some/path',
  LibraryDirectoryPath: 'some/path',
  PicturesDirectoryPath: 'some/path',
}));

// Mock whisper.rn
jest.mock('whisper.rn/index.js', () => ({
  initWhisper: jest.fn(),
  initWhisperVad: jest.fn(),
  releaseAllWhisper: jest.fn(),
}));

// Mock react-native-permissions
jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock')
);







