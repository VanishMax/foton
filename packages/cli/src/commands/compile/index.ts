import { $ } from 'zx';
import { Command } from '@oclif/core';
import { findTactFiles } from '../../utils/findTactFiles.js';
import { copyContractToFoton, createTactConfig } from '../../utils/fotonDir.js';

export default class Compile extends Command {
  static description = 'Compile .tact files';

  async run(): Promise<void> {
    const files = await findTactFiles(process.cwd());

    const contracts = files.map((file) => {
      return copyContractToFoton(file);
    });

    createTactConfig(contracts);

    await $`tact --config .foton/tact.config.json`;
  }
}
