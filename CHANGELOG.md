# Svelte for Pulsar changelog

## v1.4.0

- When the configured Node executable can't be started, the error notification now explains why (version managers like nvm are often invisible to Pulsar when launched from a desktop menu) and links directly to the package's settings to fix the `nodePath` option

## v1.3.0

- Rename package to `svelte-pulsar` (was `ide-svelte`), update config namespace accordingly (settings under `ide-svelte.*` must be reconfigured)
- Bump `svelte-language-server` to `0.18.4` for up to date Svelte support
- Fix `enableSvelteDiagnostics` toggle for `svelte.config.js` diagnostics not being applied due to a stale `this` reference

## v1.2.0

- Change embed grammar to TS in every case because it has less issues (fixes [#18](https://github.com/sveltejs/svelte-atom/issues/18))

## v1.1.0

- Add options to enable diagnostics by source (ts: true, svelte: true, js: false), fixes [#6](https://github.com/sveltejs/svelte-atom/issues/6)
- Changing Node executable doesn't require to restart Atom anymore
- Fixed detection of external Node failure and fallback on internal Electron's Node

## v1.0.0

- Upgrade language server ([#10](https://github.com/sveltejs/svelte-atom/pull/10))
- Replace legacy grammar with up to date one copied from the VSCode extension ([#15](https://github.com/sveltejs/svelte-atom/pull/15), fixes [#8](https://github.com/sveltejs/svelte-atom/issues/8))
