import * as FileSystem from 'expo-file-system/legacy';
import type { FileInfo as ExpoFileInfo } from 'expo-file-system/legacy';

export type FileInfo = {
  uri: string;
  size: number;
  md5?: string;
};

export const getFileInfoWithHash = async (uri: string): Promise<FileInfo> => {
  const info = (await FileSystem.getInfoAsync(uri, { md5: true })) as ExpoFileInfo & { md5?: string };
  const size = info.exists ? info.size : 0;
  return { uri, size, md5: info.md5 };
};

export const writeTempDemoFile = async (contents: string) => {
  const uri = FileSystem.cacheDirectory + `demo-${Date.now()}.txt`;
  await FileSystem.writeAsStringAsync(uri, contents);
  return uri;
};
