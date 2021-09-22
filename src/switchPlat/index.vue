<template>
  <div class="module-select">
    <header>自动化监测项目工程管理平台</header>
    <div class="bc_select-main">
      <div class="bc_top-module">
        <div class="module-item" style="margin-right: 6%" @click="gotoBaseMap" v-if="mapToBtn"><font>监管可视化</font></div>
        <div class="module-item" style="margin-left: 6%" @click="gotoSystem" v-if="sysToBtn"><font>管理后台</font></div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store'
import router from '../router'
import { mapGetters } from 'vuex'

export default {
  name: "switchPlat",
  computed: mapGetters(['info', 'mapShow', 'isAddPoint', 'roles', 'permissions']),
  data() {
    return{
      mapToBtn: false,
      sysToBtn: false,
    }
  },
  mounted() {
    this.roles.forEach(role => {
      if(role == 'admin'){
        this.mapToBtn= true;
        this.dataToBtn= true;
        this.sysToBtn= true;
      }else if(role == 'sysadmin'){
        this.sysToBtn= true;
      }else if(role == 'manage'){
        this.dataToBtn= true;
      }else if(role == 'supervise'){
        this.dataToBtn= true;
        this.mapToBtn= true;
      }else if(role == 'ipqc'){
        this.dataToBtn= true;
      }else{
        this.mapToBtn= false;
        this.dataToBtn= false;
        this.sysToBtn= false;
      }
    });
    let userInfo = router.currentRoute.query
  },
  methods: {
    gotoBaseMap() {
      router.push("/maps")
    },
    gotoSystem() {
      store.dispatch('GenerateRoutes', -1).then(accessRoutes => {
        router.addRoutes(accessRoutes)
      })
      setTimeout(() => {
        router.push("/index")
      }, 300);
    }
  }
}
</script>

<style lang="scss" scoped>
.module-select{
  position: relative;
  height: 100%;
  width: 100%;
  background: url("../assets/image/bg.png") 50% 50% no-repeat;
  background-size: cover;
  header{
    height: 90px;
    box-sizing: border-box;
    background: url("../assets/image/header.png") 50% 50% no-repeat;
    background-size: cover;
    font-size: 38px;
    color: #b3efff;
    text-align: center;
    line-height: 73px;
    font-weight: 700;
    text-shadow: 1px 1px 1px #000, -1px -1px 1px #b3efff;
  }
  .bc_select-main{
    height: calc(100% - 90px);
    width: 100%;
    .bc_top-module{
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .module-item {
      width: 260px;
      height: 246px;
      margin: 10px;
      background: url("../assets/image/btn.png") no-repeat;
      background-size: 100% 100%;
      border: none;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      color: rgb(3,243,255);
      transition: all .3s ease;
    }
    .module-item:hover{
      transform: scale(1.2);
    }
  }
}

</style>