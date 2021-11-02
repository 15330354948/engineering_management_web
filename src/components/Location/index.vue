<template>
  <el-container>
    <div id="location-map" class="location-map">
      <el-main>
        <div class="location-content">
          <div class="lonlat-obtain">
            <el-input v-model="lonlatData.longitude" placeholder="经度" clearable disabled />
            <el-input v-model="lonlatData.latitude" placeholder="纬度" clearable disabled />
            <el-button @click="btnClick" type="primary" size="mini">获取经纬度</el-button>
            <el-button @click="putLonLat" type="success" size="mini">确定</el-button>
            <el-button @click="clearLonLat" type="default" size="mini">重置</el-button>
          </div>
          <!-- gis地图 -->
          <base-map />
        </div>
      </el-main>
    </div>
  </el-container>
</template>

<script>
  import baseMap from "@/maps";
  import pgearthBaseMap from "@/maps/baseMap/pgearthBaseMap.js";

  export default {
    name: "location",
    components: {
      baseMap,
    },
    data() {
      return {
        data: "visualmap",
        lonlatData: {
          longitude: "",
          latitude: "",
        },
      };
    },
    created() {},
    mounted() {},
    methods: {
      btnClick() {
        pgearthBaseMap.remove();
        this.lonlatData = {
          longitude: "",
          latitude: "",
        };
        this.$message.success("请左键点击地图获取经纬度");
        pgearthBaseMap.getLonLat(this.getLonLat);
      },
      // 获取经纬度
      getLonLat(points) {
        if (points.longitude && points.latitude) {
          this.lonlatData = {
            longitude: points.longitude.toFixed(6),
            latitude: points.latitude.toFixed(6),
          };
        }
      },
      // 确认提交
      putLonLat() {
        this.$bus.$emit("getPoints", {
          longitude: this.lonlatData.longitude,
          latitude: this.lonlatData.latitude,
        });
      },
      // 清空经纬度
      clearLonLat() {
        this.lonlatData = {
          longitude: "",
          latitude: "",
        };
        pgearthBaseMap.remove();
      },
    },
  };

</script>

<style scoped lang="scss">
  .el-container {
    height: 50vh;
    width: 100%;

    .location-map {
      position: relative;
      width: 100%;
      height: 100%;

      .lonlat-obtain {
        position: absolute;
        top: 10px;
        left: 10px;
        height: 50px;
        width: 30vw;
        padding: 5px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: #121314cc;
        z-index: 1990;
      }
    }
  }

  .el-main {
    padding: 0;
  }

</style>

<style lang="scss">
  #location-map {
    #distanceLegendDiv {
      display: none;
    }

    .navigation-controls {
      display: none;
    }
  }

  .lonlat-obtain {
    .el-input {
      margin-right: 10px;
    }

    .el-input.is-disabled .el-input__inner {
      background: transparent;
      border: 1px solid #fff;
      color: #fff;
      width: 100%;
      text-align: center;
      padding: 0;
    }

    .el-select .el-input.is-disabled .el-input__inner {
      cursor: default;
    }

    .el-input__suffix {
      display: none;
    }
  }

</style>
