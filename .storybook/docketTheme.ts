import { create } from 'storybook/theming/create';
import logo from './assets/docket-logo.svg';

// Storybook's own chrome, branded with Docket primitives.
export default create({
  base: 'light',
  brandTitle: 'Docket UI',
  brandUrl: 'https://github.com/dnewmann/docket-ui',
  brandImage: logo,
  brandTarget: '_blank',

  colorPrimary: '#3442BE',
  colorSecondary: '#3442BE',

  appBg: '#F7F8FA',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#DDE1E8',
  appBorderRadius: 8,

  fontBase: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  fontCode: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",

  textColor: '#161A24',
  textMutedColor: '#4B5468',
  textInverseColor: '#FFFFFF',

  barBg: '#FFFFFF',
  barTextColor: '#4B5468',
  barSelectedColor: '#3442BE',
  barHoverColor: '#3442BE',

  inputBg: '#FFFFFF',
  inputBorder: '#667085',
  inputTextColor: '#161A24',
  inputBorderRadius: 8,
});
