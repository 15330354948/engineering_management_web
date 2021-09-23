<template>
   <el-container class="main-map-container">
     <div class="main-map">
      <!-- gis地图 -->
      <baseMap />
     </div>
   </el-container>
</template>

<script>
import baseMap from "./baseMap/index"
export default {
  name: "Visualmap",
  components: {
    baseMap
  },
  data () {
    return {

    };
  },

  computed: {},

  methods: {}
}
</script>
<style lang='scss' scoped>
.main-map-container {
  height: 100vh;
  .main-map {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
}
</style>