<template>
  <div class="container">
    <div class="container-left">
      <div class="container-left-top">
        <h3 class="build-title">施工</h3>
        <div class="build-section">
          <div class="build-item">
            <h3 class="build-item-title">项目信息</h3>
            <ul class="porject-info">
              <li><span>111</span><span>项目</span></li>
              <li><span>111</span><span>子项</span></li>
              <li><span>111</span><span>测点</span></li>
            </ul>
          </div>
          <div class="build-item construction">
            <h3 class="build-item-title">施工进度</h3>
            <ul class="construction-info">
              <li><span>111</span><span>总任务</span></li>
              <li><span>111</span><span>待审核</span></li>
              <li><span>111</span><span>未开始</span></li>
              <li><span>111</span><span>驳回</span></li>
              <li><span>111</span><span>已上传</span></li>
              <li><span>111</span><span>通过</span></li>
            </ul>
          </div>
          <div class="build-item">
            <h3 class="build-item-title">计划进度</h3>
            <ul class="plan-info">
              <li><span>111</span><span>今日未完成人员</span></li>
              <li><span>111</span><span>本周未完成人员</span></li>
              <li><span>111</span><span>本月未完成人员</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="container-left-bottom inspection">
        <h3 class="build-title">巡检</h3>
        <div class="inspection-cont">
          <ul>
            <li><span>1</span><span><span>巡检总数</span></span></li>
            <li><span>1</span><span><span>进行中</span></span></li>
            <li><span>1</span><span><span>已完成</span></span></li>
          </ul>
          <div class="inspection-cont-chart">
            <div class="chart-wrapper">
              <pie-chart :pieData="pieData" />
            </div>
          </div>
        </div>
      </div>
      <div class="container-left-bottom maintain">
        <h3 class="build-title">维护</h3>
        <div class="maintain-cont">
          <div class="main">
            <div class="cont">
              <div class="title">维护任务</div>
              <div class="count">4</div>
            </div>
          </div>
          <div class="maintain-cont-chart">
            <div class="chart-wrapper">
              <bar-chart :BarData="BarData" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-right">
      <h3 class="build-title">综合</h3>
      <div class="comprehensive">
        <h4>累计基础数据</h4>
        <ul>
          <li><span>单位数</span><span>67</span></li>  
          <li><span>账户数</span><span>67</span></li>  
          <li><span>通讯录</span><span>67</span></li>  
        </ul>
      </div>
      <div class="comprehensive">
        <h4>本月考勤数据</h4>
        <ul>
          <li><span>打卡数</span><span>67</span></li>  
          <li><span>请假数</span><span>67</span></li>  
          <li><span>补卡录</span><span>67</span></li>  
        </ul>
      </div>
      <div class="comprehensive">
        <h4>本月日志数</h4>
        <ul>
          <li><span>累计登录</span><span>67</span></li>  
          <li><span>今日登录</span><span>67</span></li>  
          <li><span>累计操作</span><span>67</span></li>  
          <li><span>今日操作</span><span>67</span></li>  
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
export default {
  name: 'Index',
  components: {
    PieChart,
    BarChart
  },
  data() {
    return {
      pieData:[
        { value: 320, name: '正常项≥80%' },
        { value: 240, name: '正常项≥60%' },
        { value: 149, name: '正常项≥40%' },
        { value: 100, name: '正常项≥20%' },
        { value: 59, name: '正常项≥0%' }
      ],
      BarData:{
        xAxis:['较差','一般','良好','优秀'],
        yAxis:[1, 1, 0, 0]
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.chart-wrapper{
  position: relative;
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.container{
  display: flex;
  flex-wrap: nowrap;
  min-height: calc(100vh - 144px);
  height: 100%;
  padding: 15px;
  .container-left-top,.container-left-bottom,.container-right{
    border-radius: 5px;
    box-shadow: 0 1px 6px #ccc;
  }
  ul{
    list-style:none;
    margin: 0;
    padding: 0;
  }
  .build-title{
    margin: 0;
    padding: 10px 20px;
    font-size: 18px;
    font-weight: bold;
    position: relative;
  }
  .build-title:before {
    content: "";
    display: block;
    height: 15px;
    border-left: 3px solid currentColor;
    position: absolute;
    left: 10px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .container-left{
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    margin-right: 15px;
    .container-left-top{
      width:100%;
      margin-bottom: 20px;
      height: calc(46% - 20px);
      .build-section{
        display: flex;
        justify-content: center;
        position: relative;
        margin: 0 auto;
        .build-item{
          flex: 2;
          padding: 0 24px;
          .build-item-title{
            text-align: center;
            margin: 12px 0;
            font-size: 18px;
            font-weight: bold;
            color: #97a8be;
          }
          >ul{
            margin: 0 0 10px;
            display: flex;
            flex-direction: column;
            >li{
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-size: 100% 100% !important;
              padding: 12px;
              border-radius: 5px;
              margin-top: 10px;
              span{
                color: #fff;
              }
              span:first-of-type{
                font-size: 20px;
              }
              span:last-of-type{
                font-size: 12px;
              }
            }
          }
          .porject-info{
            li{
              background: url('~@/assets/image/btn_bg1.png');
            }
          }
          .construction-info{
            flex-wrap: wrap;
            flex-direction: row;
            li{
              flex-basis: calc(50% - 10px);
              margin: 0 5px 12px;
              background: url('~@/assets/image/btn_bg2.png');
            }
          }
          .plan-info{
            li{
              background: url('~@/assets/image/btn_bg3.png');
            }
          }
        }
        .construction{
          flex: 3;
        }
      }
      .build-section:before,.build-section:after {
        content: "";
        position: absolute;
        height: 50%;
        width: 3px;
        background: #f2f2f2;
        top: 50%;
        -webkit-transform: translateY(-30%);
        transform: translateY(-30%);
      }
      .build-section::after {
        right: calc(30% - 10px);
      }
      .build-section::before {
        left: calc(30% - 10px);
      }
    }
    .container-left-bottom{
      flex: 1;
      height: 54%;
    }
    .inspection-cont,.maintain-cont{
      padding: 0 20px;
      height: calc(100% - 50px);
      position: relative;
    }
    .inspection{
      margin-right: 6px;
      .inspection-cont{
        ul{
          display: flex;
          flex-direction: row;
          flex: 1;
          li{
            width: 100%;
            height: 74px;
            margin-left: 6px;
            position: relative;
            span{
              color: #fff;
              line-height: 70px;
            }
            >span:first-of-type{
              width: 74px;
              height: 100%;
              display: block;
              position: absolute;
              left: 0;
              border-radius: 50%;
              text-align: center;
              background: #9583ff;
              font-size: 30px
            }
            >span:last-of-type{
              display: block;
              width: calc(100% - 37px);
              height: 100%;
              margin-left: 37px;
              font-size: 18px;
              background: rgba(174,161,251,.8);
              border-radius: 0 5px 5px 0;
              span{
                display: block;
                width: calc(100% - 37px);
                height: 100%;
                margin-left: 37px;
                text-align: center;
              }
            }
          }
          li:first-of-type{
            margin-left: 0;
          }
        }
        .inspection-cont-chart{
          width: calc(100% - 40px);
          position: absolute;
          height: calc(100% - 74px);
        }
      }
    }
    .maintain{
      margin-left: 6px;
      .maintain-cont{
        .main{
          width: 100%;
          height: 44%;
          .cont{
            width: 70%;
            height: 100%;
            position: relative;
            margin: 0 15%;
            box-shadow: 0 0 30px 0 #ccc;
            background: url('~@/assets/image/charts_bg.png') no-repeat;
            background-size: 100% 100%;
            .title{
              position: absolute;
              color: #5e6c84;
              font-size: 20px;
              left: 35px;
              top: 26px;
            }
            .count{
              position: absolute;
              color: #344563;
              font-size: 46px;
              left: 35px;
              bottom: 26px;
            }
          }
        }
      }
    }
  }
  .container-right{
    width: 360px;
    min-width: 200px;
    .comprehensive{
      margin-bottom: 20px;
      h4{
        color: #97a8be;
        margin: 0;
        padding: 10px 0 0;
        text-align: center
      }
      ul{
        margin: 0 30px;    
        display: flex;
        flex-direction: column;
        li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ddd;
          font-size: 14px;
          line-height: 24px;
          color: #333;
          font-weight: bold;
          margin: 15px 0;
          span:last-of-type{
            color: #97a8be;
          }
        }
      }
    }
  }
}
</style>
