<template>
  <div class="content">
    <el-row :gutter="24">
      <el-col :span="5">
        <div class="subList">
          <div class="header">
            <span>资料类型</span>
            <span class="el-icon-refresh"></span>
          </div>
        </div>
      </el-col>

      <el-col :span="19">
        <el-form :model="form" ref="form" :inline="true" label-width="85px">
          <el-form-item prop="pointName">
            <el-input v-model="form.pointName" placeholder="请输入资料名称" clearable size="small" />
          </el-form-item>
          <el-form-item prop="time">
            <el-date-picker v-model="form.time" type="datetimerange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="handleQuery">搜索</el-button>
            <el-button  @click="resetQuery">重置</el-button>
            <el-button type="primary" @click="download">下载</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" border :data="dataList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="项目编号" align="center" prop="ProjectId" />
          <el-table-column label="项目名称" align="center" prop="ProjectCode" />
          <el-table-column label="项目地址" align="center" prop="ProjectName" />
          <el-table-column label="建设期次" align="center" prop="ProjectSort" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <!-- <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-s-tools" @click="handleDistribution(scope.row)"
                v-hasPermi="['project:Project:edit']">分配</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['project:Project:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row)"
                v-hasPermi="['project:Project:edit']">详情</el-button>
              <el-button size="mini" type="text" icon="el-icon-bottom" @click="handleDownload(scope.row)"
                v-hasPermi="['project:Project:edit']">下载</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                v-hasPermi="['project:Project:remove']">删除</el-button>
            </template> -->
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
          @pagination="getList" />

      </el-col>
    </el-row>

   

  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {},
        dataList: [],
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        loading: false,
        ids: "",
        title: "",
      }
    },
    methods: {
      getList() {},
      handleQuery() {},
      resetQuery() {
        this.resetForm("form");
        this.handleQuery();
      },
      download() {},
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ProjectId)
      },
      
    }
  }

</script>

<style lang="scss" scoped>
  .subList {
    width: 100%;
    height: calc(100vh - 500px);
    border: 1px solid #e6e6e6;
  }

  .subList .header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    background-color: #f8f8f9;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    padding: 0 10px;
  }

  .subList .header span {
    font-weight: bold;
  }

  .subList .header .addItem {
    font-weight: normal;
    color: #66b1ff;
    cursor: pointer;
  }
  .el-icon-refresh{
    cursor: pointer;
  }

</style>
