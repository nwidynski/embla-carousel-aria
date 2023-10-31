<p align="center">
  <a href="https://github.com/davidjerleke/embla-carousel" target="_blank"><img width="70" height="70" src="/assets/embla-logo.svg" alt="Embla Carousel"></a>
</p>
<h2 align="center">Accessibility for Embla Carousel</h2>

<p align="center">
  This plugin adds ARIA-spec compliance to the amazing
  <a href="https://github.com/davidjerleke/embla-carousel">Embla Carousel</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/embla-carousel-aria" target="_blank">
    <img src="https://img.shields.io/npm/v/embla-carousel-aria.svg"
  /></a>
  
  <img alt="NPM" src="https://img.shields.io/npm/l/embla-carousel-aria">
  
  <a href="https://bundlephobia.com/result?p=embla-carousel-aria@8.0.0-rc14" target="_blank">
    <img
      src="https://img.shields.io/bundlephobia/minzip/embla-carousel-aria?color=%234c1&label=gzip%20size"
    />
  </a>
</p>

## Installation

First you need to follow the [installation instructions for Embla Carousel](https://github.com/davidcetinkaya/embla-carousel#installation), after that you can add aria support:

```sh
npm install --save embla-carousel-aria  # yarn add embla-carousel-aria
```

### JavaScript / TypeScript

```js
import EmblaCarousel from 'embla-carousel';
import { AriaPlugin } from 'embla-carousel-aria';

// initialize Embla Carousel
const embla = EmblaCarousel(
  emblaNode,
  {
    inViewThreshold: 0.25, // A high view threshold is recommended.
  },
  [AriaPlugin()]
);
```

### React

```js
import { useEmblaCarousel } from 'embla-carousel-react';
import { AriaPlugin } from 'embla-carousel-aria';

const EmblaCarouselComponent = ({ children }) => {
  const [emblaRef, embla] = useEmblaCarousel(
    {
      inViewThreshold: 0.25, // A high view threshold is recommended.
    },
    [AriaPlugin()]
  );

  // ...
};
```

## Options

### locale

**Type**: string<br/>
**Default**: en-US

Locale to be used in IETF's BCP 47 format.

### live

**Type**: boolean<br/>
**Default**: false

Whether the screen reader should announce slide changes. Recommended to be turned off if autoscroll is used.

### debounce

**Type**: number<br/>
**Default**: 300

The debounce to use when updating aria properties.

### onFocusChange

**Type**: Function<br/>
**Default**: (evt: HTMLElement, target: HTMLElement) => void

A callback function that is invoked when the focus is moved by the Aria plugin.

## Global Options

You can also set global options that will be applied to all instances. This allows for overriding the default plugin options with your own:

```js
AriaPlugin.globalOptions = {
  debounce: 1000,
};
```

## OS & Browser Support

- Mac OS (Chrome, Firefox, Safari, Edge), Magic Mouse, Magic Trackpad
- Windows (Chrome, Firefox, Edge), Microsoft Precision Touchpads

## Thanks

Kudos to [David Jerleke](https://github.com/davidjerleke) for creating [Embla Carousel](https://github.com/davidjerleke/embla-carousel) with its open API 🙏

## License

MIT.
