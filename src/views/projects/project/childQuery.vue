<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="childName">
        <el-input v-model="queryParams.childName" placeholder="请输入子项名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item prop="area" placeholder="请选择区域">
        <el-cascader v-model="queryParams.area" :options="areaOptions" clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择子项类型" clearable size="small">
          <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleChildImport" v-hasPermi="['project:Project:import']">子项导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleChildExport" v-hasPermi="['project:Project:export']">子项导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleTestImport" v-hasPermi="['project:Project:import']">测点导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleTestExport" v-hasPermi="['project:Project:export']">测点导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['project:Project:remove']">删除选中</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="QRcode" v-hasPermi="['project:Project:export']">二维码下载
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="childList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="项目编号" align="center" prop="ProjectId" />
      <el-table-column label="项目名称" align="center" prop="ProjectCode" />
      <el-table-column label="项目地址" align="center" prop="ProjectName" />
      <el-table-column label="建设期次" align="center" prop="ProjectSort" />
      <el-table-column label="所属标段" align="center" prop="ProjectSort" />
      <el-table-column label="项目状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-tools" @click="handleDistribution(scope.row)"
            v-hasPermi="['project:Project:edit']">分配</el-button>
          <el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row)"
            v-hasPermi="['project:Project:edit']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['project:Project:edit']">修改</el-button>

          <el-button size="mini" type="text" icon="el-icon-bottom" @click="handleDownload(scope.row)"
            v-hasPermi="['project:Project:edit']">下载</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['project:Project:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 施工人员分配 -->
    <el-dialog :title="title" :visible.sync="distributionOpen" width="30%" append-to-body :before-close="handleClose">
      <el-form ref="distributionForm" :model="distributionForm" :rules="rules" label-width="80px">
        <el-form-item label="施工组" prop="constructionTeam">
          <el-input v-model="distributionForm.constructionTeam" placeholder="请输入项目名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="distributionSubmitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog :title="title" :visible.sync="infoOpen" width="80%" append-to-body>
      <el-row :gutter="24">
        <el-col :span="5">
          <div class="subList">
            <div class="header">
              <span>监测列表</span>
              <span class="addItem" @click="addPoint">添加测点</span>
            </div>
          </div>
        </el-col>

        <el-col :span="19">
          <el-form :model="subQueryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="85px">
            <el-form-item label="测点名称" prop="pointName">
              <el-input v-model="subQueryParams.pointName" placeholder="请输入测点名称" clearable size="small"
                :disabled="isDisabled" />
            </el-form-item>
            <el-form-item label="设计经纬度" prop="LongAndLatitude">
              <el-input v-model="subQueryParams.LongAndLatitude" placeholder="请输入设计经纬度" clearable size="small"
                :disabled="isDisabled">
                <el-button style="padding-right:10px" slot="suffix" type="text" v-if="isDisabled==false">选择</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="设备类型" prop="devType">
              <el-select v-model="queryParams.devType" placeholder="请选择设备类型" clearable size="small"
                :disabled="isDisabled">
                <el-option v-for="dict in devTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                  :value="dict.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备ID" prop="devId" v-if="isDisabled==false">
              <el-input v-model="subQueryParams.devId" size="small" disabled />
            </el-form-item>
          </el-form>
          <div class="dialog-footer" v-if="isDisabled==false">
            <el-button type="primary" @click="infoSubmitForm">确 定</el-button>
            <el-button @click="infoCancel">取 消</el-button>
          </div>
        </el-col>

      </el-row>

    </el-dialog>
  </div>
</template>

<script>
  import {
    listProject,
    getProject,
    delProject,
    addProject,
    updateProject,
    exportProject
  } from "@/api/projects/project";
  export default {
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
        // 总条数
        total: 0,
        showSearch: true,
        childList: [],
        loading: false,
        rules: {
          constructionTeam: [{
            required: true,
            message: "施工组不能为空",
            trigger: "blur"
          }]
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          ProjectCode: undefined,
          ProjectName: undefined,
          status: undefined
        },
        // 子项详情
        subQueryParams: {},
        // 子项类型
        typeOptions: [],
        statusOptions: [],
        // 设备类型
        devTypeOptions: [],
        // 区域
        areaOptions: [],
        // 弹出层
        distributionOpen: false,
        infoOpen: false,
        title: '',
        // 施工人员表单
        distributionForm: {},
        isDisabled: true
      }
    },
    created() {
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      /** 查询项目列表 */
      getList() {
        this.loading = true;
        listProject(this.queryParams).then(response => {
          this.childList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 项目状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      //   子项导入
      handleChildImport() {},
      // 子项导出
      handleChildExport() {},
      // 测点导入
      handleTestImport() {},
      // 测点导出
      handleTestExport() {},
      // 删除选中
      handleDelete(row) {
        const ProjectIds = row.ProjectId || this.ids;
        this.$confirm('是否确认删除项目编号为"' + ProjectIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delProject(ProjectIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      cancel() {
        this.distributionOpen = false;
        this.resetForm("distributionForm");
      },
      handleClose() {
        this.cancel();
      },
      infoCancel() {
        this.resetForm("infoForm");
        this.isDisabled = true;
      },
      infoSubmitForm() {

      },
      //   施工分配提交
      distributionSubmitForm() {
        this.$refs["distributionForm"].validate(valid => {
          if (valid) {

          }
        });
      },
      // 二维码
      QRcode() {
        this.$message('二维码功能开发中')
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ProjectId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      // 分配按钮操作
      handleDistribution() {
        this.title = "施工人员分配";
        this.distributionOpen = true;
      },
      // 详情按钮操作
      handleDetail() {
        this.title = "子项详情";
        this.infoOpen = true;
      },
      // 下载按钮操作
      handleDownload() {},
      //   添加测点
      addPoint() {
        this.isDisabled = false
      }

    }

  }

</script>

<style lang="scss">
  //   .el-dialog {
  //     display: flex;
  //     flex-direction: column;
  //     margin: 0 !important;
  //     position: absolute;
  //     top: 50%;
  //     left: 50%;
  //     transform: translate(-50%, -50%);
  //     /*height:600px;*/
  //     max-height: calc(100% - 30px);
  //     max-width: calc(100% - 30px);
  //   }

  //   .el-dialog .el-dialog__body {
  //     flex: 1;
  //     overflow: auto;
  //   }
  .subList {
    width: 100%;
    height: 700px;
    border: 1px solid #e6e6e6;
  }

  .subList .header {
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

</style>
