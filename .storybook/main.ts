import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  // The library build emits .d.ts files; Storybook does not need them.
  viteFinal: (config) => ({
    ...config,
    plugins: (config.plugins ?? []).flat().filter((p) => {
      const name = p && typeof p === 'object' && 'name' in p ? String(p.name) : '';
      return !name.includes('dts');
    }),
  }),
};

export default config;
