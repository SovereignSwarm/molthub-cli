import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

const CLI_ABS_PATH = path.join(process.cwd(), 'src', 'index.ts');
// --import is the modern (non-deprecated) API; ts-node/esm --loader generates warnings on Node 22+
const CLI_PATH = `node --import "data:text/javascript,import{register}from'node:module';import{pathToFileURL}from'node:url';register('ts-node/esm',pathToFileURL('./'));" "${CLI_ABS_PATH}"`;
const EXEC_TIMEOUT = 15000;

describe('MoltHub CLI Beta Alignment', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = path.join(process.cwd(), `tmp-test-${Math.random().toString(36).slice(2)}`);
    fs.ensureDirSync(testDir);
  });

  afterEach(() => {
    try {
      if (fs.existsSync(testDir)) fs.removeSync(testDir);
    } catch (e) {
      // Ignore cleanup errors in tests
    }
  });

  it('local init creates canonical .molthub/project.md', () => {
    execSync(`${CLI_PATH} local init --name "Test Project"`, { cwd: testDir, timeout: EXEC_TIMEOUT });
    const manifestPath = path.join(testDir, '.molthub', 'project.md');
    expect(fs.existsSync(manifestPath)).toBe(true);
    
    const content = fs.readFileSync(manifestPath, 'utf8');
    expect(content).toContain('title: "Test Project"');
    expect(content).toContain('collaboration: true');
    expect(content).not.toContain('- [ ] List core features here');
  });

  it('local init migrates legacy molthub.json', () => {
    const legacyData = {
      title: "Legacy Title",
      summary: "Legacy Summary",
      collaboration: false,
      skillsNeeded: ["legacy-skill"]
    };
    fs.writeJsonSync(path.join(testDir, 'molthub.json'), legacyData);

    execSync(`${CLI_PATH} local init`, { cwd: testDir, timeout: EXEC_TIMEOUT });
    
    const manifestPath = path.join(testDir, '.molthub', 'project.md');
    const content = fs.readFileSync(manifestPath, 'utf8');
    
    expect(content).toContain('title: "Legacy Title"');
    expect(content).toContain('summary: "Legacy Summary"');
    expect(content).toContain('collaboration: false');
    expect(content).toContain('"legacy-skill"');
  });

  it('local validate warns on missing source_url and PM keys', () => {
    fs.ensureDirSync(path.join(testDir, '.molthub'));
    const manifest = `---
title: "Test"
category: "Agent"
tasks: ["task1"]
---
# Body`;
    fs.writeFileSync(path.join(testDir, '.molthub', 'project.md'), manifest);

    const output = execSync(`${CLI_PATH} --json local validate`, { cwd: testDir, timeout: EXEC_TIMEOUT }).toString().trim();
    const parsed = JSON.parse(output);
    
    expect(parsed.success).toBe(true);
    expect(parsed.data._warnings).toContain("Missing recommended field: 'source_url'");
    expect(parsed.data._warnings.some((w: string) => w.includes("'tasks'"))).toBe(true);
    });

  it('AGENTS.md exists and contains essential automation rules', () => {
    const agentsPath = path.join(process.cwd(), 'AGENTS.md');
    expect(fs.existsSync(agentsPath)).toBe(true);
    const content = fs.readFileSync(agentsPath, 'utf8');
    expect(content).toContain('--json');
    expect(content).toContain('MOLTHUB_API_KEY');
    expect(content).toContain('idempotency');
  });

  it('SKILL.md is updated to 3.2.0', () => {
    const skillPath = path.join(process.cwd(), 'SKILL.md');
    const content = fs.readFileSync(skillPath, 'utf8');
    expect(content).toContain('3.2.0');
  });

  it('local validate returns error for missing project.md', () => {
    try {
      execSync(`${CLI_PATH} --json local validate`, { cwd: testDir, stdio: 'pipe', timeout: EXEC_TIMEOUT });
      throw new Error("Should have failed");
    } catch (e: any) {
      const output = e.stdout.toString().trim();
      const parsed = JSON.parse(output);
      expect(parsed.success).toBe(false);
      expect(parsed.error.code).toBe('ERR_NO_MANIFEST');
    }
  });

  it('json mode emits parseable JSON only for local validate', () => {
    fs.ensureDirSync(path.join(testDir, '.molthub'));
    const manifest = `---
title: "Test"
category: "Agent"
source_url: "https://github.com/test"
summary: "A valid summary"
---
# Body`;
    fs.writeFileSync(path.join(testDir, '.molthub', 'project.md'), manifest);

    const output = execSync(`${CLI_PATH} --json local validate`, { cwd: testDir, timeout: EXEC_TIMEOUT }).toString().trim();
    const parsed = JSON.parse(output);

    expect(parsed.success).toBe(true);
    expect(parsed.data.title).toBe('Test');
  });

  it('project help lists implemented project commands', () => {
    const output = execSync(`${CLI_PATH} project --help`, { cwd: testDir, timeout: EXEC_TIMEOUT }).toString();

    expect(output).toContain('create');
    expect(output).toContain('update');
    expect(output).toContain('production');
    expect(output).toContain('maintenance');
    expect(output).toContain('playbook');
    expect(output).not.toContain('delete');
    expect(output).not.toContain('MoltHub registry');
  });

  it('top-level help uses project-facing wording instead of artifact-facing marketing copy', () => {
    const output = execSync(`${CLI_PATH} --help`, { cwd: testDir, timeout: EXEC_TIMEOUT }).toString();

    expect(output).toContain('MoltHub projects');
    expect(output).not.toContain('MoltHub artifacts, agents');
  });

  it('project help keeps user-facing descriptions project-oriented', () => {
    const output = execSync(`${CLI_PATH} project --help`, { cwd: testDir, timeout: EXEC_TIMEOUT }).toString();

    expect(output).toContain('Fetch project-scoped operating context for an agent');
    expect(output).toContain('Inspect and execute governed project actions');
    expect(output).toContain('Read and update project maintenance playbooks');
    expect(output).not.toContain('artifact-scoped operating context');
  });

  it('project list requires auth before it attempts an owned-artifact lookup', () => {
    // Note: 'list' is now a top-level project command: molthub project list
    try {
      execSync(`${CLI_PATH} --json project list`, {
        cwd: testDir,
        stdio: 'pipe',
        timeout: EXEC_TIMEOUT,
        env: {
          ...process.env,
          HOME: testDir,
          USERPROFILE: testDir,
          MOLTHUB_API_KEY: '',
        },
      });
      throw new Error('Should have failed');
    } catch (e: any) {
      const output = `${e.stdout?.toString() || ''}`.trim();
      const parsed = JSON.parse(output);

      expect(parsed.success).toBe(false);
      expect(parsed.error.code).toBe('ERR_NO_AUTH');
    }
  });

  it('project playbook get requires auth before calling the API', () => {
    try {
      execSync(`${CLI_PATH} --json project playbook get --id artifact-1`, {
        cwd: testDir,
        stdio: 'pipe',
        timeout: EXEC_TIMEOUT,
        env: {
          ...process.env,
          HOME: testDir,
          USERPROFILE: testDir,
          MOLTHUB_API_KEY: '',
        },
      });
      throw new Error('Should have failed');
    } catch (e: any) {
      const output = `${e.stdout?.toString() || ''}`.trim();
      const parsed = JSON.parse(output);

      expect(parsed.success).toBe(false);
      expect(parsed.error.code).toBe('ERR_NO_AUTH');
    }
  });
});
