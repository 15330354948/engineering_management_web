<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="ProjectCode">
        <el-input v-model="queryParams.ProjectCode" placeholder="请输入项目编号/名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item prop="area" placeholder="请选择区域">
        <el-cascader v-model="queryParams.area" :options="areaOptions" clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item prop="createPeriod">
        <el-select v-model="queryParams.createPeriod" placeholder="请选择创建期次" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item prop="section">
        <el-select v-model="queryParams.section" placeholder="请选择所属标段" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item prop="projectStatus">
        <el-select v-model="queryParams.projectStatus" placeholder="请选择项目状态" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click="handleAdd"
          v-hasPermi="['project:Project:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="handleImport" v-hasPermi="['project:Project:import']">导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="handleExport" v-hasPermi="['project:Project:export']">导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="handleChild" v-hasPermi="['project:Project:export']">子项查询
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['project:Project:remove']">删除选中</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ProjectList" @selection-change="handleSelectionChange">
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['project:Project:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row)"
            v-hasPermi="['project:Project:edit']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-bottom" @click="handleDownload(scope.row)"
            v-hasPermi="['project:Project:edit']">下载</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['project:Project:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加项目对话框 -->
    <el-dialog :title="title" :visible.sync="addOpen" width="70%" append-to-body :before-close="handleClose">
      <addForm @closeDialog="closeDialog" ref="child"></addForm>
    </el-dialog>

    <!-- 子项查询对话框 -->
    <el-dialog :title="title" :visible.sync="childOpen" width="70%" append-to-body>
      <childQuery></childQuery>
    </el-dialog>

    <!-- 修改或详情 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body :before-close="editAndInfoClose">
      <editAndInfo :btnType="btnType" ref="editAndInfo"></editAndInfo>
    </el-dialog>

    <!-- 人员分配 -->
    <el-dialog :title="title" :visible.sync="personOpen" width="60%" append-to-body>
      <el-table v-loading="loading" :data="personList">
        <el-table-column label="单位类别" align="center" prop="category" />
        <el-table-column label="机构名称" align="center" prop="name" />
        <el-table-column label="审批顺序" align="center" prop="order" />
        <el-table-column label="监督人员" align="center" prop="person">
          <template slot-scope="scope">
            <el-select v-model="scope.row.person" placeholder="请选择创建期次" clearable size="small">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保存并分配</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
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
  import addForm from "./addForm.vue"
  import childQuery from './childQuery.vue'
  import editAndInfo from './editAndInfo.vue'
  export default {
    name: "Project",
    components: {
      addForm,
      childQuery,
      editAndInfo
    },
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
        // 项目表格数据
        ProjectList: [],
        // 人员分配数据
        personList: [{
          category: "name"
        }, {
          category: "name2"
        }],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 新增弹出层
        addOpen: false,
        // 人员分配弹出层
        personOpen: false,
        // 子项查询弹出层
        childOpen: false,
        // 状态数据字典
        statusOptions: [],
        // 区域
        areaOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          ProjectCode: undefined,
          area: undefined,
          createPeriod: undefined,
          section: undefined,
          projectStatus: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          ProjectName: [{
            required: true,
            message: "项目名称不能为空",
            trigger: "blur"
          }],
          ProjectCode: [{
            required: true,
            message: "项目编码不能为空",
            trigger: "blur"
          }],
          ProjectSort: [{
            required: true,
            message: "项目顺序不能为空",
            trigger: "blur"
          }]
        },
        btnType: ""
      };
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
          this.ProjectList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 项目状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      // 取消按钮
      cancel() {
        this.personOpen = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          ProjectId: undefined,
          ProjectCode: undefined,
          ProjectName: undefined,
          ProjectSort: 0,
          status: "0",
          remark: undefined
        };
        this.resetForm("form");
      },
      //   关闭新增弹框
      closeDialog() {
        this.addOpen = false
      },
      handleClose() {
        this.$refs.child.reset();
        this.closeDialog();
      },
      editAndInfoClose() {
        this.open = false
        this.$refs.editAndInfo.$refs.projectInfo.reset();
        this.$refs.editAndInfo.$refs.dataManagement.resetQuery();
        this.$refs.editAndInfo.$refs.subManagement.resetQuery();
        this.$refs.editAndInfo.$refs.maintainManagement.resetQuery();
        this.$refs.editAndInfo.$refs.investmentManagement.resetQuery();
        this.$refs.editAndInfo.activeName = 'projectInfo'
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ProjectId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.addOpen = true;
        this.title = "添加项目";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.open = true;
        this.title = "编辑项目";
        this.reset();
        this.btnType = "edit";
        // const ProjectId = row.ProjectId || this.ids
        // getProject(ProjectId).then(response => {
        //   this.form = response.data;
        //   this.open = true;
        //   this.title = "修改项目";
        // });
      },
      // 分配按钮操作
      handleDistribution() {
        this.personOpen = true;
        this.title = "人员分配";
      },
      // 下载按钮操作
      handleDownload() {},
      // 详情按钮操作
      handleDetail() {
        this.open = true;
        this.title = "项目详情";
        this.reset();
        this.btnType = "info";
      },
      // 子项查询
      handleChild() {
        this.reset();
        this.childOpen = true;
        this.title = "子项列表";
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.ProjectId != undefined) {
              updateProject(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addProject(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
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
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有项目数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportProject(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      // 导入
      handleImport() {

      }
    }
  };

</script>
