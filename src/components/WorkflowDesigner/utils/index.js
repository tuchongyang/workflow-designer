/**
 * 生成一个用不重复的ID
 */
export function uniqueId(randomLength) {
  return Number(Math.random().toString().substr(3, 6) + Date.now())
    .toString(36)
    .substr(0, randomLength)
}
/**
 * 获取一个dom节点的绝对定位，相对于整个document
 */
export function getPosition(dom) {
  let t = dom.offsetTop,
    l = dom.offsetLeft
  let obj = dom
  //从目标元素开始向外遍历，累加top和left值
  for (t = obj.offsetTop, l = obj.offsetLeft; (obj = obj.offsetParent); ) {
    t += obj.offsetTop
    l += obj.offsetLeft
  }
  return {
    left: l,
    top: t,
  }
}
export function deepClone(source) {
  if (!source || source instanceof Date || source instanceof File || typeof source !== "object") {
    return source
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

import mitt from "mitt"

export const bus = mitt()
