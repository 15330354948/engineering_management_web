<template>
  <div class="map_container" :id="mapIdName"></div>
</template>

<script>
import pgearthBaseMap from "./pgearthBaseMap";
export default {
  name: "baseMap",
  data() {
    return {
      coord: {
        lon: "0.0000°",
        lat: "0.0000°",
        height: "0.0000m",
      },
      mapIdName: "map_id",
      devInfoIf: false,
      devData: {},
    };
  },
  created() {
    this.$bus.$on("addMapPoints", this.addMapPoints);
    this.$bus.$on("removeLayer", (name) => {
      pgearthBaseMap.removeLayer(name);
    });
    this.$bus.$on("resetView", this.resetView);
    this.$bus.$on("enableTrans", this.enableTrans);
    this.$bus.$on("drawPipeLine", this.drawPipeLine);
    this.$bus.$on("drawEscapeLine", (obj) => {
      pgearthBaseMap.drawEscapeLine(obj);
    });
    this.$bus.$on("removePipeLine", this.removePipeLine);
    this.$bus.$on("drawEcology", (url, id) => {
      pgearthBaseMap.drawEcologyRedLine(url, id);
    });
    this.$bus.$on("addQxsyLayers", (obj) => {
      pgearthBaseMap.addQxsyLayers(obj);
    });
    this.$bus.$on("removeQxsyLayers", (name) => {
      pgearthBaseMap.removeQxsyLayers(name);
    });
    this.$bus.$on("showFocusPop", (data) => {
      pgearthBaseMap.showFocusPoint(data.points, data.options);
    });
    this.$bus.$on("addFocusPoint", (data) => {
      pgearthBaseMap.addLocationPoint(data.points);
    });
    // 关闭地图弹出框事件
    this.$bus.$on("devInfo", (val) => {
      this.devInfoIf = val;
    });
    window.closePop = () => {
      window.viewer && window.viewer.popupTemplate.closePop();
      pgearthBaseMap.removeGraphics("foucsGraphics");
    };
    window.showDevInfo = (data) => {
      this.devInfoIf = true;
      this.devData = data;
    };
    window.showPatrolInfo = (monitorId) => {
      if (monitorId) {
        this.$bus.$emit("changePopStatus", {
          monitorId: monitorId,
          status: true,
          title: "巡检记录",
        });
      }
    };
  },
  mounted() {
    let rootProto = this.$root.constructor.prototype;
    rootProto.mapFunc = pgearthBaseMap.initBaseMap(this.mapIdName, this);
  },
  methods: {
    enableTrans(opa) {
      pgearthBaseMap.enableTrans(opa);
    },
    drawPipeLine(url, action) {
      pgearthBaseMap.drawPipeLine(url, action);
    },
    removePipeLine() {
      pgearthBaseMap.removePipeLine();
    },
    addMapPoints(pointData) {
      pgearthBaseMap.addPointLists(pointData.pointsList, pointData.options);
    },
    resetView() {
      pgearthBaseMap.goView({
        longitude: 120.556723,
        latitude: 30.013977,
        height: 200000,
      });
    },
  },
  beforeDestroy() {
    this.$bus.$off("addMapPoints");
    this.$bus.$off("showFocusPop");
  }
};
</script>

<style lang="scss" scoped>
.map_container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>