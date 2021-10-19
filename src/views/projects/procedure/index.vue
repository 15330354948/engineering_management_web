<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="工序管理" name="first">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item prop="assessmentCode">
            <el-input
              v-model="queryParams.assessmentCode"
              placeholder="请输入工序名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              @click="handleAdd"
              v-hasPermi="['project:Project:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              @click="handleExport"
              v-hasPermi="['project:Project:export']"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['project:Project:remove']"
            >删除选中</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" border :data="assessmentList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="后规项目名称" align="center" prop="assessmentId" />
          <el-table-column label="工序数" align="center" prop="assessmentCode" />
          <el-table-column label="备注" align="center" prop="assessmentName" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['project:Project:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['project:Project:remove']"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-copy"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['project:Project:edit']"
              >复制</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="规范管理" name="second">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item prop="assessmentCode">
            <el-input
              v-model="queryParams.assessmentCode"
              placeholder="请输入规范名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['project:Project:add']"
            >新增</el-button>
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
            <el-button
              type="primary"
              size="mini"
              @click="handleExport"
              v-hasPermi="['project:Project:export']"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['project:Project:remove']"
            >删除选中</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="assessmentList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="规范名称" align="center" prop="assessmentId" />
          <el-table-column label="规范排序" align="center" prop="assessmentCode" />
          <el-table-column label="步骤数" align="center" prop="assessmentName" />
          <el-table-column label="创建时间" align="center" prop="assessmentSort" />
          <el-table-column label="备注" align="center" prop="assessmentSort" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['project:Project:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['project:Project:remove']"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-copy"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['project:Project:edit']"
              >复制</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加或修改工序对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <editDialog  @closeDialog="closeDialog" :activeName="activeName" ref="son"></editDialog>
    </el-dialog>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listAssessment, getAssessment, delAssessment, exportAssessment } from "@/api/projects/assessment";
import editDialog from "./editDialog.vue"
export default {
  name: "Assessment",
  components:{editDialog},
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
      // 工序表格数据
      assessmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assessmentCode: undefined,
        assessmentName: undefined,
        status: undefined
      },
      activeName:'first',//tab默认选中值
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询工序列表 */
    getList() {
      this.loading = true;
      listAssessment(this.queryParams).then(response => {
        this.assessmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 工序状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // tab切换
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 关闭
    closeDialog(){
      this.open=false;
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
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.$nextTick(()=>{
        this.$refs.son.reset();
      })
      if(this.activeName=='first'){
        this.title = "添加工序";
        this.$nextTick(()=>{
          this.$refs.son.nameList=[]
        })
      }else{
        this.title = "添加规范";
        this.$nextTick(()=>{
          this.$refs.son.operationList=[]
          this.$refs.son.stepList=[]
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.son.reset();
      const assessmentId = row.assessmentId || this.ids
      getAssessment(assessmentId).then(response => {
        this.form = response.data;
        this.open = true;
        if(this.activeName=='first'){
          this.title = "修改工序";
        }else{
          this.title = "修改规范";
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const assessmentIds = row.assessmentId || this.ids;
      this.$confirm('是否确认删除工序编号为"' + assessmentIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAssessment(assessmentIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有工序数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAssessment(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
  }
};
</script>
<style lang="scss" scoped>

</style>