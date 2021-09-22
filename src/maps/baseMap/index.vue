<template>
  <div class="map_container" :id="mapIdName">
    
  </div>
</template>

<script>
import pgearthBaseMap from "./pgearthBaseMap"
  export default {
    name: "baseMap",
    data() {
      return {
        mapIdName: "map_id",
      }
    }
  }
</script>

<style lang="scss" scoped>
.map_container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>