'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * ThemeProvider component that wraps the NextThemesProvider.
 * It provides theme support for the application, allowing for theme switching.
 * @param {ThemeProviderProps} props - The properties passed to the ThemeProvider component.
 * @returns {JSX.Element} The ThemeProvider component wrapping the children with theme context.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
