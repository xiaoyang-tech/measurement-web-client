module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 19, // 表示根元素字体大小或根据input参数返回根元素字体大小
      propList: ['*'], // 可以从px更改为rem的属性, 通配符*表示启用所有属性
      selectorBlackList: ['.norem'] // 过滤掉.norem开头的class，不进行rem转换
    }
  }
}

