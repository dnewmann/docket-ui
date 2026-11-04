// Checks WCAG contrast for every text/background pair the components use, in both themes.
// Fails the build if any pair is below its threshold (4.5:1 for text).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(readFileSync(join(root, 'tokens', f), 'utf8'));
const primitives = read('primitives.json');
const semantic = read('semantic.json');

const get = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);
const resolve = (theme, ref) => {
  const v = get(semantic[theme], ref);
  if (!v) throw new Error(`Missing semantic token ${ref} in ${theme}`);
  return get(primitives, v.slice(1, -1));
};

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [foreground, background, minimum]
const pairs = [
  ['color.text.primary', 'color.bg.canvas', 4.5],
  ['color.text.primary', 'color.bg.surface', 4.5],
  ['color.text.secondary', 'color.bg.surface', 4.5],
  ['color.text.link', 'color.bg.surface', 4.5],
  ['color.action.on-primary', 'color.action.primary', 4.5],
  ['color.action.on-primary', 'color.action.primary-hover', 4.5],
  ['color.action.on-primary', 'color.action.danger', 4.5],
  ['color.action.on-primary', 'color.action.danger-hover', 4.5],
  ['color.text.primary', 'color.action.secondary-hover', 4.5],
  ['color.focus.ring', 'color.bg.surface', 3],
  // WCAG 1.4.11: form control boundaries need 3:1 against their background
  ['color.border.input', 'color.bg.surface', 3],
  ['color.border.input', 'color.bg.canvas', 3],
  ['color.text.primary', 'color.bg.disabled', 4.5],
  // Listbox options and table rows in hover and selected states
  ['color.text.primary', 'color.bg.hover', 4.5],
  ['color.text.primary', 'color.bg.selected', 4.5],
  ['color.text.secondary', 'color.bg.subtle', 4.5],
  // Error and hint text sit directly on surfaces
  ['color.status.danger', 'color.bg.surface', 4.5],
  ['color.text.secondary', 'color.bg.canvas', 4.5],
  ['color.status.success', 'color.status.success-bg', 4.5],
  ['color.status.warning', 'color.status.warning-bg', 4.5],
  ['color.status.danger', 'color.status.danger-bg', 4.5],
  ['color.status.info', 'color.status.info-bg', 4.5],
];

let failed = 0;
for (const theme of ['light', 'dark']) {
  for (const [fg, bg, min] of pairs) {
    const r = ratio(resolve(theme, fg), resolve(theme, bg));
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`${ok ? 'pass' : 'FAIL'}  ${theme.padEnd(5)} ${r.toFixed(2).padStart(5)}:1 (min ${min})  ${fg} on ${bg}`);
  }
}
if (failed) {
  console.error(`\n${failed} contrast pair(s) below threshold`);
  process.exit(1);
}
