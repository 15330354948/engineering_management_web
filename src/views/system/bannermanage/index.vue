<template>
  <div class="bannermanage-container">
    <template>
      <el-table
        :data="tableData"
        border
        style="width: 100%;height: 100%">
        <el-table-column
          prop="ordr"
          label="顺序">
        </el-table-column>
        <el-table-column
          prop="pic"
          label="图片">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作">
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
  export default {
    name: "bannerManage",
    data() {
      return {
        tableData: []
      }
    }
  }
</script>

<style lang="scss" scoped>
.bannermanage-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 10px;
}
</style>