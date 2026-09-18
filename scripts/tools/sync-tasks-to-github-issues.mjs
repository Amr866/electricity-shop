#!/usr/bin/env node
/**
 * Synchronize tasks from tasks.md into GitHub Issues for Amr866/electricity-shop
 * Implements speckit-taskstoissues specification.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const TASKS_PATH = path.resolve(process.cwd(), 'specs/001-store-workshop-platform/tasks.md');
const REPO = 'Amr866/electricity-shop';

function extractTasks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const tasks = [];
  let currentPhase = 'Core';

  for (let rawLine of lines) {
    const line = rawLine.trim();
    const phaseMatch = line.match(/^## Phase (\d+): (.*?)(?:\s*\(.*?\))?$/);
    if (phaseMatch) {
      currentPhase = `Phase ${phaseMatch[1]}: ${phaseMatch[2].trim()}`;
      continue;
    }

    const taskMatch = line.match(/^- \[(x|X| )\]\s+(T\d{3,})\s*(.*)$/);
    if (taskMatch) {
      const isCompleted = taskMatch[1].toLowerCase() === 'x';
      const taskId = taskMatch[2];
      let rawDesc = taskMatch[3].trim();

      // Strip [P] and [US#] markers per speckit-taskstoissues spec
      const cleanDesc = rawDesc
        .replace(/^(\[(?:P|US\d+)\]\s*)+/g, '')
        .trim();

      tasks.push({
        id: taskId,
        title: `${taskId}: ${cleanDesc}`,
        description: cleanDesc,
        phase: currentPhase,
        isCompleted,
      });
    }
  }

  return tasks;
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  if (!fs.existsSync(TASKS_PATH)) {
    console.error(`Tasks file not found at: ${TASKS_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(TASKS_PATH, 'utf8');
  const tasks = extractTasks(content);

  console.log(`[TaskstoIssues] Extracted ${tasks.length} tasks from ${TASKS_PATH}`);
  console.log(`[TaskstoIssues] Target Repository: ${REPO}`);

  if (isDryRun) {
    console.log('\n--- DRY RUN: PREVIEWING ISSUES TO CREATE ---');
    for (const t of tasks) {
      console.log(`[${t.isCompleted ? 'RESOLVED' : 'OPEN'}] ${t.title} (${t.phase})`);
    }
    console.log(`\nTotal: ${tasks.length} issues ready for creation.`);
    return;
  }

  // Check gh CLI authentication
  let existingIssueTitles = [];
  try {
    const existingJson = execSync(`gh issue list --repo ${REPO} --limit 500 --json number,title --state all`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    existingIssueTitles = JSON.parse(existingJson).map((i) => i.title);
    console.log(`[TaskstoIssues] Found ${existingIssueTitles.length} existing issues on ${REPO}`);
  } catch (err) {
    console.warn('[TaskstoIssues] GitHub CLI is not currently authenticated or remote repository is private.');
    console.warn('To authenticate, run: gh auth login');
    console.warn('Or run with --dry-run to inspect the complete issue payload.\n');
    process.exit(1);
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const t of tasks) {
    const alreadyExists = existingIssueTitles.some((title) => {
      const match = title.match(/\bT\d{3,}\b/);
      return match && match[0] === t.id;
    });

    if (alreadyExists) {
      console.log(`[SKIP] ${t.id} already has an issue, skipping.`);
      skippedCount++;
      continue;
    }

    const body = `### Task Information\n- **Task ID**: ${t.id}\n- **Milestone/Phase**: ${t.phase}\n- **Initial Status**: ${t.isCompleted ? 'Completed in main' : 'Pending'}\n\n### Description\n${t.description}\n\n---\n*Auto-generated from \`tasks.md\` via speckit-taskstoissues*`;

    try {
      execSync(`gh issue create --repo ${REPO} --title "${t.title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}"`, {
        encoding: 'utf8',
      });
      console.log(`[CREATED] ${t.title}`);
      createdCount++;
    } catch (err) {
      console.error(`[ERROR] Failed to create issue for ${t.id}:`, err.message);
    }
  }

  console.log(`\n[Summary] Created: ${createdCount}, Skipped: ${skippedCount}, Total: ${tasks.length}`);
}

main();
