<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入消息通知标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择通知类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="state">
        <el-select
          v-model="queryParams.state"
          placeholder="请选择发布状态"
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
      <el-form-item prop="publisheRange">
        <el-select
          v-model="queryParams.publisheRange"
          placeholder="请选择发布范围"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in rangeOptions"
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
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dateRange2"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="发布开始日期"
          end-placeholder="发布结束日期"
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
          @click="handleAdd"
          v-hasPermi="['project:Project:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleExport"
          v-hasPermi="['project:Project:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['project:Project:remove']"
          >删除选中</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="noticeList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="消息通知标题" align="center" prop="title" />
      <el-table-column label="通知类型" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column label="发布状态" align="center" prop="state" :formatter="statusFormat"/>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="发布范围" align="center" prop="publisheRange" :formatter="rangeFormat" />
      <el-table-column label="发布人" align="center" prop="publisher" />
      <el-table-column label="发布时间" align="center" prop="publisherTime" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.state==1"
            size="mini"
            type="text"
            icon="el-icon-info"
            @click="handleDetail(scope.row)"
            v-hasPermi="['project:Project:edit']"
            >详情</el-button
          >
          <el-button
            v-if="scope.row.state==0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:Project:edit']"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.state==0"
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="handleSure(scope.row)"
            v-hasPermi="['project:Project:edit']"
            >发送</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:Project:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改通知对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" :disabled="openDetail" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="通知标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入通知标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知类型" prop="type">
              <el-select
                v-model="form.type"
                placeholder="请选择通知类型"
                clearable
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="openDetail">
            <el-form-item label="发布状态" prop="noticeCode">
              <el-select
                v-model="form.type"
                placeholder="请选择通知类型"
                clearable
              >
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="openDetail">
            <el-form-item label="创建时间" prop="noticeCode">
              {{form.createTime}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布范围" prop="publisheRange">
              <el-select
                v-model="form.publisheRange"
                placeholder="请选择发布范围"
                clearable
              >
                <el-option
                  v-for="dict in rangeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
              <el-select
                v-if="form.publisheRange==1"
                v-model="form.companyIds"
                placeholder="请选择发送单位"
                :multiple="true"
                clearable
                style="margin-top:10px"
              >
                <el-option
                  v-for="dict in companyList"
                  :key="dict.deptId"
                  :label="dict.deptName"
                  :value="dict.deptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="openDetail">
            <el-form-item label="发布人" prop="noticeCode">
              {{form.publisher}}
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="openDetail">
            <el-form-item label="发布时间" prop="noticeCode">
              {{form.publisherTime}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发布内容" prop="publisherContent">
              <el-input
                v-model="form.publisherContent"
                type="textarea"
                placeholder="请输入发布内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 发送弹窗 -->
    <el-dialog
      title="发布确认"
      :visible.sync="openSure"
      width="400px"
       
    >
      <el-form :model="formSure" ref="formSure" :rules="rulesSure" label-width="100px">
        <el-form-item label="密码验证" prop="password">
          <el-input
            v-model="formSure.password"
            placeholder="请输入登录密码进行验证"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormSure">发 布</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listNotice,
  getNotice,
  delNotice,
  addNotice,
  updateNotice,
  exportNotice,
  listCompany,
  sendNotice
} from "@/api/warning/notice";

export default {
  name: "Notice",
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
      noticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openSure: false,
      openDetail:false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions:[],
      // 范围数据字典
      rangeOptions:[],
      // 日期范围
      dateRange: [],
      dateRange2: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        type: undefined,
        state: undefined,
      },
      // 表单参数
      form: {},
      formSure: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "通知名称不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择通知类型", trigger: "change" },
        ],
        publisheRange: [
          { required: true, message: "请选择发布范围", trigger: "change" },
        ],
        publisherContent: [
          { required: true, message: "发布内容不能为空", trigger: "blur" },
        ],
      },
      rulesSure: {
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
      companyList:[],//单位列表
    };
  },
  created() {
    this.getList();
    this.getDicts("cqndt_message_type").then((response) => {
      this.typeOptions = response.data;
    });
    this.getDicts("cqndt_message_range").then((response) => {
      this.rangeOptions = response.data;
    });
    this.getDicts("cqndt_message_state").then((response) => {
      this.statusOptions = response.data;
    });
    // 获取单位
    listCompany().then(res=>{
      this.companyList=res.rows
    })
  },
  methods: {
    /** 查询通知列表 */
    getList() {
      this.loading = true;
      listNotice(
        this.addDateRange(this.queryParams, this.dateRange, this.dateRange2)
      ).then((response) => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 通知类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 通知范围字典翻译
    rangeFormat(row, column) {
      return this.selectDictLabel(this.rangeOptions, row.publisheRange);
    },
    // 通知状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.state);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openSure = false;
      this.openDetail = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        noticeId: undefined,
        title: undefined,
        type: undefined,
        publisheRange: undefined,
        publisherContent: undefined,
        remark: undefined,
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
      this.ids = selection.map((item) => item.messageId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.openDetail = false;
      this.title = "添加通知";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const noticeId = row.messageId || this.ids;
      getNotice(noticeId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改通知";
      });
    },
    // 详情
    handleDetail(row){
      const noticeId = row.messageId || this.ids;
      getNotice(noticeId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.openDetail = true;
        this.title = "通知详情";
      });
    },
    // 发送
    handleSure(row) {
      this.openSure = true;
      this.formSure.messageId=row.messageId;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.messageId != undefined) {
            updateNotice(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNotice(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 发布按钮
    submitFormSure() {
      this.$refs["formSure"].validate((valid) => {
        if (valid) {
          sendNotice(this.formSure).then((response) => {
            this.msgSuccess("发布成功");
            this.openSure = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const noticeIds = row.messageId || this.ids;
      this.$confirm(
        '是否确认删除通知编号为"' + noticeIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delNotice(noticeIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
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
          return exportNotice(queryParams);
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