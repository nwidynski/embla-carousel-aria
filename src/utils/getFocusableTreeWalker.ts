/**
 * Adapted from https://github.com/adobe/react-spectrum.
 * Licensed under the Apache License.
 */
function isStyleVisible(element: Element) {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
    return false;
  }

  let { display, visibility } = element.style;

  let isVisible =
    display !== 'none' && visibility !== 'hidden' && visibility !== 'collapse';

  if (isVisible) {
    const { getComputedStyle } = element.ownerDocument
      .defaultView as unknown as Window;
    let { display: computedDisplay, visibility: computedVisibility } =
      getComputedStyle(element);

    isVisible =
      computedDisplay !== 'none' &&
      computedVisibility !== 'hidden' &&
      computedVisibility !== 'collapse';
  }

  return isVisible;
}

/**
 * Adapted from https://github.com/adobe/react-spectrum.
 * Licensed under the Apache License.
 */
function isAttributeVisible(element: Element, childElement?: Element) {
  return (
    !element.hasAttribute('hidden') &&
    (element.nodeName === 'DETAILS' &&
    childElement &&
    childElement.nodeName !== 'SUMMARY'
      ? element.hasAttribute('open')
      : true)
  );
}

/**
 * Adapted from https://github.com/adobe/react-spectrum.
 * Licensed under the Apache License.
 */
export function isElementInScope(
  element?: Element | null,
  scope?: Element[] | null
) {
  if (!element) {
    return false;
  }

  if (!scope) {
    return false;
  }

  return scope.some((node) => node.contains(element));
}

/**
 * Adapted from https://github.com/adobe/react-spectrum.
 * Licensed under the Apache License.
 */
export function isElementVisible(
  element: Element,
  childElement?: Element
): boolean {
  return (
    element.nodeName !== '#comment' &&
    isStyleVisible(element) &&
    isAttributeVisible(element, childElement) &&
    (!element.parentElement || isElementVisible(element.parentElement, element))
  );
}

export interface FocusManagerOptions {
  /** The element to start searching from. The currently focused element by default. */
  from?: Element;
  /** Whether to only include tabbable elements, or all focusable elements. */
  tabbable?: boolean;
  /** Whether focus should wrap around when it reaches the end of the scope. */
  wrap?: boolean;
  /** A callback that determines whether the given element is focused. */
  accept?: (node: Element) => boolean;
}

const focusableElements = [
  'input:not([disabled]):not([type=hidden])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'a[href]',
  'area[href]',
  'summary',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]',
];

export const FOCUSABLE_ELEMENT_SELECTOR =
  focusableElements.join(':not([hidden]),') +
  ',[tabindex]:not([disabled]):not([hidden])';

focusableElements.push('[tabindex]:not([tabindex="-1"]):not([disabled])');
export const TABBABLE_ELEMENT_SELECTOR = focusableElements.join(
  ':not([hidden]):not([tabindex="-1"]),'
);

/**
 * Create a [TreeWalker]{@link https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker}
 * that matches all focusable/tabbable elements.
 *
 * Adapted from https://github.com/adobe/react-spectrum.
 * Licensed under the Apache License.
 *
 * @param root - Element to retrieve the TreeWalker for.
 */
export function getFocusableTreeWalker(
  root: Element,
  opts?: FocusManagerOptions,
  scope?: Element[]
) {
  let selector = opts?.tabbable
    ? TABBABLE_ELEMENT_SELECTOR
    : FOCUSABLE_ELEMENT_SELECTOR;
  let walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      // Skip nodes inside the starting node.
      if (opts?.from?.contains(node)) {
        return NodeFilter.FILTER_REJECT;
      }

      if (
        (node as Element).matches(selector) &&
        isElementVisible(node as Element) &&
        (!scope || isElementInScope(node as Element, scope)) &&
        (!opts?.accept || opts.accept(node as Element))
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }

      return NodeFilter.FILTER_SKIP;
    },
  });

  if (opts?.from) {
    walker.currentNode = opts.from;
  }

  return walker;
}
