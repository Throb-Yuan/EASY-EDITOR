﻿

/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
  let search = params;
  search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
  dateRange = Array.isArray(dateRange) ? dateRange : [];
  if (typeof (propName) === 'undefined') {
    search.params['beginTime'] = dateRange[0];
    search.params['endTime'] = dateRange[1];
  } else {
    search.params['begin' + propName] = dateRange[0];
    search.params['end' + propName] = dateRange[1];
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  if (value === undefined) {
    return "";
  }
  var actions = [];
  Object.keys(datas).some((key) => {
    if (datas[key].value == ('' + value)) {
      actions.push(datas[key].label);
      return true;
    }
  })
  if (actions.length === 0) {
    actions.push(value);
  }
  return actions.join('');
}


/**
 * 添加开始和结束时间到 params 参数中
 *
 * @param params 参数
 * @param dateRange 时间范围。
 *                大小为 2 的数组，每个时间为 yyyy-MM-dd 格式
 * @param propName 加入的参数名，可以为空
 */
export function addBeginAndEndTime(params, dateRange, propName) {
  // 必须传入参数
  if (!dateRange) {
    return params;
  }
  // 如果未传递 propName 属性，默认为 time
  if (!propName) {
    propName = 'Time';
  } else {
    propName = propName.charAt(0).toUpperCase() + propName.slice(1);
  }
  // 设置参数
  if (dateRange[0]) {
    params['begin' + propName] = dateRange[0] + ' 00:00:00';
  }
  if (dateRange[1]) {
    params['end' + propName] = dateRange[1] + ' 23:59:59';
  }
  return params;
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
  if (value === undefined) {
    return "";
  }
  var actions = [];
  var currentSeparator = undefined === separator ? "," : separator;
  var temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some((val) => {
    var match = false;
    Object.keys(datas).some((key) => {
      if (datas[key].value == ('' + temp[val])) {
        actions.push(datas[key].label + currentSeparator);
        match = true;
      }
    })
    if (!match) {
      actions.push(temp[val] + currentSeparator);
    }
  })
  return actions.join('').substring(0, actions.join('').length - 1);
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments, flag = true, i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

// 数据合并
export function mergeRecursive(source, target) {
  for (var p in target) {
    try {
      if (target[p].constructor == Object) {
        source[p] = mergeRecursive(source[p], target[p]);
      } else {
        source[p] = target[p];
      }
    } catch (e) {
      source[p] = target[p];
    }
  }
  return source;
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  var childrenListMap = {};
  var nodeIds = {};
  var tree = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

/**
* 参数处理
* @param {*} params  参数
*/
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && typeof (value) !== "undefined") {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && typeof (value[key]) !== 'undefined') {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result
}

// 验证是否为blob格式
export async function blobValidate(data) {
  try {
    const text = await data.text();
    JSON.parse(text);
    return false;
  } catch (error) {
    return true;
  }
}


/**
 * 获取当前时间
 * @param timeStr 时分秒 字符串 格式为 xx:xx:xx
 */
export function getNowDateTime(timeStr) {
  let now = new Date();
  let year = now.getFullYear(); //得到年份
  let month = (now.getMonth() + 1).toString().padStart(2, "0"); //得到月份
  let day = now.getDate().toString().padStart(2, "0"); //得到日期

  if (timeStr != null) {
    return `${year}-${month}-${day} ${timeStr}`;
  }
  let hours = now.getHours().toString().padStart(2, "0") // 得到小时;
  let minutes = now.getMinutes().toString().padStart(2, "0") // 得到分钟;
  let seconds = now.getSeconds().toString().padStart(2, "0") // 得到秒;
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 获得租户功能是否开启
 */
export function getTenantEnable() {
  // console.log("enable: " + process.env.VUE_APP_TENANT_ENABLE)
  if (process.env.VUE_APP_TENANT_ENABLE === "true") {
    return true;
  }
  if (process.env.VUE_APP_TENANT_ENABLE === "false") {
    return false;
  }
  return process.env.VUE_APP_TENANT_ENABLE || true;
}

/**
 * 获得文档是否开启
 */
export function getDocEnable() {
  if (process.env.VUE_APP_DOC_ENABLE === "true") {
    return true;
  }
  if (process.env.VUE_APP_DOC_ENABLE === "false") {
    return false;
  }
  return process.env.VUE_APP_DOC_ENABLE || false;
}

/**
 * 获得 Vue 应用的基础路径
 */
export function getBasePath() {
  return process.env.VUE_APP_APP_NAME || '/';
}

/**
 * 获得 Vue 应用的访问路径
 *
 * @param path 路径
 */
export function getPath(path) {
  // 基础路径，必须以 / 结尾
  let basePath = getBasePath();
  if (!basePath.endsWith('/')) {
    return basePath + '/';
  }
  // 访问路径，必须不能以 / 开头
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  return basePath + path;
}
