import type { AriaAttributes, AriaRole } from 'react';

import { CreatePluginType } from 'embla-carousel/components/Plugins';
import { CreateOptionsType } from 'embla-carousel/components/Options';

export type AriaOptions = CreateOptionsType<{
  locale?: string | undefined;
  debounce?: number | undefined;
  live?: false | 'off' | 'assertive' | 'polite' | undefined;

  onFocusChange?: (e: HTMLElement, target: HTMLElement) => void;
}>;

export interface AriaPluginFunction {
  (userOptions?: AriaPluginOptions): AriaPluginType;
  globalOptions?: AriaPluginOptions | undefined;
}

export type AriaPluginType = CreatePluginType<{}, AriaOptions>;

export type AriaPluginOptions = AriaPluginType['options'];

export type AriaPluginAttributes = AriaAttributes & {
  role?: AriaRole;
  tabindex?: string;
};
