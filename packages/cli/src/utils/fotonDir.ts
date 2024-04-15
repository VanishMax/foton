import fs from 'node:fs';
import path from 'node:path';
import { Config } from '@tact-lang/compiler';

export const getFotonDir = () => {
  const fotonDir = path.join(process.cwd(), '.foton');

  if (!fs.existsSync(fotonDir)) {
    fs.mkdirSync(fotonDir);
  }

  return fotonDir;
};

export const copyContractToFoton = (filePath: string): string => {
  const fotonDir = getFotonDir();

  const name = path.basename(filePath, path.extname(filePath));
  const newDir = path.join(fotonDir, name);
  const newPath = path.join(newDir, path.basename(filePath));

  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir);
  }

  fs.copyFileSync(filePath, newPath);
  return name;
};

export const createTactConfig = (contracts: string[]): string => {
  const fotonDir = getFotonDir();

  const config: Config = {
    projects: contracts.map((contract) => ({
      name: contract,
      path: `./${contract}/${contract}.tact`,
      output: `./${contract}`,
    })),
  }

  const tactConfigPath = path.join(fotonDir, 'tact.config.json');
  fs.writeFileSync(
    tactConfigPath,
    JSON.stringify(config, null, 2),
    { encoding: 'utf-8' },
  );

  return tactConfigPath;
};
