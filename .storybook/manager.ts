import { addons } from 'storybook/manager-api';
import docketTheme from './docketTheme';

addons.setConfig({
  theme: docketTheme,
  sidebar: { showRoots: true },
});
