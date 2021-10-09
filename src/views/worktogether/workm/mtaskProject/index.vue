<template>
  <div class="mtaskProject-container">
    <el-table
      ref="mtaskProjectEditForm"
      :data="mtaskProjectEditForm"
      tooltip-effect="dark"
      style="width: 100%; margin-bottom: 20px"
      border
    >
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="50"
      ></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
      <el-table-column prop="name" label="人员类型" width="120">
      </el-table-column>
      <el-table-column prop="name" label="所属单位" width="120">
      </el-table-column>
      <el-table-column prop="name" label="所属单位" width="120">
      </el-table-column>
      <el-table-column prop="name" label="所属单位" width="120">
      </el-table-column>
      <el-table-column v-if="isReadOnly" label="今日" width="220">
        
        <template slot-scope="scope">
          <el-input placeholder="今日" v-model="scope.row.tdy"></el-input>
        </template>
      </el-table-column>

      <el-table-column v-else prop="name" label="每日"> </el-table-column>

      <el-table-column v-if="isReadOnly" label="每周">
        <template slot-scope="scope">
          <el-input autosize placeholder="每周" v-model="scope.row.week"></el-input>
        </template>
      </el-table-column>
      <el-table-column v-else prop="name" label="每周" width="180">
      </el-table-column>

      <el-table-column prop="month" v-if="isReadOnly" label="每月">
       <template slot-scope="scope">
          <el-input autosize placeholder="每月" v-model="scope.row.month"></el-input>
        </template>
      </el-table-column>

      <el-table-column v-else prop="name" label="每月"> </el-table-column>
    </el-table>
    <!-- 分页组件 -->
  </div>
</template>

<script>
export default {
  props: {
    mtaskProjectForm: Array,
    readonly: Boolean,
  },
  watch: {
    readonly: {
      handler(val) {
        this.isReadOnly = val;
      },
      immediate: true,
    },
  },
  data() {
    return {
      mtaskProjectEditForm: [],
      isReadOnly: false,
    };
  },
  created() {
    this.mtaskProjectEditForm = this.mtaskProjectForm.map((item) => {
      item.tdy = item.week = item.month = ''
      return item
    });
    this.$bus.$off(`dosave`).$on(`dosave`, () => {
      // 保存
      console.log(this.$refs["mtaskProjectEditForm"]);
    });
    this.$bus.$off(`dclose`).$on(`dclose`, () => {
      this.mtaskProjectEditForm = {};
    });
  },
};
</script>

<style lang="scss" scoped>
.mtaskProject-container {
  width: 100%;
  height: 100%;
}
</style>