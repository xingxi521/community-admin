<template>
  <div ref="dom" />
</template>

<script>
import dayjs from 'dayjs'
const labelOption = {
  show: true,
  position: 'top',
  distance: 10,
  align: 'center',
  verticalAlign: 'middle',
  rotate: 0,
  formatter: '{c}',
  fontSize: 12
}
// 前7天日期
const dayArr = []
for (let i = 0; i < 7; i++) {
  const day = dayjs().subtract(i, 'd').format('YYYY-MM-DD')
  dayArr.push(day)
}
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
import { SERIES } from '@/libs/const/home'
export default {
  name: 'ServiceRequests',
  props: {
    series: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dom: null
    }
  },
  mounted () {
    const resultSeries = []
    Object.keys(this.series).forEach(key => {
      resultSeries.push({
        name: SERIES.getDescFromValue(key),
        type: 'bar',
        barGap: 0,
        label: labelOption,
        data: this.series[key]
      })
    })
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: dayArr
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: resultSeries
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  }
}
</script>
