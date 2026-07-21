import type { StatusBarStyle } from 'react-native';
import { useAppSelector } from '@/hooks';
import { selectTheme } from '@/store/settings/settingsSelectors';

type ThemeColors = {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  sectionTitle: string;
  divider: string;
  pressed: string;
  avatarBorder: string;
};

const themes: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#ffffff',
    surface: '#ffffff',
    textPrimary: '#1c1c1f',
    textSecondary: '#66676d',
    sectionTitle: '#7c7c85',
    divider: 'rgba(0, 0, 0, 0.15)',
    pressed: '#f1f1f3',
    avatarBorder: '#ffffff',
  },
  dark: {
    background: '#121214',
    surface: '#1c1c1f',
    textPrimary: '#f7f7f8',
    textSecondary: '#b5b2bc',
    sectionTitle: '#a19fa7',
    divider: 'rgba(255, 255, 255, 0.18)',
    pressed: '#2a2a2e',
    avatarBorder: '#1c1c1f',
  },
};

export const useTheme = () => {
  const selectedTheme = useAppSelector(selectTheme);
  const mode = selectedTheme === 'dark' ? 'dark' : 'light';
  const isDark = mode === 'dark';
  const statusBarStyle: StatusBarStyle = isDark ? 'light-content' : 'dark-content';

  return { mode, isDark, colors: themes[mode], statusBarStyle };
};
