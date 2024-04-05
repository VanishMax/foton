import fs from 'node:fs';
import path from 'node:path';

const IGNORED_DIRECTORIES = ['node_modules', 'dist', '.idea', '.vscode', '.photon'];

/** Asynchronously checks whether the provided path is a directory. */
const isDirectory = async (path: string): Promise<boolean> => {
  return fs.promises.stat(path).then(stats => stats.isDirectory());
};

interface FileSystemEntity {
  name: string;
  fullPath: string;
  isDirectory: boolean;
}

/** Asynchronously lists all entities (files and directories) in a given directory. */
const listDirectoryContents = async (dirPath: string): Promise<FileSystemEntity[]> => {
  const names = await fs.promises.readdir(dirPath);

  return Promise.all(names.map(name => {
    const fullPath = path.join(dirPath, name);
    return isDirectory(fullPath).then(isDirectory => ({
      name,
      fullPath,
      isDirectory
    }));
  }));
};

/**
 * Recursively finds all `.tact` files in the given directory and its subdirectories, excluding `node_modules`.
 */
export const findTactFiles = async (dirPath: string): Promise<string[]> => {
  const contents = await listDirectoryContents(dirPath);

  return contents.reduce(async (accumP, entry) => {
    const accum = await accumP;

    if (entry.isDirectory) {
      if (IGNORED_DIRECTORIES.includes(entry.name)) return accum;
      return [...accum,  ...(await findTactFiles(entry.fullPath))];
    }

    if (entry.name.endsWith('.tact')) {
      return [...accum, entry.fullPath];
    }

    return accum;
  }, Promise.resolve([] as string[]));
};
