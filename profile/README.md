# HeLa Ecosystem

HeLa Cellular MCP Workbench — a modular, 10-organelle MCP distribution suite for AI agents, plus a runtime daemon.

HeLa is a reproducible suite of 10 specialized Model Context Protocol (MCP) servers (292 tools) plus an installer, client-matrix generator, bilingual documentation site, and a runtime daemon. It couples two backbones — HeLa Mitosis (orchestration & reasoning) and HeLa Genome (persistent project memory) — with 8 capability cells spanning filesystem, terminal, PTY processes, research, browser automation, design, Android control, and 3D modeling.

## Repositories

| HeLa ID | Repository | Role |
|---|---|---|
| hela-mitosis | [chaining-mcp](https://github.com/Hela-Ecosystem/chaining-mcp) | Orchestration backbone (Needle 3 agent runtime) |
| hela-genome | [project-mcp](https://github.com/Hela-Ecosystem/project-mcp) | Memory graph (SQLite knowledge graph) |
| hela-membrane | [filesystem-mcp](https://github.com/Hela-Ecosystem/filesystem-mcp) | Sandboxed filesystem |
| hela-nucleus | [terminal-mcp](https://github.com/Hela-Ecosystem/terminal-mcp) | Execution boundary (RTK-optimized) |
| hela-ribosome | [menager-mcp](https://github.com/Hela-Ecosystem/menager-mcp) | PTY process harness + opencode control |
| hela-enzyme | [researcher-mcp](https://github.com/Hela-Ecosystem/researcher-mcp) | Search & synthesis (zero-key fallback) |
| hela-cytosol | [browser-mcp](https://github.com/Hela-Ecosystem/browser-mcp) | Playwright browser automation |
| hela-phenotype | [designer-mcp](https://github.com/Hela-Ecosystem/designer-mcp) | Design tokens & Tailwind |
| hela-receptor | [scrcpy-mcp](https://github.com/Hela-Ecosystem/scrcpy-mcp) | Android device automation |
| hela-plastid | [ll3m-mcp](https://github.com/Hela-Ecosystem/ll3m-mcp) | Blender procedural 3D |
| Installer / docs | [hela-mcp-ecosystem](https://github.com/Hela-Ecosystem/hela-mcp-ecosystem) | Profiles, client matrix, docs site |
| Runtime daemon | [hela-runtime](https://github.com/Hela-Ecosystem/hela-runtime) | Single-endpoint runtime (v1.0.0) |

## Quick start

```bash
git clone https://github.com/Hela-Ecosystem/hela-mcp-ecosystem.git
cd hela-mcp-ecosystem
./setup.sh --profile dev-workspace --client opencode
```

Single-endpoint alternative (one MCP connection for all cells):

```bash
./setup.sh --profile dev-workspace --client opencode --runtime
```

## Links

- Documentation: https://hela.my.id
- License: MIT (per subproject)

Named in respectful recognition of Henrietta Lacks (1920-1951) and the immortal scientific legacy of HeLa cells.