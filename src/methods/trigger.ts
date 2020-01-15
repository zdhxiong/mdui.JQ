import $ from '../$';
import PlainObject from '../interfaces/PlainObject';
import { JQ } from '../JQ';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 触发指定的事件
     * @param type 事件名
     * @param extraParameters 传给事件处理函数的额外参数
     * @example ````触发 .box 元素上的 click 事件
```js
$('.box').trigger('click');
```
     * @example ````触发 .box 元素上的 click 事件，并给事件处理函数传入额外参数
```js
$('.box').trigger('click', {key1: 'value1', key2: 'value2'});
```
     */
    trigger(
      type: string,
      extraParameters?: any[] | PlainObject | string | number | boolean,
    ): this;
  }
}

$.fn.trigger = function(this: JQ, type: string, extraParameters: any): JQ {
  type EventParams = {
    detail?: any;
    bubbles: boolean;
    cancelable: boolean;
  };

  let event: MouseEvent | CustomEvent;
  const eventParams: EventParams = {
    bubbles: true,
    cancelable: true,
  };
  const isMouseEvent =
    ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(type) > -1;

  if (isMouseEvent) {
    // Note: MouseEvent 无法传入 detail 参数
    event = new MouseEvent(type, eventParams);
  } else {
    eventParams.detail = extraParameters;
    event = new CustomEvent(type, eventParams);
  }

  // @ts-ignore
  event._detail = extraParameters;

  return this.each(function() {
    this.dispatchEvent(event);
  });
};
