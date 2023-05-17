export enum DirectoryItemType {
  FOLDER = 'FOLDER',
  FILE = 'FILE',
}

export type Folder = {
  type: DirectoryItemType.FOLDER;
} & PartialDirectoryEntity;

export type File = {
  type: DirectoryItemType.FILE;
  extension: string;
} & PartialDirectoryEntity;

type PartialDirectoryEntity = {
  name: string;
  path: string;
  size: number;
};

export type DirectoryEntity = File | Folder;

export interface DirectoryContent {
  children: DirectoryEntity[];
}

export type DirectoryContentDetails = {
  files: (PartialDirectoryEntity & { isVideo: boolean; isAudio: boolean })[];
  folders: PartialDirectoryEntity[];
};
