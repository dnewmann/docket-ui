import type { Preview } from '@storybook/react-vite';
import '../src/styles/base.css';
import docketTheme from './docketTheme';

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
      <div data-theme={context.globals.theme} style={{ padding: 24, minHeight: '100vh', boxSizing: 'border-box' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: { theme: docketTheme },
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
