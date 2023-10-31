import {
  AriaOptions,
  AriaPluginType,
  AriaPluginOptions,
  AriaPluginFunction,
  AriaPluginAttributes,
} from './aria.types';

import {
  FocusManagerOptions,
  getFocusableTreeWalker,
} from '../utils/getFocusableTreeWalker';

import { debounce } from '../utils/debounce';
import { getIntl, IntlDictionary } from '../utils/getIntl';

import { EmblaCarouselType, EmblaEventType } from 'embla-carousel';
import { OptionsHandlerType } from 'embla-carousel/components/OptionsHandler';

declare module 'embla-carousel/components/Plugins' {
  interface EmblaPluginsType {
    aria?: AriaPluginType;
  }
}

const IN_VIEW_EVENTS: EmblaEventType[] = ['slidesInView'];

export const AriaPlugin: AriaPluginFunction = (
  userOptions: AriaPluginOptions = {}
): AriaPluginType => {
  let intl: IntlDictionary;
  let options: AriaPluginOptions;
  let emblaApi: EmblaCarouselType;

  function init(
    emblaApiInstance: EmblaCarouselType,
    optionsHandler: OptionsHandlerType
  ): void {
    emblaApi = emblaApiInstance;

    const { mergeOptions, optionsAtMedia } = optionsHandler;

    const defaultOptions: Required<AriaOptions> = {
      active: true,
      breakpoints: {},
      locale: 'en-US',
      live: false,
      debounce: 300,
      onFocusChange: () => {},
    };

    const base = mergeOptions(defaultOptions, AriaPlugin.globalOptions);
    options = optionsAtMedia(mergeOptions(base, userOptions));

    intl = getIntl(options.locale);

    const root = emblaApi.rootNode();

    const ariaLive = `${options.live}`;
    const ariaRoleDesc = intl.format('roledescription');
    const ariaOrientation =
      emblaApi.internalEngine().axis.scroll === 'x' ? 'horizontal' : 'vertical';
    const ariaMultiselectable =
      emblaApi.slidesInView().length > 1 ? 'true' : 'false';

    safelyMountNodeAttr(root, 'role', 'tablist');
    safelyMountNodeAttr(root, 'aria-live', ariaLive);
    safelyMountNodeAttr(root, 'aria-orientation', ariaOrientation);
    safelyMountNodeAttr(root, 'aria-roledescription', ariaRoleDesc);
    safelyMountNodeAttr(root, 'aria-multiselectable', ariaMultiselectable);

    for (const evt of IN_VIEW_EVENTS) {
      emblaApi.on(evt, debounce(toggleAriaSlideAttrs, options.debounce));
      emblaApi.on(evt, debounce(toggleFocusableSlideNodes, options.debounce));
    }

    toggleAriaSlideAttrs();
    toggleFocusableSlideNodes();
  }

  /**
   * Restores the mount value of an attribute on a node.
   *
   * @param node - The node which carries the attribute.
   * @param attr - The attribute to restore.
   */
  function safelyRestoreNodeAttr(node: Node, attr: keyof AriaPluginAttributes) {
    if (node instanceof HTMLElement) {
      const mountAttr = node.getAttribute(`data-backup-${attr}`);

      if (mountAttr !== null && mountAttr !== 'null') {
        node.setAttribute(attr, mountAttr);
      } else {
        node.removeAttribute(attr);
      }
    }
  }

  /**
   * Mounts an attribute on a node.
   *
   * @param node - The node which carries the attribute.
   * @param attr - The attribute to mount.
   */
  function safelyMountNodeAttr(
    node: Node,
    attr: keyof AriaPluginAttributes,
    value?: string
  ) {
    if (node instanceof HTMLElement) {
      const current = node.getAttribute(attr);
      const mountAttr = node.getAttribute(`data-backup-${attr}`);

      if (mountAttr === null) {
        node.setAttribute(`data-backup-${attr}`, current ?? 'null');
      }

      if (value !== undefined && value !== current) {
        node.setAttribute(attr, value);
      }
    }
  }

  /**
   * Unmounts an attribute on a node.
   *
   * @param node - The node which carries the attribute.
   * @param attr - The attribute to destroy.
   */
  function safelyUnmountNodeAttr(
    node: HTMLElement,
    attr: keyof AriaPluginAttributes
  ) {
    safelyRestoreNodeAttr(node, attr);
    node.removeAttribute(`data-backup-${attr}`);
  }

  /**
   * Destroys the focus ability of an element. Moves the focus if necessary.
   *
   * @param node - The element to destory focus for.
   */
  function safelyDestroyFocus(node: HTMLElement) {
    const currentFocus = document.activeElement === node;

    if (document.hasFocus() && currentFocus) {
      const tree = getFocusableTreeWalker(emblaApi.containerNode(), {
        tabbable: true,
      });

      const target = tree.nextNode() ?? emblaApi.rootNode();

      if (target instanceof HTMLElement) {
        target.focus();

        options.onFocusChange && options.onFocusChange(node, target);
      }
    }

    safelyMountNodeAttr(node, 'tabindex', '-1');
  }

  /**
   * Destroys all attributes set by the aria plugin.
   */
  function destroy(): void {
    for (const evt of IN_VIEW_EVENTS) {
      emblaApi.off(evt, debounce(toggleAriaSlideAttrs, options.debounce));
      emblaApi.off(evt, debounce(toggleFocusableSlideNodes, options.debounce));
    }

    const root = emblaApi.rootNode();
    const slides = emblaApi.slideNodes();

    safelyUnmountNodeAttr(root, 'role');
    safelyUnmountNodeAttr(root, 'aria-live');
    safelyUnmountNodeAttr(root, 'aria-orientation');
    safelyUnmountNodeAttr(root, 'aria-roledescription');
    safelyUnmountNodeAttr(root, 'aria-multiselectable');

    for (const slide of slides) {
      safelyUnmountNodeAttr(slide, 'role');
      safelyUnmountNodeAttr(slide, 'tabindex');

      safelyUnmountNodeAttr(slide, 'aria-label');
      safelyUnmountNodeAttr(slide, 'aria-roledescription');
      safelyUnmountNodeAttr(slide, 'aria-hidden');
      safelyUnmountNodeAttr(slide, 'aria-selected');

      executeForFocusDescendants(slide, (node) => {
        safelyUnmountNodeAttr(node, 'tabindex');
      });
    }
  }

  /**
   * Executes a callback function for every focusable descendant.
   *
   * @param node - The node to start tree-walking from.
   * @param callback - The callback function to invoke for every focusable node.
   */
  function executeForFocusDescendants(
    node: HTMLElement,
    callback: (...args: any[]) => void,
    options?: FocusManagerOptions
  ) {
    const tree = getFocusableTreeWalker(node, options);

    let focusable;
    while ((focusable = tree.nextNode())) {
      callback(focusable);
    }
  }

  /**
   * Retrieves the nodes of slides and groups them by visibility.
   */
  function getSlideElementsByVisibility() {
    const visible: HTMLElement[] = [];
    const invisible: HTMLElement[] = [];
    const slides = emblaApi.slideNodes();

    for (let index = 0; index <= slides.length; index++) {
      const slide = slides[index];

      if (slide !== undefined) {
        emblaApi.slidesInView().includes(index)
          ? visible.push(slide)
          : invisible.push(slide);
      }
    }

    return [visible, invisible] as const;
  }

  /**
   * Toggles aria attributes on all slides.
   */
  function toggleAriaSlideAttrs(): void {
    const slides = emblaApi.slideNodes();

    for (let index = 0; index <= slides.length; index++) {
      const node = slides[index];
      if (!node) continue;

      const localizedLabel = intl.format('slide.label', {
        i: index + 1,
        n: slides.length,
      });

      const visible = emblaApi.slidesInView().includes(index);
      const localizedRoleDesc = intl.format('slide.roledescription');

      safelyMountNodeAttr(node, 'role', 'tab');
      safelyMountNodeAttr(node, 'aria-label', localizedLabel);
      safelyMountNodeAttr(node, 'aria-roledescription', localizedRoleDesc);
      safelyMountNodeAttr(node, 'aria-hidden', visible ? 'false' : 'true');
      safelyMountNodeAttr(node, 'aria-selected', visible ? 'true' : 'false');
    }
  }

  /**
   * Toggles focus on all focusable slides & descendants.
   */
  function toggleFocusableSlideNodes(): void {
    const [visible, invisible] = getSlideElementsByVisibility();

    for (const slide of visible) {
      safelyMountNodeAttr(slide, 'tabindex');
      safelyRestoreNodeAttr(slide, 'tabindex');
      executeForFocusDescendants(slide, (child) => {
        safelyRestoreNodeAttr(child, 'tabindex');
      });
    }

    for (const slide of invisible) {
      safelyDestroyFocus(slide);

      executeForFocusDescendants(slide, (child) => {
        safelyDestroyFocus(child);
      });
    }
  }

  const self: AriaPluginType = {
    name: 'aria',
    options: userOptions,
    init,
    destroy,
  };

  return self;
};

AriaPlugin.globalOptions = undefined;

export default AriaPlugin;
