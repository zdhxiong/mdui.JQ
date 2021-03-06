import $ from '../../jq_or_jquery';

describe('$.data, $.removeData', function() {
  beforeEach(function() {
    $('#test').html('<div class="intro" data-key="val"></div>');
  });

  it('$.data(element, key, value)', function() {
    const intro = $('.intro')[0];
    const testArrayData = [1, 2, 3, 4];
    const testObjectData = { test1: 'test1', test2: 'test2' };

    // 在 window 上存储数据
    $.data(window, 'string', 'value');
    chai.assert.equal($.data(window, 'string'), 'value');
    $.removeData(window, 'string');
    chai.assert.isUndefined($.data(window, 'string'));

    // 在 document 上存储数据
    $.data(document, 'string', 'value2');
    chai.assert.equal($.data(document, 'string'), 'value2');
    $.removeData(document, 'string');
    chai.assert.isUndefined($.data(document, 'string'));

    // 键名转为驼峰法
    $.data(document, 'sub-key', 'sub-val');
    chai.assert.equal($.data(document, 'sub-key'), 'sub-val');
    chai.assert.equal($.data(document, 'subKey'), 'sub-val');
    chai.assert.deepEqual($.data(document), { subKey: 'sub-val' });
    $.removeData(document, 'sub-key');
    chai.assert.isUndefined($.data(document, 'sub-key'));
    chai.assert.isUndefined($.data(document, 'subKey'));

    // 存储字符串
    const val = $.data(intro, 'string', 'value');
    chai.assert.equal(val, 'value');
    chai.assert.equal($.data(intro, 'string'), 'value');

    // 删除数据
    $.removeData(intro, 'string');
    chai.assert.isUndefined($.data(intro, 'string'));

    // 覆盖 data-* 属性
    $.data(intro, 'key', 'newval');
    chai.assert.equal($.data(intro, 'key'), 'newval');

    // 删除数据后，恢复为默认
    $.removeData(intro, 'key');
    chai.assert.isUndefined($.data(intro, 'key'));

    // 存储对象
    $.data(intro, 'object', testObjectData);
    chai.assert.deepEqual($.data(intro, 'object'), testObjectData);

    // 再次存储相同键名的对象
    $.data(intro, 'object', { test1: 'aa', bb: 'bb' });
    chai.assert.deepEqual($.data(intro, 'object'), { test1: 'aa', bb: 'bb' });

    // 存储数组
    $.data(intro, 'array', testArrayData);
    chai.assert.sameOrderedMembers($.data(intro, 'array'), testArrayData);

    // $.data(element, key, undefined) 相当于 $.data(element, key)
    chai.assert.sameOrderedMembers(
      $.data(intro, 'array', undefined),
      testArrayData,
    );
    chai.assert.sameOrderedMembers($.data(intro, 'array'), testArrayData);

    // $.data(element, key, null) 将存储 null 值
    chai.assert.isNull($.data(intro, 'nullkey', null));
    chai.assert.isNull($.data(intro, 'nullkey'));
  });

  it('$.data(element, data)', function() {
    const intro = $('.intro')[0];
    const testObjectData = { test1: 'test1', test2: 'test2' };

    // 通过键值对存储数据
    const val = $.data(intro, testObjectData);
    chai.assert.deepEqual(val, testObjectData);
    chai.assert.deepEqual($.data(intro), testObjectData);
    chai.assert.equal($.data(intro, 'test1'), 'test1');
    chai.assert.equal($.data(intro, 'test2'), 'test2');
  });

  it('$.data(element, key)', function() {
    const intro = $('.intro')[0];

    // 无法获取 data-* 的值
    chai.assert.isUndefined($.data(intro, 'key'));

    // 读取不存在的值
    chai.assert.isUndefined($.data(intro, 'test'));
  });

  it('$.data(element)', function() {
    const intro = $('.intro')[0];

    // 读取不了 data-* 属性
    chai.assert.deepEqual($.data(intro), {});

    // 获取所有数据
    $.data(intro, 'string', 'value');
    $.data(intro, {
      objkey1: 'objval1',
      objkey2: 'objval2',
    });
    chai.assert.deepEqual($.data(intro), {
      string: 'value',
      objkey1: 'objval1',
      objkey2: 'objval2',
    });

    // 删除所有数据
    $.removeData(intro);
    chai.assert.deepEqual($.data(intro), {});

    // 键名转为驼峰法
    const val = $.data(intro, {
      'sub-key': 'sub-val',
    });
    chai.assert.deepEqual(val, { 'sub-key': 'sub-val' });
    chai.assert.deepEqual($.data(intro), { subKey: 'sub-val' });
    $.removeData(intro, 'sub-key');
    chai.assert.deepEqual($.data(intro), {});
  });

  it('$.removeData(element)', function() {
    // tested
  });

  it('$.removeData(element, name)', function() {
    // name 可以是用空格分隔的多个键名，或用数组表示的多个键名
    $.data(document.body, {
      a: 'aa',
      b: 'bb',
      c: 'cc',
      d: 'dd',
      e: 'ee',
      f: 'ff',
      g: 'gg',
      h: 'hh',
      'i-i': 'ii',
      'j-j': 'jj',
    });

    $.removeData(document.body, 'a b  c');
    chai.assert.deepEqual($.data(document.body), {
      d: 'dd',
      e: 'ee',
      f: 'ff',
      g: 'gg',
      h: 'hh',
      iI: 'ii',
      jJ: 'jj',
    });

    $.removeData(document.body, ['d', 'e f', 'g', 'i-i']);
    chai.assert.deepEqual($.data(document.body), {
      e: 'ee',
      f: 'ff',
      h: 'hh',
      jJ: 'jj',
    });

    $.removeData(document.body, 'f j-j');
    chai.assert.deepEqual($.data(document.body), {
      e: 'ee',
      h: 'hh',
    });
  });
});
