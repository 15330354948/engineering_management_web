<template>
  <div class="editAndInfo_container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="项目信息" name="projectInfo">
        <projectInfo :btnType="btnType" ref="projectInfo"></projectInfo>
      </el-tab-pane>
      <el-tab-pane label="资料文件" name="dataManagement">
        <dataManagement :btnType="btnType" ref="dataManagement"></dataManagement>
      </el-tab-pane>
      <el-tab-pane label="子项管理" name="subManagement">
        <subManagement :btnType="btnType" ref="subManagement"></subManagement>
      </el-tab-pane>
      <el-tab-pane label="维护管理" name="maintainManagement">
        <maintenance :btnType="btnType" ref="maintainManagement"></maintenance>
      </el-tab-pane>
      <el-tab-pane label="投资管理" name="investmentManagement">
        <information :btnType="btnType" ref="investmentManagement"></information>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import projectInfo from './tabsBar/projectInfo.vue'
  import dataManagement from './tabsBar/dataManagement.vue'
  import subManagement from './tabsBar/subManagement.vue'
  import maintenance from './tabsBar/maintenance.vue'
  import information from './tabsBar/Information.vue'
  export default {
    components: {
      projectInfo,
      dataManagement,
      subManagement,
      maintenance,
      information
    },
    props: ["btnType"],
    data() {
      return {
        activeName: 'projectInfo'
      }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      }
    }
  }

</script>

<style>

</style>
