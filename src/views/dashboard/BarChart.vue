<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    BarData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        color:['#61a4e4'],
        tooltip: {
          show:false,
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top:"20%",
          left:"10%",
          right:"20%",
          bottom:"30%",
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.BarData.xAxis,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color:'#333',
              width:'1'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#666'
            }
          },
        }],
        yAxis: [{
          show:false,
          type: 'value',
          splitLine:{
            show:false
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false
          },
          splitArea:{
            show:false,//是否显示分割区域
          },
        }],
        series: [{
          name: 'pageA',
          type: 'bar',
          stack: 'vistors',
          barWidth: '70%',
          itemStyle: {
            normal: {
              label:{
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                  color: '#333',
                  fontSize: 16
                }
              },
            },
          },  
          data: this.BarData.yAxis,
          animationDuration
        }]
      })
    }
  }
}
</script>
