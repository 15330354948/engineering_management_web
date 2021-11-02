<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="projectCode">
        <el-input v-model="queryParams.projectCode" placeholder="请输入项目编号/名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item prop="area">
        <el-cascader v-model="queryParams.area" placeholder="请选择区域" :props="{checkStrictly: true, value: 'id'}"
          :options="areaOptions" @keyup.enter.native="handleQuery" clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item prop="period">
        <el-select v-model="queryParams.period" placeholder="请选择创建期次" clearable size="small"
          @keyup.enter.native="handleQuery">
          <el-option v-for="dict in periodOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item prop="bidSection">
        <el-select v-model="queryParams.bidSection" placeholder="请选择所属标段" clearable size="small"
          @keyup.enter.native="handleQuery">
          <el-option v-for="dict in bidSectionOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item prop="projectType">
        <el-select v-model="queryParams.projectType" placeholder="请选择项目状态" clearable size="small"
          @keyup.enter.native="handleQuery">
          <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel"
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
        <el-button type="primary" @click="handleAdd" v-hasPermi="['project:Project:add']">新增</el-button>
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
        <el-button type="primary" :disabled="multiple" @click="handleDelete" v-hasPermi="['project:Project:remove']">
          删除选中</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="handleChild" v-hasPermi="['project:Project:export']">子项查询
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" @click="handleRecycle">回收站
        </el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" border :data="ProjectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="项目编号" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="项目地址" align="center" prop="projectAddress">
        <template slot-scope="scope">
          {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}{{scope.row.projectAddress}}
        </template>
      </el-table-column>
      <el-table-column label="建设期次" align="center" prop="period" :formatter="periodFormat" />
      <el-table-column label="所属标段" align="center" prop="bidSection" :formatter="bidSectionFormat" />
      <el-table-column label="项目状态" align="center" prop="projectType" :formatter="typeFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-tools" @click="handleDistribution(scope.row)"
            v-hasPermi="['project:Project:edit']">分配</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['project:Project:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row)"
            v-hasPermi="['project:Project:edit']">详情</el-button>
          <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
            <div class="avatar-wrapper">
              <el-button size="mini" type="text" icon="el-icon-more">更多</el-button>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleDownload(scope.row)">
                <span>下载</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="exportProgress(scope.row)">
                <span>导出进度</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="QRcode(scope.row)">
                <span>二维码下载</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="handleDelete(scope.row)">
                <span>删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加项目对话框 -->
    <el-dialog :title="title" :visible.sync="addOpen" v-if="addOpen" width="70%" append-to-body
      :before-close="handleClose">
      <addForm @closeDialog="closeDialog" :companyType="companyType" ref="child"></addForm>
    </el-dialog>

    <!-- 子项查询对话框 -->
    <el-dialog :title="title" :visible.sync="childOpen" width="70%" append-to-body>
      <subManagement :btnType="btnType" :projectData="projectData" ref="subManagement"></subManagement>
      <!-- <childQuery></childQuery> -->
    </el-dialog>

    <!-- 修改或详情 -->
    <el-dialog :title="title" :visible.sync="open" v-if="open" width="70%" append-to-body
      :before-close="editAndInfoClose">
      <editAndInfo @closeDialog="closeDialog" :projectData="projectData" :btnType="btnType" ref="editAndInfo">
      </editAndInfo>
    </el-dialog>

    <!-- 人员分配 -->
    <el-dialog :title="title" :visible.sync="personOpen" width="60%" append-to-body>
      <el-table v-loading="loading" border :data="personList">
        <el-table-column label="单位类别" align="center" prop="category" />
        <el-table-column label="机构名称" align="center" prop="name" />
        <el-table-column label="审批顺序" align="center" prop="order" />
        <el-table-column label="监督人员" align="center" prop="person">
          <template slot-scope="scope">
            <el-select v-model="scope.row.person" placeholder="请选择创建期次" multiple clearable size="small">
              <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel"
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

    <el-dialog :title="title" :visible.sync="recycleOpen" width="80%" append-to-body>
      <recycle></recycle>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
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
    exportProject,
    getArea
  } from "@/api/projects/project";
  import addForm from "./addForm.vue"
  // import childQuery from './childQuery.vue'
  import editAndInfo from './editAndInfo.vue'
  import subManagement from './tabsBar/subManagement.vue'
  import recycle from './recycle.vue'
  import {
    getToken
  } from "@/utils/auth";
  export default {
    name: "Project",
    components: {
      addForm,
      // childQuery,
      editAndInfo,
      subManagement,
      recycle
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
        // 回收站弹出层
        recycleOpen: false,
        // 项目状态数据字典
        typeOptions: [],
        // 创建期次
        periodOptions: [],
        // 所属标段
        bidSectionOptions: [],
        // 区域
        areaOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          projectCode: undefined,
          area: undefined,
          period: undefined,
          bidSection: undefined,
          projectType: undefined
        },
        // 项目导入参数
        upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {
            Authorization: "Bearer " + getToken()
          },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/system/user/importData"
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          projectName: [{
            required: true,
            message: "项目名称不能为空",
            trigger: "blur"
          }],
          projectCode: [{
            required: true,
            message: "项目编码不能为空",
            trigger: "blur"
          }],
          projectSort: [{
            required: true,
            message: "项目顺序不能为空",
            trigger: "blur"
          }]
        },
        // 公司类型
        companyType: [],
        btnType: "",
        projectData: {}
      };
    },
    created() {
      this.getList();
      this.getDicts("cqndt_project_type").then(response => {
        this.typeOptions = response.data;
      });
      this.getDicts("cqndt_period").then(response => {
        this.periodOptions = response.data;
      });
      this.getDicts("cqndt_bid_section").then(response => {
        this.bidSectionOptions = response.data;
      });
      this.getAreaList();
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
      getAreaList() {
        getArea().then(res => {
          this.areaOptions = res.data;
        });
      },
      // 项目状态字典翻译
      typeFormat(row, column) {
        return this.selectDictLabel(this.typeOptions, row.projectType);
      },
      periodFormat(row, column) {
        return this.selectDictLabel(this.periodOptions, row.period);
      },
      bidSectionFormat(row, column) {
        return this.selectDictLabel(this.bidSectionOptions, row.bidSection);
      },
      // 取消按钮
      cancel() {
        this.personOpen = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          projectId: undefined,
          projectCode: undefined,
          projectName: undefined,
          projectSort: 0,
          type: "0",
          remark: undefined
        };
        this.resetForm("form");
      },
      //   关闭新增弹框
      closeDialog() {
        this.addOpen = false;
        this.open = false;
        this.getList();
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
        if (this.queryParams.area) {
          this.$set(this.queryParams, 'provinceCode', this.queryParams.area[0])
          this.$set(this.queryParams, 'cityCode', this.queryParams.area[1])
          this.$set(this.queryParams, 'countyCode', this.queryParams.area[2])
        }
        delete this.queryParams.area
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          projectCode: undefined,
          area: undefined,
          period: undefined,
          bidSection: undefined,
          projectType: undefined
        }
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.projectId)
        this.single = selection.length != 1
        this.multiple = !selection.length
        
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.getDicts("cqndt_company_type").then(response => {
          // console.log(response);
          this.companyType = response.data
          this.$set(this.companyType[0], 'disabled', true)
          this.addOpen = true;
        });
        this.title = "添加项目";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.projectData = row
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
      // 二维码下载
      QRcode(row) {
        this.$message('二维码功能开发中');
      },
      // 导出进度
      exportProgress(row) {
        this.msgSuccess("导出进度");
      },
      // 下载按钮操作
      handleDownload(row) {
        console.log(row);
        this.msgSuccess("下载");
      },
      // 详情按钮操作
      handleDetail(row) {
        this.projectData = row
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
        this.btnType = "info";
      },
      // 回收站
      handleRecycle() {
        this.recycleOpen = true;
        this.title = '回收站'
        // this.msgSuccess("回收站");
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
        const projectId = row.projectId || this.ids;
        this.$confirm('是否确认删除项目编号为"' + projectId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delProject(projectId);
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
        this.upload.title = "项目导入";
        this.upload.open = true;
      },
      submitFileForm() {
        this.$refs.upload.submit();
      },
      /** 下载模板操作 */
      importTemplate() {
        // importTemplate().then(response => {
        //   this.download(response.msg);
        // });
      },
      // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    }
  };

</script>

<style lang="scss" scoped>
  .el-table .fixed-width .el-button--mini {
    margin-left: 10px;
  }

</style>
