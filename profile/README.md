# HeLa Ecosystem

Ten specialized MCP servers, two coordination backbones, and an optional single-endpoint runtime.

HeLa combines **Mitosis** for orchestration and reasoning with **Genome** for persistent project memory. Eight capability cells provide filesystem operations, command execution, PTY processes, research, browser automation, interface design, Android control, and Blender modeling.

The [distribution repository](https://github.com/Hela-Ecosystem/hela-mcp-ecosystem) provides pinned source snapshots, eight installation profiles, client configuration generators, and a static documentation website with English and Indonesian navigation. Tool availability depends on the selected profile and enabled features; use MCP `tools/list` or the [generated profile reference](https://hela.my.id/library/docs/generated-profile-counts.html) rather than a fixed ecosystem-wide total.

Cell tools are namespaced by default (`hela_membrane_read_file`), so a cell can never shadow a name the host already exposes; `HELA_NAMESPACE_TOOLS=0` restores bare names for clients that pin them.

## Creator

HeLa Ecosystem was created by **Azzar Budiyanto**. The cellular architecture, organelle model, runtime, installation profiles, and integration tooling are designed and maintained by Azzar as an independent open-source project.

## Current source snapshot

<!-- hela:profile:start -->
Snapshot **v1.11.27** · runtime **1.5.0** · cell releases **3.0.5 – 4.3.4**.

The ten cells are separate upstream projects under their own licences: **6** GPL-3.0-or-later (HeLa Mitosis, HeLa Genome, HeLa Membrane, HeLa Ribosome, HeLa Enzyme, HeLa Plastid) and **4** MIT (HeLa Nucleus, HeLa Cytosol, HeLa Phenotype, HeLa Receptor). The installer, runtime and documentation are MIT; this table of licences is generated from `config/inventory.json`, so it cannot drift from what the installer ships.
<!-- hela:profile:end -->

See the [release notes](https://hela.my.id/library/RELEASE_NOTES.html) for source pins and verification limits. The runtime starts no cells during discovery; the first tool call starts only its target cell.

## Repositories

| HeLa ID | Repository | Role |
|---|---|---|
| hela-mitosis | [chaining-mcp](https://github.com/Hela-Ecosystem/chaining-mcp) | Orchestration backbone (Needle 3 agent runtime) |
| hela-genome | [project-mcp](https://github.com/Hela-Ecosystem/project-mcp) | SQLite knowledge graph, task tracking, session context, and vault synchronization |
| hela-membrane | [filesystem-mcp](https://github.com/Hela-Ecosystem/filesystem-mcp) | Sandboxed filesystem |
| hela-nucleus | [terminal-mcp](https://github.com/Hela-Ecosystem/terminal-mcp) | Execution boundary (RTK-optimized) |
| hela-ribosome | [menager-mcp](https://github.com/Hela-Ecosystem/menager-mcp) | PTY process harness + opencode control |
| hela-enzyme | [researcher-mcp](https://github.com/Hela-Ecosystem/researcher-mcp) | Search & synthesis (zero-key fallback) |
| hela-cytosol | [browser-mcp](https://github.com/Hela-Ecosystem/browser-mcp) | Playwright browser automation |
| hela-phenotype | [designer-mcp](https://github.com/Hela-Ecosystem/designer-mcp) | Design systems, tokens, accessibility checks, and Stitch integration |
| hela-receptor | [scrcpy-mcp](https://github.com/Hela-Ecosystem/scrcpy-mcp) | Android device automation |
| hela-plastid | [ll3m-mcp](https://github.com/Hela-Ecosystem/ll3m-mcp) | Blender procedural 3D |
| Installer / docs | [hela-mcp-ecosystem](https://github.com/Hela-Ecosystem/hela-mcp-ecosystem) | Profiles, client matrix, docs site |
| Runtime daemon | [hela-runtime](https://github.com/Hela-Ecosystem/hela-runtime) | On-demand cells behind one MCP endpoint |

## Quick start

Use **Node.js 22 LTS** and **Git 2.30+**. Optional browser engines, model/provider credentials, Android devices, and Blender require separate setup.

```bash
git clone https://github.com/Hela-Ecosystem/hela-mcp-ecosystem.git
cd hela-mcp-ecosystem
./setup.sh --profile dev-workspace --client opencode
```

Single-endpoint alternative (one MCP connection for the selected profile):

```bash
./setup.sh --profile dev-workspace --client opencode --runtime
```

The default profile is `dev-workspace`, not `all`. Installation writes a private managed prefix and a client configuration fragment for review; it does not overwrite live client settings. Individual, runtime, Docker, Docker-runtime, and Nix modes are supported. Start with the [beginner's guide](https://hela.my.id/library/docs/beginner-guide.html) or [installation and doctor reference](https://hela.my.id/library/docs/installation.html).

## Links

- [Documentation website](https://hela.my.id/)
- [Searchable document library](https://hela.my.id/library.html) · [Navigasi Bahasa Indonesia](https://hela.my.id/id/library.html)
- [Profiles and configuration](https://hela.my.id/profiles.html) · [Troubleshooting](https://hela.my.id/troubleshooting.html)
- [Full documentation text](https://hela.my.id/llms-full.txt)
- Licence: the installer, runtime and documentation are MIT; each cell keeps its own, listed above

Named in respectful recognition of Henrietta Lacks (1920-1951) and the immortal scientific legacy of HeLa cells.
