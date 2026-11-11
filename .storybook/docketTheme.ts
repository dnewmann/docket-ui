import { create } from 'storybook/theming/create';
import logo from './assets/docket-logo.svg';

// Storybook's own chrome, branded with Docket primitives (neutral + violet).
export default create({
  base: 'dark',
  brandTitle: 'Docket UI',
  brandUrl: 'https://github.com/dnewmann/docket-ui',
  brandImage: logo,
  brandTarget: '_blank',

  colorPrimary: '#BCA9FF',
  colorSecondary: '#BCA9FF',

  appBg: '#0F0F11',
  appContentBg: '#18181B',
  appPreviewBg: '#0F0F11',
  appBorderColor: '#2A2A30',
  appBorderRadius: 16,

  fontBase: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  fontCode: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",

  textColor: '#F4F4F2',
  textMutedColor: '#9C9CA3',
  textInverseColor: '#18181B',

  barBg: '#18181B',
  barTextColor: '#9C9CA3',
  barSelectedColor: '#BCA9FF',
  barHoverColor: '#BCA9FF',

  inputBg: '#202024',
  inputBorder: '#77777F',
  inputTextColor: '#F4F4F2',
  inputBorderRadius: 10,
});
