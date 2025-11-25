<script>
import { gauge, bar, line, afBar, lineSummary, afGauge } from './echarts'
import * as echarts from 'echarts'
import resize from './resize'
import { h } from 'vue'
export default {
  mixins: [resize],
  props: {
    ruleForm: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: Array,
      default: () => []
    },
    config: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: () => '220px'
    },
    splitNumber: {
      type: Number,
      default: () => 5
    },
    height: {
      type: String,
      default: () => '220px'
    },
    type: {
      type: String,
      default: () => 'gauge'
    }
  },
  mounted() {
    this.$nextTick(() => {
      const { ruleForm, valueKey, type, config, splitNumber } = this
      let options
      if (type === 'gauge') {
        // const rows = config.find(ele => ele.value === valueKey[0])
        options = gauge({data: config}, ruleForm[valueKey[0]], splitNumber)
      }
      if (type === 'bar') {
        options = bar(config.filter(ele => valueKey.includes(ele.value)), ruleForm)
        options.xAxis.axisLabel.rotate = this.innerWidth < 1380 ? 45 : 0
      }
      if (type === 'line') {
        options = line(config, ruleForm)
      }
      if (type === 'afBar') {
        options = afBar(ruleForm)
      }
      if (type === 'lineSummary') {
        options = lineSummary(config.find(ele => valueKey.includes(ele.value)), ruleForm)
      }
      if (type === 'afGauge') {
        options = afGauge(ruleForm[valueKey[0]])
      }
      if (options) {
        this.echart = echarts.init(this.$refs.echarts)
        if (type === 'bar') {
          window.onresize = () => {
            options.xAxis.axisLabel.rotate = this.innerWidth < 1380 ? 45 : 0
            this.echart.setOption(options)
          }
        }
        this.echart.setOption(options)
        this.echart.on('click', () => {
          // this.$emit('handCallback', params.data)
        })
      }
    })
  },
  beforeDestroy() {
    if (!this.echart) {
      return
    }
    window.onresize = null
    this.echart.dispose()
    this.echart = null
  },
  render() {
    const { width, height } = this
    return h('div', {
      ref: 'echarts',
      style: { height, width }
    })
  }
}
</script>
