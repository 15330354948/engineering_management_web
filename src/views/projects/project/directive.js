import Vue from 'vue'

export const defaultSelect = Vue.directive('defaultSelect', {
    bind(el, bindings, vnode) {
    const [values, options, prop, defaultProp, defaultValue] = bindings.value
    // 需要隐藏的标签索引
    const indexs = []
    const tempData = values.map(a => options.find(op => op[prop] === a))
    tempData.forEach((a, index) => {
      console.log(a);
      if (a[defaultProp] === defaultValue) indexs.push(index)
    })
    const dealStyle = function (tags) {
      tags.forEach((el, index) => {
        if (indexs.includes(index) && ![...el.classList].includes('select-tag-close-none')) {
          el.classList.add('none')
        }
      })
    }
    // 设置样式 隐藏close icon
    const tags = el.querySelectorAll('.el-tag__close')
    if (tags.length === 0) {
      // 初始化tags为空处理
      setTimeout(() => {
        const tagTemp = el.querySelectorAll('.el-tag__close')
        dealStyle(tagTemp)
      })
    } else {
      dealStyle(tags)
    }
  }
})
