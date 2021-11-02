<template>
  <div class="recycle_container">
    <el-form :model="queryParams" ref="queryParams" :inline="true" label-width="85px">
      <el-form-item prop="projectName">
        <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable size="small" />
      </el-form-item>
      <el-form-item prop="subProjectName">
        <el-input v-model="queryParams.subProjectName" placeholder="请输入子项名称" clearable size="small" />
      </el-form-item>
      <el-form-item prop="measuring">
        <el-input v-model="queryParams.measuring " placeholder="请输入测点名称" clearable size="small" />
      </el-form-item>
      <el-form-item prop="measuring">
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="handleRecovery">恢复</el-button>
        <el-button type="warning" @click="handleComDel">彻底删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" border :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="测点名称" align="center" prop="projectCode" />
      <el-table-column label="子项名称" align="center" prop="projectName" />
      <el-table-column label="项目名称" align="center" prop="projectAddress" />
      <el-table-column label="删除时间" align="center" prop="period" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-tools" @click="handleRecovery(scope.row)"
            v-hasPermi="['project:Project:edit']">恢复</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleComDel(scope.row)"
            v-hasPermi="['project:Project:edit']">彻底删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        loading: false,
        total: 0,
        ids: "",
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        dataList: []
      }
    },
    created() {},
    methods: {
      getList() {},
      handleQuery() {},
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      handleRecovery() {},
      handleComDel() {},

      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.subProjectId);
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
    }
  }

</script>

<style lang="scss" scoped>

</style>
