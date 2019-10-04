import $ from '../$';
import contains from '../functions/contains';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 检查 container 元素内是否包含 contains 元素
     * @param container 父元素
     * @param contains 子元素
     * @example
```js
$.contains( document.documentElement, document.body ); // true
$.contains( document.body, document.documentElement ); // false
```
     */
    contains(
      container: HTMLElement | HTMLDocument,
      contains: HTMLElement | HTMLDocument,
    ): boolean;
  }
}

$.contains = contains;
