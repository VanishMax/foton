import fs from 'node:fs';
import path from 'node:path';
import { Config } from '@tact-lang/compiler';

export const getPhotonDir = () => {
  const photonDir = path.join(process.cwd(), '.photon');

  if (!fs.existsSync(photonDir)) {
    fs.mkdirSync(photonDir);
  }

  return photonDir;
};

export const copyContractToPhoton = (filePath: string): string => {
  const photonDir = getPhotonDir();

  const name = path.basename(filePath, path.extname(filePath));
  const newDir = path.join(photonDir, name);
  const newPath = path.join(newDir, path.basename(filePath));

  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir);
  }

  fs.copyFileSync(filePath, newPath);
  return name;
};

export const createTactConfig = (contracts: string[]): string => {
  const photonDir = getPhotonDir();

  const config: Config = {
    projects: contracts.map((contract) => ({
      name: contract,
      path: `./${contract}/${contract}.tact`,
      output: `./${contract}`,
    })),
  }

  const tactConfigPath = path.join(photonDir, 'tact.config.json');
  fs.writeFileSync(
    tactConfigPath,
    JSON.stringify(config, null, 2),
    { encoding: 'utf-8' },
  );

  return tactConfigPath;
};
