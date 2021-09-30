<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
    pieData: {
      type: Array,
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
        color:['#ffcc99','#9583ff','#b530cd','#ff6992','#ffea5d'],
        title:{
          subtext:'合格率',
          left:'center',
          top:'32%',
          subtextStyle:{
            fontSize:16,
            color:'#000',
            fontWeight:'bold',
            fontFamily:'微软雅黑'
          }
        },
        tooltip: {
          trigger: 'item',
          // backgroundColor: '#fff', // 提示框浮层的背景颜色。
          // borderColor: '#333', // 提示框浮层的边框颜色。
          // textStyle: { // 提示框浮层的文本样式。
          //   color: '#333',
          //   fontSize: 14,
          // },
          // formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          right: 10,
          width:200,
          top: 50,
          bottom: 20,
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['50%', '38%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'right'
            },
            emphasis: {
              show:false
            },
            labelLine: {
              show: false
            },
            data: this.pieData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
