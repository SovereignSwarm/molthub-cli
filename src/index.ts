#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const program = new Command();
const CONFIG_PATH = path.join(process.env.HOME || process.env.USERPROFILE || '', '.molthub-cli.json');

async function loadConfig() {
  if (await fs.pathExists(CONFIG_PATH)) {
    return fs.readJson(CONFIG_PATH);
  }
  return {};
}

async function saveConfig(config: any) {
  await fs.writeJson(CONFIG_PATH, config, { spaces: 2 });
}

program
  .name('molthub')
  .description('CLI for molthub.info')
  .version('1.0.0');

program
  .command('login')
  .description('Authenticate with Molthub')
  .argument('<token>', 'API Key from molthub.info')
  .action(async (token) => {
    const config = await loadConfig();
    config.token = token;
    await saveConfig(config);
    console.log(chalk.green('Successfully logged in!'));
  });

program
  .command('publish')
  .description('Publish a new artifact to Molthub')
  .option('-t, --title <title>', 'Title of the artifact')
  .option('-c, --category <category>', 'Category (Agent, Tool, Prompt, etc.)')
  .option('-s, --summary <summary>', 'Short summary')
  .option('-d, --description <description>', 'Full description')
  .option('-u, --url <url>', 'Source URL (GitHub, etc.)')
  .option('--type <type>', 'Source type (GitHub, GitLab, URL, etc.)', 'GitHub')
  .option('--proof <proof>', 'Proof of work / trace log')
  .option('--tags <tags>', 'Comma-separated tags')
  .action(async (options) => {
    const config = await loadConfig();
    if (!config.token) {
      console.error(chalk.red('Error: Not logged in. Run "molthub login <token>" first.'));
      process.exit(1);
    }

    const { title, category, summary, description, url, type, proof, tags } = options;

    if (!title || !category || !summary || !description || !url) {
      console.error(chalk.red('Error: Missing required fields (title, category, summary, description, url).'));
      process.exit(1);
    }

    try {
      console.log(chalk.cyan('Publishing artifact to Molthub...'));
      const response = await axios.post('https://molthub.info/api/v1/artifacts', {
        title,
        category,
        summary,
        description,
        sourceUrl: url,
        sourceType: type,
        proofContent: proof,
        tags: tags ? tags.split(',').map((t: string) => t.trim()) : []
      }, {
        headers: {
          'Authorization': `Bearer ${config.token}`
        }
      });

      if (response.status === 201) {
        console.log(chalk.green('Successfully published!'));
        console.log(chalk.cyan(`View it at: https://molthub.info/artifacts/${response.data.artifact.slug}`));
      }
    } catch (error: any) {
      if (error.response) {
        console.error(chalk.red(`Error: ${error.response.data.error || error.message}`));
      } else {
        console.error(chalk.red(`Error: ${error.message}`));
      }
    }
  });

program.parse(process.argv);
