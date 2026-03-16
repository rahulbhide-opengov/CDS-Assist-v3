#!/usr/bin/env node
/**
 * CDS-Assist CLI
 *
 * Lightweight command router for Figma library management and design operations.
 * Usage: node --loader ts-node/esm shared/engine/cli.ts <command> [flags]
 *
 * Commands:
 *   figma:setup          Check Figma connection + init config
 *   figma:libs:list      List configured library sources
 *   figma:libs:add       Add a library source (--url, --name, --role)
 *   figma:libs:update    Update a library source (--id, [patch flags])
 *   figma:libs:remove    Remove a library source (--id)
 *   figma:sync           Sync the Design System manifest from all sources
 */

import {
  listFigmaSources,
  listDefaultSources,
  listUserSources,
  addFigmaSource,
  updateFigmaSource,
  removeFigmaSource,
  enableFigmaSource,
  initSourcesConfig,
  ensureDirectories,
} from './figma-library-registry.js';

function parseFlags(args: string[]): Record<string, string> {
  const flags: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : 'true';
      flags[key] = val;
      if (val !== 'true') i++;
    }
  }
  return flags;
}

function printTable(rows: Record<string, unknown>[]): void {
  if (rows.length === 0) {
    console.log('  (no entries)');
    return;
  }
  console.table(rows);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const flags = parseFlags(rest);

  switch (command) {
    case 'figma:setup': {
      ensureDirectories();
      initSourcesConfig();
      console.log('✅ Config and cache directories created.');
      console.log('   Config: config/figma.sources.json');
      console.log('   Cache:  cache/figma/');
      console.log('   Local:  .figma-cache/');
      console.log('\nTo check Figma connection, the agent calls ensureFigmaConnected() at runtime.');
      break;
    }

    case 'figma:libs:list': {
      const defaults = new Set(listDefaultSources().map(s => s.id));
      const sources = listFigmaSources();
      if (sources.length === 0) {
        console.log('No library sources configured.');
        console.log('Add one: node cli.ts figma:libs:add --url "<figma url>" --name "Name" --role core');
      } else {
        printTable(sources.map(s => ({
          id: s.id,
          name: s.name,
          role: s.role,
          priority: s.priority,
          enabled: s.enabled ? '✓' : '✗',
          source: defaults.has(s.id) ? 'org default' : 'user added',
          fileKey: s.fileKey,
        })));
      }
      break;
    }

    case 'figma:libs:add': {
      if (!flags.url || !flags.name) {
        console.error('Usage: figma:libs:add --url "<figma url>" --name "Name" [--role core|patterns|icons|other] [--priority 100]');
        process.exit(1);
      }
      const source = addFigmaSource({
        name: flags.name,
        fileUrl: flags.url,
        fileKey: flags.key,
        role: (flags.role as 'core' | 'patterns' | 'icons' | 'other') || undefined,
        priority: flags.priority ? parseInt(flags.priority, 10) : undefined,
        include: flags.include
          ? (flags.include.split(',') as Array<'tokens' | 'components' | 'styles'>)
          : undefined,
      });
      console.log(`✅ Added source "${source.name}" (${source.id})`);
      console.log(`   File key: ${source.fileKey}`);
      console.log(`   Role: ${source.role}, Priority: ${source.priority}`);
      break;
    }

    case 'figma:libs:update': {
      if (!flags.id) {
        console.error('Usage: figma:libs:update --id <source-id> [--name, --url, --role, --priority, --enabled]');
        process.exit(1);
      }
      const patch: Record<string, unknown> = {};
      if (flags.name) patch.name = flags.name;
      if (flags.url) patch.fileUrl = flags.url;
      if (flags.role) patch.role = flags.role;
      if (flags.priority) patch.priority = parseInt(flags.priority, 10);
      if (flags.enabled !== undefined) patch.enabled = flags.enabled === 'true';
      const updated = updateFigmaSource(flags.id, patch);
      console.log(`✅ Updated source "${updated.name}" (${updated.id})`);
      break;
    }

    case 'figma:libs:remove': {
      if (!flags.id) {
        console.error('Usage: figma:libs:remove --id <source-id>');
        process.exit(1);
      }
      removeFigmaSource(flags.id);
      console.log(`✅ Removed source "${flags.id}"`);
      break;
    }

    case 'figma:libs:enable': {
      if (!flags.id) {
        console.error('Usage: figma:libs:enable --id <source-id> [--enabled true|false]');
        process.exit(1);
      }
      const enabled = flags.enabled !== 'false';
      enableFigmaSource(flags.id, enabled);
      console.log(`✅ Source "${flags.id}" is now ${enabled ? 'enabled' : 'disabled'}`);
      break;
    }

    case 'figma:sync': {
      console.log('Syncing Design System manifest...');
      const { syncDesignSystemManifest } = await import('./figma-ds-manifest.js');
      const summary = await syncDesignSystemManifest({ force: flags.force === 'true' });
      console.log(`✅ Manifest synced: ${summary.componentCount} components, ${summary.tokenCount} tokens, ${summary.styleCount} styles`);
      if (summary.conflicts.length > 0) {
        console.log(`⚠️  ${summary.conflicts.length} token conflicts (highest-priority source wins)`);
      }
      break;
    }

    default: {
      console.log(`CDS-Assist CLI

Commands:
  figma:setup              Initialize config + cache directories
  figma:libs:list          List all configured Figma library sources
  figma:libs:add           Add a library source
  figma:libs:update        Update a library source
  figma:libs:remove        Remove a library source
  figma:libs:enable        Enable/disable a library source
  figma:sync               Sync the DS manifest from all enabled sources

Examples:
  node cli.ts figma:setup
  node cli.ts figma:libs:add --url "https://figma.com/design/XXXX/CDS-Core" --name "CDS Core" --role core
  node cli.ts figma:libs:list
  node cli.ts figma:sync`);
      break;
    }
  }
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
