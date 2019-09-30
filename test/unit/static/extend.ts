import $ from '../../../es/$';
import '../../../es/static/extend';
import merge from '../../../src/functions/merge';

describe('$.extend', function() {
  it('$.extend(obj)', function() {
    let _this;
    const merged = $.extend({
      testFunc: function() {
        _this = this;
        return 'testFunc';
      },
      testFunc2: function() {
        return 'testFunc2';
      },
    });

    chai.assert.deepEqual(merged, $);
    chai.assert.equal($.testFunc(), 'testFunc');
    chai.assert.equal($.testFunc2(), 'testFunc2');
    chai.assert.deepEqual(_this, merged); // this 指向 $
  });

  it('$.extend(obj1, obj2, ...)', function() {
    const obj1 = { key: 'val' };
    const obj2 = { key1: 'val1' };
    const obj3 = { key2: 'val2', key3: undefined, key4: null }; // 值为 undefined 不合并
    const expected = { key: 'val', key1: 'val1', key2: 'val2', key4: null };
    const result = $.extend(obj1, obj2, obj3);

    chai.assert.deepEqual(obj1, expected);
    chai.assert.deepEqual(result, expected);
  });
});
