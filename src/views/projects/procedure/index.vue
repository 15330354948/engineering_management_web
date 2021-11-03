<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="工序管理" name="first">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item prop="procedureName">
            <el-input
              v-model="queryParams.procedureName"
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
        <el-table v-loading="loading" border :data="procedureList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="模板名称" align="center" prop="procedureName" />
          <el-table-column label="工序数" align="center" prop="procedureCount" />
          <el-table-column label="备注" align="center" prop="remarks" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row,1)"
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
                @click="handleUpdate(scope.row,2)"
                v-hasPermi="['project:Project:edit']"
              >复制</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="规范管理" name="second">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item prop="standardName">
            <el-input
              v-model="queryParams.standardName"
              placeholder="请输入规范名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button type="primary" @click="resetQuery">重置</el-button>
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
        <el-table v-loading="loading" border :data="standardList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="规范名称" align="center" prop="standardName" />
          <el-table-column label="步骤数" align="center" prop="subStandardCount" />
          <el-table-column label="创建时间" align="center" prop="createTime" />
          <el-table-column label="备注" align="center" prop="remarks" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row,1)"
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
                @click="handleUpdate(scope.row,2)"
                v-hasPermi="['project:Project:edit']"
              >复制</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加或修改工序对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body @close="closeDialog">
      <procedureData v-if="activeName=='first'" @closeDialog="closeDialog" @getList="getList" :procedureId="procedureId" ref="mychild"></procedureData>
      <standardData v-else @closeDialog="closeDialog" @getList="getList" :procedureList="procedureList" :standardId="standardId" ref="mychild"></standardData>
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
import { listProcedure, delProcedure, exportProcedure, listStandard, delStandard, exportStandard } from "@/api/projects/procedure";
import standardData from "./standardData.vue"
import procedureData from "./procedureData.vue"
export default {
  name: "Procedure",
  components:{standardData,procedureData},
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
      procedureList: [],
      // 规范表格数据
      standardList:[],
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
        procedureName: undefined,
        standardName: undefined,
        status: undefined
      },
      activeName:'first',//tab默认选中值
      procedureId:undefined,
      standardId:undefined,
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
      if(this.activeName=='first'){
        listProcedure(this.queryParams).then(response => {
          this.procedureList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }else{
        listStandard(this.queryParams).then(response => {
          this.standardList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
    },
    // 工序状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // tab切换
    handleClick(tab, event) {
      this.resetForm("queryForm");
      this.getList()
    },
    // 关闭
    closeDialog(){
      this.open=false;
      this.$nextTick(()=>{
        this.$refs.mychild.nameIndex=undefined;
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.standardName=undefined;
      this.queryParams.procedureName=undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      if(this.activeName=='first'){
        this.ids = selection.map(item => item.procedureId)
      }else{
        this.ids = selection.map(item => item.standardId)
      }
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.$nextTick(()=>{
        this.$refs.mychild.reset();
      })
      if(this.activeName=='first'){
        this.title = "添加工序";
        this.$nextTick(()=>{
          this.$refs.mychild.nameList=[];
          this.$refs.mychild.isEdit=false;
        })
      }else{
        this.title = "添加规范";
        this.$nextTick(()=>{
          this.$refs.mychild.operationList=[]
          this.$refs.mychild.stepList=[]
          this.$refs.mychild.cqndtProcedureList=[]
          this.$refs.mychild.cqndtSubStandardList=[]
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row,i) {
      this.open = true;
      this.$nextTick(()=>{
        this.$refs.mychild.reset();
      })
      if(this.activeName=='first'){
        this.procedureId = row.procedureId || this.ids
        this.$nextTick(()=>{
          if(i==2){
            this.title = "复制工序";
            this.$refs.mychild.isCopy=true;
          }else{
            this.title = "修改工序";
            this.$refs.mychild.isCopy=false;
          }
          this.$refs.mychild.getProcedure();
          this.$refs.mychild.isEdit=true;
        })
      }else{
        this.standardId = row.standardId || this.ids
        this.$nextTick(()=>{
          if(i==2){
            this.title = "复制规范";
            this.$refs.mychild.isCopy=true;
          }else{
            this.title = "修改规范";
            this.$refs.mychild.isCopy=false;
          }
          this.$refs.mychild.getStandard();
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids,text;
      if(this.activeName=='first'){
        ids = row.procedureId || this.ids;
        text='是否确认删除工序编号为'
      }else{
        ids = row.standardId || this.ids;
        text='是否确认删除规范编号为'
      }
      let that=this;
      this.$confirm(text + ids + '的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          if(that.activeName=='first'){
            return delProcedure(ids);
          }else{
            return delStandard(ids);
          }
        }).then(() => {
          that.getList();
          that.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      let that=this;
      let text;
      if(that.activeName=='first'){
        text='是否确认导出所有工序数据项?';
      }else{
        text='是否确认导出所有规范数据项?'
      }
      this.$confirm(text, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          if(that.activeName=='first'){
            return exportProcedure(queryParams);
          }else{
            return exportStandard(queryParams);
          }
        }).then(response => {
          that.download(response.msg);
        })
    },
  }
};
</script>
<style lang="scss" scoped>

</style>