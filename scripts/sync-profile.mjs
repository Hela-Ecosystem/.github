#!/usr/bin/env node
/**
 * Keep the organization profile honest.
 *
 * The profile is the first thing a visitor reads, and it had drifted two
 * releases behind: it advertised snapshot 1.5.3, cell packages 3.0.0 and
 * runtime 1.2.0 while the ecosystem was on 1.9.27 / 1.3.7, and it said
 * "License: MIT (per subproject)" when six of the ten cells are
 * GPL-3.0-or-later. That is the same class of bug the ecosystem's
 * check-prose-facts.mjs exists to stop, so this script applies the same rule
 * here: the volatile facts are written from config/inventory.json, and
 * everything else is asserted against it.
 *
 * Usage:
 *   node scripts/sync-profile.mjs                 # rewrite the generated block
 *   node scripts/sync-profile.mjs --check         # fail if anything drifted
 *   node scripts/sync-profile.mjs --ecosystem ..  # use a local checkout instead of raw
 *   node scripts/sync-profile.mjs --ref master    # branch to read when fetching
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PROFILE = path.join(ROOT, 'profile', 'README.md');
const START = '<!-- hela:profile:start -->';
const END = '<!-- hela:profile:end -->';
const REPO = 'Hela-Ecosystem/hela-mcp-ecosystem';
const EXTRA_REPOS = new Set(['hela-runtime', 'hela-mcp-ecosystem', '.github']);
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
/** Cells that coordinate rather than add a capability. */
const BACKBONES = ['hela-mitosis', 'hela-genome'];

const argv = process.argv.slice(2);
const check = argv.includes('--check');
const localIndex = argv.indexOf('--ecosystem');
const localRoot = localIndex === -1 ? null : path.resolve(argv[localIndex + 1]);
const refIndex = argv.indexOf('--ref');
const ref = refIndex === -1 ? 'master' : argv[refIndex + 1];

const word = (count) => NUMBER_WORDS[count] ?? String(count);

async function loadJson(file) {
  if (localRoot) return JSON.parse(fs.readFileSync(path.join(localRoot, file), 'utf8'));
  const url = `https://raw.githubusercontent.com/${REPO}/${ref}/${file}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'hela-profile-sync' } });
  if (!response.ok) throw new Error(`cannot read ${url}: ${response.status} ${response.statusText}`);
  return response.json();
}

const inventory = (await loadJson('config/inventory.json')).inventory;
const ecosystemVersion = (await loadJson('package.json')).version;
const profiles = (await loadJson('config/profiles.json')).profiles;
const environment = (await loadJson('config/snapshots/latest-stable.json')).environment;

const cellIds = Object.keys(inventory).filter((id) => id !== 'hela-runtime');
const runtime = inventory['hela-runtime'];
const capabilityIds = cellIds.filter((id) => !BACKBONES.includes(id));

const byLicence = new Map();
for (const id of cellIds) {
  const licence = inventory[id].license;
  if (!byLicence.has(licence)) byLicence.set(licence, []);
  byLicence.get(licence).push(inventory[id].alias);
}
const licenceSentence = [...byLicence.entries()]
  .sort((a, b) => b[1].length - a[1].length)
  .map(([licence, aliases]) => `**${aliases.length}** ${licence} (${aliases.join(', ')})`)
  .join(' and ');

const versions = cellIds.map((id) => inventory[id].version).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const block = [
  START,
  `Snapshot **v${ecosystemVersion}** · runtime **${runtime.version}** · cell releases **${versions[0]} – ${versions[versions.length - 1]}**.`,
  '',
  `The ${word(cellIds.length)} cells are separate upstream projects under their own licences: ${licenceSentence}. The installer, runtime and documentation are MIT; this table of licences is generated from \`config/inventory.json\`, so it cannot drift from what the installer ships.`,
  END,
].join('\n');

const readme = fs.readFileSync(PROFILE, 'utf8');
if (!readme.includes(START) || !readme.includes(END)) {
  console.error(`profile/README.md must contain ${START} and ${END}`);
  process.exit(1);
}

