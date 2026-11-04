# Docket UI

The design system for **Docket**, a fictional legal-operations product. React and TypeScript components built on a three-layer token architecture, documented in Storybook, with accessibility checked automatically on every change.

**Live Storybook:** https://docket-ui.netlify.app

> I built this in public to show the architecture and workflow I use for production design systems. It is an original system: its own brand, tokens and code.

## Highlights

- **Three-layer tokens, one source of truth.** `tokens/*.json` holds primitives (raw values), semantic tokens (meaning, per theme) and component tokens. A build script turns them into CSS custom properties, validates every reference, and fails if light and dark themes drift apart.
- **Theming that actually cascades.** Component tokens are re-declared on every themed element, so a `data-theme="dark"` subtree recolors correctly instead of inheriting values frozen at `:root`.
- **Accessibility as a build gate.** A WCAG contrast check runs over every text/background pair in both themes and blocks the build below 4.5:1. Component tests run axe, and Storybook's a11y addon fails stories with violations.
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

## Getting started

```bash
npm install
npm run storybook   # http://localhost:6006
```

Using the library:

```tsx
import { Button } from '@dnewmann/docket-ui';
import '@dnewmann/docket-ui/styles.css';

<div data-theme="dark">
  <Button variant="primary">Save matter</Button>
</div>;
```

## Components

| Component | Status |
| --- | --- |
| Button | Done |
| TextField, Checkbox, Radio, Switch, Select | Next |
| Tabs, Modal, Toast, Tooltip | Planned |
| Table (responsive), Combobox (async), DatePicker | Planned |
| EmptyState, Skeleton | Planned |

## Roadmap

1. Core form controls and overlays
2. Example dashboard built only from Docket UI, at desktop, tablet and phone sizes
3. Figma library with Code Connect mappings
4. AI layer: a tool server that lets an AI agent build pages from these components, with an eval that checks the output uses real components and passes accessibility checks

## License

MIT © Daria Newmann
