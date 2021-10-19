<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="assessmentName">
        <el-input v-model="queryParams.assessmentName" placeholder="请输入考核模板名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['project:Project:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['project:Project:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleExport" v-hasPermi="['project:Project:export']">导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['project:Project:remove']">删除选中</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="assessmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="考核名称" align="center" prop="assessmentName" />
      <el-table-column label="考核模板类型" align="center" prop="type" />
      <el-table-column label="考核项" align="center" prop="num" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['project:Project:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['project:Project:remove']">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-document-copy" @click="handleUpdate(scope.row)"
            v-hasPermi="['project:Project:edit']">复制</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改考核对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="考核模板名称" prop="assessmentName">
          <el-input v-model="form.assessmentName" placeholder="请输入考核模板名称" />
        </el-form-item>
        <el-form-item label="考核模板类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择考核模板类型" clearable>
            <el-option v-for="dict in assessOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="考核项">
          <el-button size="medium" type="text" @click="handleAddAssessment">添加项</el-button>
          <el-table :data="form.subAssessments">
            <el-table-column align="center" prop="assessmentId">
              <template slot="header">
                <span style="color:red">* </span>
                <span>序号</span>
              </template>
              <template slot-scope="scope">
                <el-input type="number" v-model="form.subAssessments[scope.$index].sort" placeholder="请输入序号" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="assessmentId">
              <template slot="header">
                <span style="color:red">* </span>
                <span>考核项目名称</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="form.subAssessments[scope.$index].subAssessmentName" placeholder="请输入考核项目名称" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="assessmentId">
              <template slot="header">
                <span style="color:red">* </span>
                <span>项目分数</span>
              </template>
              <template slot-scope="scope">
                <el-input type="number" v-model="form.subAssessments[scope.$index].fraction"
                  placeholder="请输入项目分数" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="assessmentId">
              <template slot="header">
                <span style="color:red">* </span>
                <span>评价标准</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="form.subAssessments[scope.$index].standard" placeholder="请输入评价标准" />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-delete"
                  @click="handleDeleteAssessment(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listAssessment,
    getAssessment,
    delAssessment,
    addAssessment,
    updateAssessment,
    exportAssessment
  } from "@/api/projects/assessment";

  export default {
    name: "Assessment",
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
        // 考核表格数据
        assessmentList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态数据字典
        statusOptions: [],
        // 考核模板类型
        assessOptions:[],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          assessmentName: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          assessmentName: [{
            required: true,
            message: "考核名称不能为空",
            trigger: "blur"
          }],
          type: [{
            required: true,
            message: "请选择考核模板类型",
            trigger: "change"
          }],
          assessmentSort: [{
            required: true,
            message: "考核顺序不能为空",
            trigger: "blur"
          }]
        },
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("cqndt_assessment_type").then(response => {
        this.assessOptions = response.data;
      });
    },
    methods: {
      /** 查询考核列表 */
      getList() {
        this.loading = true;
        listAssessment(this.queryParams).then(response => {
          this.assessmentList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 考核状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          assessmentId: undefined,
          assessmentName: undefined,
          type: undefined,
          subAssessments: [],
          remarks: undefined
        };
        this.resetForm("form");
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
        this.ids = selection.map(item => item.assessmentId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加考核";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const assessmentId = row.assessmentId || this.ids
        getAssessment(assessmentId).then(response => {
          this.form = response.data;
          console.log(this.form);
          this.open = true;
          this.title = "修改考核";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.subAssessments.length > 0) {
              this.form.num = this.form.subAssessments.length;
              this.form.subAssessments.forEach(item => {
                if (!item.sort) {
                  this.msgError("排序不能为空")
                } else if (!item.subAssessmentName) {
                  this.msgError("考核名称不能为空")
                } else if (!item.fraction) {
                  this.msgError("项目分数不能为空")
                } else if (!item.standard) {
                  this.msgError("评价标准不能为空")
                } else {
                  if (this.form.assessmentId != undefined) {
                    updateAssessment(this.form).then(response => {
                      this.msgSuccess("修改成功");
                      this.open = false;
                      this.getList();
                    });
                  } else {
                    addAssessment(this.form).then(response => {
                      this.msgSuccess("新增成功");
                      this.open = false;
                      this.getList();
                    });
                  }
                }
              });
            } else {
              console.log(7)
              this.msgError("请添加考核项")
            }
          }
        });
      },
      // 新增考核模板-考核项目新增按钮
      handleAddAssessment() {
        console.log(77)
        console.log(this.form);
        this.form.subAssessments.push({
          sort: this.form.subAssessments.length + 1,
          subAssessmentName: '',
          fraction: '',
          standard: ''
        })
      },
      // 新增规范-所属工序删除按钮
      handleDeleteAssessment(index, row, ) {
        this.form.subAssessments.splice(index)
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const assessmentIds = row.assessmentId || this.ids;
        this.$confirm('是否确认删除考核编号为"' + assessmentIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delAssessment(assessmentIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有考核数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportAssessment(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
    }
  };

</script>
<style lang="scss" scoped>
  .el-select {
    width: 100%;
  }

</style>
