import { $ } from 'zx';
import { Command } from '@oclif/core';
import { findTactFiles } from '../../utils/findTactFiles.js';
import { copyContractToPhoton, createTactConfig } from '../../utils/photonDir.js';

export default class Compile extends Command {
  static description = 'Compile .tact files';

  async run(): Promise<void> {
    const files = await findTactFiles(process.cwd());

    const contracts = files.map((file) => {
      return copyContractToPhoton(file);
    });

    createTactConfig(contracts);

    await $`tact --config .photon/tact.config.json`;
  }
}
