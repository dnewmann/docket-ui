import primitives from '../../tokens/primitives.json';
import semantic from '../../tokens/semantic.json';

type Scale = Record<string, string>;

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrast = (a: string, b: string) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const mono: React.CSSProperties = { fontFamily: 'var(--dk-font-family-mono)', fontSize: 12 };

/** Every primitive color ramp, rendered from tokens/primitives.json. */
export function PrimitiveRamps() {
  const color = primitives.color as Record<string, Scale>;
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {Object.entries(color).map(([name, scale]) => (
        <div key={name}>
          <div style={{ fontWeight: 600, marginBottom: 8, textTransform: 'capitalize' }}>{name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(scale).map(([step, hex]) => {
              const onWhite = contrast(hex, '#FFFFFF');
              return (
                <div key={step} style={{ width: 88 }}>
                  <div
                    style={{
                      height: 56,
                      borderRadius: 8,
                      background: hex,
                      border: '1px solid var(--dk-color-border-subtle)',
                    }}
                  />
                  <div style={{ ...mono, marginTop: 6 }}>
                    {name}.{step}
                  </div>
                  <div style={{ ...mono, color: 'var(--dk-color-text-secondary)' }}>{hex}</div>
                  <div style={{ ...mono, color: 'var(--dk-color-text-secondary)' }}>{onWhite.toFixed(1)}:1 on white</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

type Tree = { [k: string]: string | Tree };

function flatten(tree: Tree, path: string[] = []): [string, string][] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'string' ? [[[...path, k].join('.'), v] as [string, string]] : flatten(v, [...path, k]),
  );
}

function resolve(ref: string): string {
  const path = ref.slice(1, -1).split('.');
  return path.reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], primitives) as string;
}

/** Semantic color tokens, side by side in light and dark, with their primitive source. */
export function SemanticTable() {
  const light = flatten((semantic.light as unknown as Tree).color as Tree, ['color']);
  const dark = Object.fromEntries(flatten((semantic.dark as unknown as Tree).color as Tree, ['color']));
  const cell: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid var(--dk-color-border-subtle)' };
  const chip = (hex: string) => (
    <span
      style={{
        display: 'inline-block',
        width: 20,
        height: 20,
        borderRadius: 4,
        background: hex,
        border: '1px solid var(--dk-color-border-default)',
        verticalAlign: 'middle',
        marginRight: 8,
      }}
    />
  );
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
      <thead>
        <tr style={{ textAlign: 'left' }}>
          <th style={cell}>Token</th>
          <th style={cell}>Light</th>
          <th style={cell}>Dark</th>
        </tr>
      </thead>
      <tbody>
        {light.map(([name, ref]) => (
          <tr key={name}>
            <td style={{ ...cell, ...mono }}>--dk-{name.replaceAll('.', '-')}</td>
            <td style={{ ...cell, ...mono }}>
              {chip(resolve(ref))}
              {ref.slice(1, -1)}
            </td>
            <td style={{ ...cell, ...mono }}>
              {chip(resolve(dark[name]))}
              {dark[name].slice(1, -1)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
