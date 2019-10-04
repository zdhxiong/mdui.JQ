import './addClass';
import JQElement from '../types/JQElement';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 元素上的 CSS 类，有则删除，无则添加。多个类名之间可以用空格分隔。
     * @param className
     * @example ````p 元素上有 item 类，则移除；否则，添加 item 类
```js
$('p').toggleClass('item')
```
     * @example ````切换 p 元素上的由回调函数返回的类
```js
$('p').toggleClass(function () {
  return 'item';
});
```
     */
    toggleClass(
      className:
        | string
        | ((
            this: HTMLElement,
            index: number,
            currentClassName: string,
          ) => string),
    ): this;
  }
}