const problems = [];
const currentBlock = readme.slice(readme.indexOf(START), readme.indexOf(END) + END.length);
if (currentBlock !== block) {
  if (check) problems.push('generated block is stale — run node scripts/sync-profile.mjs');
  else fs.writeFileSync(PROFILE, readme.replace(currentBlock, block));
}

/** Everything outside the generated block is hand-written, so assert it. */
const prose = readme.replace(/<!-- hela:profile:start -->[\s\S]*?<!-- hela:profile:end -->/g, (match) => match.replace(/[^\n]/g, ' '));

for (const match of prose.matchAll(/([a-z]+)\s+(?:specialized\s+)?MCP servers/gi)) {
  const claimed = NUMBER_WORDS.indexOf(match[1].toLowerCase());
  if (claimed !== -1 && claimed !== cellIds.length) {
    problems.push(`profile claims ${match[1]} MCP servers but the inventory defines ${cellIds.length}`);
  }
}
for (const match of prose.matchAll(/([a-z]+)\s+capability cells/gi)) {
  const claimed = NUMBER_WORDS.indexOf(match[1].toLowerCase());
  if (claimed !== -1 && claimed !== capabilityIds.length) {
    problems.push(`profile claims ${match[1]} capability cells but the inventory defines ${capabilityIds.length}`);
  }
}
for (const match of prose.matchAll(/github\.com\/Hela-Ecosystem\/([A-Za-z0-9._-]+)/g)) {
  const repo = match[1].replace(/\.git$/, '');
  const known = EXTRA_REPOS.has(repo) || Object.values(inventory).some((item) => item.source === repo);
  if (!known) problems.push(`links to ${repo}, which is not a source in config/inventory.json`);
}
const liveVersions = new Set([ecosystemVersion, runtime.version, ...cellIds.map((id) => inventory[id].version)]);
for (const match of prose.matchAll(/\b(\d+\.\d+\.\d+)\b/g)) {
  if (liveVersions.has(match[1])) problems.push(`states live version ${match[1]} in hand-written prose; the generated block is the only place for it`);
}
for (const match of prose.matchAll(/([a-z]+)\s+installation profiles/gi)) {
  const claimed = NUMBER_WORDS.indexOf(match[1].toLowerCase());
  if (claimed !== -1 && claimed !== profiles.length) {
    problems.push(`profile claims ${match[1]} installation profiles but config/profiles.json defines ${profiles.length}`);
  }
}
const nodeFloor = /(\d+)\./.exec(String(environment?.node_minimum ?? '').replace(/[^0-9.]/g, ''));
if (nodeFloor) {
  for (const match of prose.matchAll(/Node(?:\.js)?\s+(?:v)?(\d+)/g)) {
    if (Number(match[1]) < Number(nodeFloor[1])) problems.push(`states Node ${match[1]}, below the published minimum ${nodeFloor[1]}`);
  }
}
prose.split('\n').forEach((line, index) => {
  const git = /Git\s+(\d+)\.(\d+)/.exec(line);
  const minimum = /Git\s*[><=]*\s*v?(\d+)\.(\d+)/.exec(String(environment?.git_minimum ?? ''));
  if (git && minimum && (Number(git[1]) < Number(minimum[1]) || (Number(git[1]) === Number(minimum[1]) && Number(git[2]) < Number(minimum[2])))) {
    problems.push(`profile/README.md:${index + 1} states Git ${git[1]}.${git[2]}, below the published minimum ${minimum[1]}.${minimum[2]}`);
  }
});
for (const match of prose.matchAll(/License:\s*([A-Za-z0-9.\-]+)/gi)) {
  if (!/^(MIT|GPL-3\.0-or-later)$/.test(match[1])) problems.push(`states license ${match[1]}, which the inventory does not use`);
}

if (problems.length) {
  console.error('profile check failed:');
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log(check ? 'profile facts match the inventory' : 'profile block written');
console.log(`  snapshot ${ecosystemVersion} · runtime ${runtime.version} · ${cellIds.length} cells (${capabilityIds.length} capability) · ${byLicence.size} licences`);
