const jumFunction = (key, color) => {
  const data = color.split(',')
  if (key < 10 / 3) {
    return data[0]
  }
  if (key > 10 / 3 && key < 20 / 3) {
    return data[1]
  }
  return data[2]
}
export const gauge = ({ data }, avg, splitNumber = 5) => {
  const options = {
    // 下载
    toolbox: {
      show: false,
      feature: {
        saveAsImage: {}
      }
    },
    series: [
      // 大圈
      {
        type: 'gauge',
        center: ['50%', '50%'],
        pointer: {
          show: false
        },
        radius: '60%',
        min: 20,
        max: 400,
        splitNumber: 12,
        progress: {
          show: false,
          itemStyle: {
            color: 'auto'
          }
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false,
          roundCap: true,
          lineStyle: {
            width: 5,
            color: [[0.25, '#6EDAA9'], [0.5, '#FCCE57'], [0.75, '#FF9732'], [1, '#F55B4B']]
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: true,
          distance: -20,
          length: 6, // 刻真长度
          lineStyle: {
            color: 'auto'
          }
        }
      },
      // 小圈
      {
        type: 'gauge',
        center: ['50%', '50%'],
        pointer: {
          show: false
        },
        radius: '60%',
        min: 20,
        max: 400,
        splitNumber: 10,
        progress: {
          show: false
        },
        axisLabel: {
          show: false,
          distance: -65,
          color: '#999'
        },
        splitLine: {
          show: false
        },
        axisTick: {
          distance: -7,
          length: 3, // 刻真长度
          lineStyle: {
            color: '#EAF4F9'
          }
        },
        axisLine: {
          show: true,
          roundCap: true,
          lineStyle: {
            width: 2,
            color: [[1, '#EAF4F9']]
          }
        },
        data: []
      },
      // 进度条
      {
        type: 'gauge',
        center: ['50%', '50%'],
        z: 10,
        pointer: {
          show: true,
          icon: 'circle',
          offsetCenter: [0, '-68%'],
          itemStyle: {
            color: 'auto'
          }
        },
        radius: '60.5%',
        min: 20,
        max: 80,
        splitNumber: 6,
        progress: {
          show: true,
          roundCap: true,
          width: 3,
          itemStyle: {
            color: 'auto'
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: [[0.25, '#6EDAA9'], [0.5, '#FCCE57'], [0.75, '#FF9732'], [1, '#F55B4B']]
          }
        },
        axisLabel: {
          show: false,
          distance: -55,
          color: 'inherit',
          lineStyle: {
            width: 6
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          show: false,
          distance: -25,
          length: 10,
          lineStyle: {
            color: 'auto'
          }
        },
        detail: {
          show: false,
          offsetCenter: ['0%', '-10%'],
          fontSize: 30,
          fontWeight: 'bold',
          color: 'inherit',
          valueAnimation: true
        },
        title: {
          show: false,
          fontSize: 14,
          offsetCenter: ['0%', '30%'],
          valueAnimation: true,
          color: '#EEF6FA'
        },
        data: [
          { value: 50, name: 'SCORE' }
        ]
      },
      {
        type: 'gauge',
        center: ['50%', '50%'],
        pointer: {
          show: false,
          icon: 'circle',
          offsetCenter: [0, '-68%'],
          itemStyle: {
            color: 'auto'
          }
        },
        radius: '60.5%',
        min: 20,
        max: 80,
        splitNumber: 6,
        progress: {
          show: false,
          roundCap: true,
          width: 3,
          itemStyle: {
            color: 'auto'
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: [[0.25, '#6EDAA9'], [0.5, '#FCCE57'], [0.75, '#FF9732'], [1, '#F55B4B']]
          }
        },
        axisLabel: {
          show: true,
          distance: -55,
          color: 'inherit',
          lineStyle: {
            width: 6
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          show: false,
          distance: -25,
          length: 10,
          lineStyle: {
            color: 'auto'
          }
        },
        detail: {
          show: true,
          offsetCenter: ['0%', '-10%'],
          fontSize: 30,
          fontWeight: 'bold',
          color: 'inherit',
          valueAnimation: true,
          formatter: function(value) {
            return '{value|' + value + '}';
          },
          rich: {
            unit: {}
          },
        },
        title: {
          fontSize: 14,
          offsetCenter: ['0%', '30%'],
          valueAnimation: true,
          color: '#EEF6FA'
        },
        data: [
          { value: 50, name: 'SCORE' }
        ]
      }
    ]
  }
  const row = data[0]
  options.series.forEach((ele, index) => {
    if ([0, 2, 3].includes(index)) {
      ele.axisLine.lineStyle.color = data.map(({ max, total, color }) => {
        return [(max - 0.001 - row.min) / (total - row.min), color]
      })
    }
    if ([2, 3].includes(index)) {
      ele.data = [{ value: avg || 0, name: 'SCORE' }]
    }
    if ([1, 2, 3].includes(index)) {
      ele.max = row.total
      ele.min = row.min
      ele.splitNumber = splitNumber
    }
  })
  return options
}
export const bar = (config, ruleForm) => {
  const options = {
    legend: {
    },
    grid: {
      bottom: '24%',
      top: '25%',
      right: '0%',
      x: 40,
      x2: 100,
      y2: 150
    },
    xAxis: {
      type: 'category',
      data: [], // 配置
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        interval: 0
        // rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      max: 200,
      min: 0,
      splitNumber: 5
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    series: [{
      data: [],
      barMaxWidth: '35',
      type: 'bar'
    }]
  }
  options.xAxis.data = config.map(item => item.label)
  config.forEach(({ label, value, data }) => {
    const score = ruleForm[`${value}StandardScore`]
    options.series[0].data.push({
      value: score.toFixed(2),
      name: label,
      label: {
        show: true,
        position: 'top',
        color: 'inherit'
      },
      itemStyle: {
        color: data.find(ele => score >= ele.min && score < ele.max).color,
        borderRadius: [2, 2, 0, 0]
      }
    })
  })
  return options
}
function colors(data, value) {
  const row = data.find(({ min, max }) => {
    return value >= min && value < max
  })
  return row && row || { color: 'red', label: '' }
}
import * as echarts from 'echarts'

export const line = (config, ruleForm) => {
  const { data, score, label, bg } = ruleForm
  let color
  if (['活力度', '开心度', '愤怒度', '悲伤度', '恐惧度'].includes(label)) {
    color = jumFunction(score, bg)
  } else {
    color = colors(config, score).color
  }
  const options = {
    grid: {
      right: '5%',
      left: '5%',
      top: '5%'
      // bottom: '10%'
    },
    tooltip: {
      trigger: 'axis',
      position: function(pt) {
        return [pt[0], 130]
      },
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'SaddleBrown'
        }
      }
    },
    xAxis: {
      boundaryGap: false,
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100
    }, {
      start: 0,
      end: 100
    }],
    series: [
      {
        name: '报告分数',
        type: 'line',
        smooth: true,
        // symbol: 'circle',
        showSymbol: false,
        label: {
          position: 'top',
          color: '#fff'
        },
        data: []
      }
    ]
  }
  options.series[0].areaStyle = {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      offset: 0,
      color: color
    }, {
      offset: 1,
      color: '#fff'
    }])
  }
  options.series[0].lineStyle = {
    color: color
  }
  const { min, total } = config[0]
  options.yAxis.min = min
  options.yAxis.max = total
  options.yAxis.splitNumber = total === 450 ? 2 : 5
  options.tooltip.formatter = (params) => {
    const { value, serialNo } = params[0].data
    const style = { color: 'red' }
    if (['活力度', '开心度', '愤怒度', '悲伤度', '恐惧度'].includes(label)) {
      style.color = jumFunction(value, bg)
    } else {
      style.color = colors(config, value).color
    }
    /* eslint-disable */
    return `
        报告编号: ${serialNo} \<br />
        报告分数: <span style="color: ${style.color}">${Number(value)}${['中风风险', '心脏病风险', '心血管疾病风险', '血氧饱和度'].includes(label) ? '%' : ''}</span> \<br />
      `
  }
  options.xAxis.data = data.map(({ creationTime }) => {
    return creationTime
  })
  // // '中风风险', '心脏病风险', '心血管疾病风险'
  options.series[0].data = data.map(({ creationTime, value, serialNo }) => {
    return {
      name: creationTime,
      value: value,
      serialNo: serialNo,
      itemStyle: {
        // color: '#fff'
      },
      lineStyle: {
        color: color
      }
    }
  })
  return options
}
export const afBar = ({ data }) => {
  const options = {
    grid: {
      right: '5%',
      top: '20%',
      left: '10%',
      bottom: '10%'
    },
    xAxis: [{
      show: false,
      type: 'category'
    }],
    yAxis: [{
      type: 'value',
      min: -1,
      max: 1,
      splitNumber: 1,
      axisLabel: {
        formatter: (params) => {
          if (params === 0) {
            return '0'
          } else if (params === -1) {
            return '发作'
          } else {
            return '未发作'
          }
        }
      }
    }],
    series: [{
      name: '直接访问',
      type: 'bar',
      barWidth: 15,
      data: data.map(({ creationTime, value, serialNo }) => {
        return {
          name: creationTime,
          value: value === 0 ? 1 : -1,
          serialNo: serialNo,
          itemStyle: {
            color: value === 0 ? '#6edaa9' : '#ff5252'
          }
        }
      })
    }]
  }
  options.tooltip = {}
  options.tooltip.formatter = (params) => {
    const { value, serialNo } = params.data
    return `
      <span style="color: ${value > 0 ? '#6edaa9' : '#ff5252'}">${value > 0 ? '未发作' : '发作'}</span> \<br />
      报告编号: ${serialNo}
    `
  }
  return options
}
export const lineSummary = (config, ruleForm) => {
  // con
  const { data, score, label, bg } = ruleForm
  let color = 'red'
  if (['活力度', '开心度', '愤怒度', '悲伤度', '恐惧度'].includes(label)) {
    color = jumFunction(score, bg)
  } else {
    color = colors(config.data, score).color
  }
  const options = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      show: false
    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    yAxis: {
      show: false
    },
    series: [{
      data: data.map(item => item.value),
      type: 'line',
      symbol: 'none',
      itemStyle: {
        color: color
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: color
        }, {
          offset: 1,
          color: '#fff'
        }])
      }
    }]
  }
  return options
}
export const afGauge = (value = 0) => {
  const keyValue = value === 0 ? 100 : value * 100
  return {
    series: [
      // 底部背景
      {
        name: 'Pressure',
        type: 'gauge',
        progress: {
          show: true,
          roundCap: true
        },
        itemStyle: {
          color: value === 0 ? '#6edaa9' : '#ff5252'
        },
        splitLine: {
          distance: -22,
          length: 5,
          lineStyle: {
            width: 2,
            color: '#ddd'
          }
        },
        axisTick: {
          distance: -18,
          length: 3,
          lineStyle: {
            width: 2,
            color: '#ddd'
          }
        },
        // radius: '50%',
        pointer: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          show: false
        },
        axisLine: {
          show: false,
          roundCap: true
        },
        detail: {
          show: false
        },
        data: [
          {
            value: keyValue
          }
        ]
      }
    ]
  }
}
