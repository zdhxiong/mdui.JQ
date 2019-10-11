import $ from '../$';
import { JQ } from '../JQ';
import JQElement from '../types/JQElement';
import Selector from '../types/Selector';
import { isString } from '../utils';
import './children';
import './eq';
import './get';
import './parent';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 如果没有传入参数，则返回当前对象中第一个元素相对于同辈元素的索引值。
     * 如果传入一个 CSS 选择器作为参数，则返回当前对象中第一个元素相对于 CSS 选择器匹配元素的索引值。
     * 如果传入一个 DOM 元素，则返回该 DOM 元素在当前对象中的索引值。
     * 如果传入一个 JQ 对象，则返回 JQ 对象中第一个元素在当前对象中的索引值。
     * @param selector
     */
    index(selector?: Selector | HTMLElement | JQ): number;
  }
}

$.fn.index = function(
  this: JQ,
  selector?: Selector | HTMLElement | JQ,
): number {
  if (!arguments.length) {
    return this.eq(0)
      .parent()
      .children()
      .get()
      .indexOf(this[0]);
  }

  if (isString(selector)) {
    return $(selector)
      .get()
      .indexOf(this[0] as HTMLElement);
  }

  return this.get().indexOf($(selector)[0]);
};
