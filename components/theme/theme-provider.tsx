"use client"; //common-layout for every page

import {
  ThemeProvider as NextThemeProvider,
  ThemeProviderProps,
} from "next-themes";
import Header from "../layout/header";
import { cn } from "@/lib/utils";

interface ExtendedThemeProviderProps extends ThemeProviderProps {
  containerClassName?: string;
}

export function ThemeProvider({
  children,
  containerClassName,
  ...props //baki theme props pass honge NextThemeProvider ko
}: ExtendedThemeProviderProps) {
  return (
    <NextThemeProvider {...props}>
      <Header />
      <main className={cn("container mx-auto px-4")}>{children}</main>
    </NextThemeProvider>
  );
}
