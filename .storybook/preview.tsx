import type React from 'react';
import type { Preview } from '@storybook/react-vite';
import '../src/styles/base.css';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { docketDark, docketLight } from './docketTheme';

// Docs pages follow the toolbar's Theme switch, like the stories do.
function ThemedDocsContainer(props: DocsContainerProps & { children?: React.ReactNode }) {
  const globals = (props.context as unknown as { store: { userGlobals: { globals: Record<string, unknown> } } }).store.userGlobals.globals;
  const theme = globals.theme === 'light' ? 'light' : 'dark';
  return (
    <div data-theme={theme} style={{ background: 'var(--dk-color-bg-canvas)', minHeight: '100vh' }}>
      <DocsContainer {...props} theme={theme === 'light' ? docketLight : docketDark} />
    </div>
  );
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [
    (Story, context) => (
      <div
        data-theme={context.globals.theme}
        style={{
          padding: 24,
          minHeight: context.viewMode === 'docs' ? undefined : '100vh',
          boxSizing: 'border-box',
          background: 'var(--dk-color-bg-canvas)',
          color: 'var(--dk-color-text-primary)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: { container: ThemedDocsContainer },
    options: { storySort: { order: ['Introduction', 'Foundations', 'Components', 'Patterns'] } },
    controls: { matchers: { color: /(background|color)$/i } },
    a11y: { test: 'error' },
    viewport: {
      options: {
        phone: { name: 'Phone (375)', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet (1024)', styles: { width: '1024px', height: '768px' } },
        desktop: { name: 'Desktop (1440)', styles: { width: '1440px', height: '900px' } },
      },
    },
  },
};

export default preview;
