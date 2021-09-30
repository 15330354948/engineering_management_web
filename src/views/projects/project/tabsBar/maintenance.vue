<template>
  <div>
    <el-form :model="queryParams" ref="queryParams" :inline="true" label-width="85px">
      <el-form-item prop="taskName">
        <el-input v-model="queryParams.taskName" placeholder="请输入维护任务名称" clearable size="small" />
      </el-form-item>
      <el-form-item prop="people">
        <el-input v-model="queryParams.people" placeholder="请输入维护人" clearable size="small" />
      </el-form-item>
      <el-form-item prop="time">
        <el-date-picker v-model="queryParams.time" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="result">
        <el-select v-model="queryParams.result" placeholder="请选择结果" clearable size="small">
          <el-option v-for="dict in resultOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="maintenanceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="维护任务名称" align="center" prop="taskName" />
      <el-table-column label="维护人" align="center" prop="people" />
      <el-table-column label="计划完成时间" align="center" prop="time" />
      <el-table-column label="实际完成时间" align="center" prop="endTime" />
      <el-table-column label="维护结果" align="center" prop="result" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
  export default {
    props: ['btnType'],
    data() {
      return {
        form: {},
        resultOptions: [],
        ids: '',
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        loading: false,
        maintenanceList: []
      }
    },
    methods: {
      getList() {},
      handleQuery() {},
      resetQuery() {
        this.resetForm("queryParams");
        this.handleQuery();
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ProjectId)
      },
    }
  }

</script>

<style>

</style>
