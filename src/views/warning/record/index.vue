<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item prop="receiver">
        <el-input
          v-model="queryParams.receiver"
          placeholder="请输入接收用户名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="sendFlag">
        <el-select
          v-model="queryParams.sendFlag"
          placeholder="请选择发送标识"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in flagOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="sendResult">
        <el-select
          v-model="queryParams.sendResult"
          placeholder="请选择发送状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="发送开始日期"
          end-placeholder="发送结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleExport"
          v-hasPermi="['project:Project:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="recordList"
      border
    >
      <el-table-column label="接收用户名" align="center" prop="receiver" />
      <el-table-column label="账号" align="center" prop="phone" />
      <el-table-column label="发送时间" align="center" prop="sendTime" />
      <el-table-column label="发送标识" align="center" prop="sendFlag" :formatter="flagFormat" />
      <el-table-column label="发送状态" align="center" prop="sendResult" :formatter="statusFormat" />
      <el-table-column label="内容" align="center" prop="content" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {listRecord, exportRecord,} from "@/api/warning/record";

export default {
  name: "record",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 通知表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 标识数据字典
      flagOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        receiver: undefined,
        sendResult: undefined,
        sendFlag: undefined,
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("send_result").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("send_flag").then((response) => {
      this.flagOptions = response.data;
    });
  },
  methods: {
    /** 查询通知列表 */
    getList() {
      this.loading = true;
      listRecord(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 通知状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.sendResult);
    },
    // 通知状态字典翻译
    flagFormat(row, column) {
      return this.selectDictLabel(this.flagOptions, row.sendFlag);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openSure = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange=[];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有通知数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportRecord(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>