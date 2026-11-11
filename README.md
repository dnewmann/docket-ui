# Docket UI

The design system for **Docket**, a fictional legal-operations product. React and TypeScript components built on a three-layer token architecture, documented in Storybook, with accessibility checked automatically on every change.

**Live Storybook:** https://docket-ui.netlify.app

> I built this in public to show the architecture and workflow I use for production design systems. It is an original system: its own brand, tokens and code.

## Highlights

- **Three-layer tokens, one source of truth.** `tokens/*.json` holds primitives (raw values), semantic tokens (meaning, per theme) and component tokens. A build script turns them into CSS custom properties, validates every reference, and fails if light and dark themes drift apart.
- **Theming that actually cascades.** Component tokens are re-declared on every themed element, so a `data-theme="dark"` subtree recolors correctly instead of inheriting values frozen at `:root`.
- **Accessibility as a build gate.** A WCAG contrast check runs over every text/background pair in both themes and blocks the build below 4.5:1. Component tests run axe, and Storybook's a11y addon fails stories with violations.
- **Branded docs.** Custom Storybook theme, an introduction page, a colors page generated from the token JSON, a matter intake form, and a full **Matters dashboard** (app shell, async search, stats, filters, sortable responsive table, modal create flow) built only from library components.
- **Typed, tested components.** Strict TypeScript, Testing Library tests for behavior (keyboard, loading, disabled, refs), CSS Modules for scoped styles.

## Architecture

```
tokens/primitives.json   color.indigo.600 = #3442BE
        │
tokens/semantic.json     color.action.primary = {color.indigo.600}   (light)
        │                color.action.primary = {color.indigo.300}   (dark)
        │
tokens/components.json   button.primary.bg = {color.action.primary}
        │
scripts/build-tokens.mjs → src/tokens/tokens.css (CSS custom properties)
        │
src/components/*         use component and semantic tokens only, never raw values
```

## Quality gates (CI, on every push and PR)

| Step | Command |
| --- | --- |
| Token contrast (WCAG AA) | `npm run contrast` |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Unit and a11y tests | `npm run test` |
| Library build | `npm run build` |
| Storybook build | `npm run build-storybook` |

Run everything locally with `npm run ci`.

## Theming

Components read component tokens, which read semantic tokens. Override the semantic layer once and every component follows:

```css
:root {
  --dk-color-action-primary: #0f766e;
  --dk-color-action-primary-hover: #115e59;
}
```

Run the contrast check on any new colors.

## Releasing

1. Bump `version` in `package.json` and add a `CHANGELOG.md` entry.
2. Create a GitHub release tagged `v<version>`. The publish workflow runs CI and publishes to npm with provenance.

## Getting started

```bash
npm install
npm run storybook   # http://localhost:6006
```

Using the library:

```bash
npm install docket-ui
```

```tsx
import { Button } from 'docket-ui';
import 'docket-ui/styles.css';

<div data-theme="dark">
  <Button variant="primary">Save matter</Button>
</div>;
```

## Components

| Component | Status |
| --- | --- |
| Button | Done |
| TextField, Select, Checkbox, Switch | Done |
| Modal, Combobox (async), Table (sortable, responsive) | Done |
| Tabs, Tooltip, NumberField, Stat, Badge, Skeleton | Done (0.2.0) |
| Card, Alert, SegmentedControl, RadioGroup, Textarea, Spinner, EmptyState, Pagination, Menu, Progress, Accordion | Done (0.2.0) |
| Radio, Textarea, Toast, Tooltip | Next |
| DatePicker | Planned |
| EmptyState, Skeleton | Planned |

## Roadmap

1. Toast, Tooltip, DatePicker
2. Figma library with Code Connect mappings
3. AI layer: a tool server that lets an AI agent build pages from these components, with an eval that checks the output uses real components and passes accessibility checks

## License

MIT © Daria Newmann
