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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改工序对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form v-if="activeName=='first'" ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="工序管理名称" prop="assessmentName">
          <el-input v-model="form.assessmentName" placeholder="请输入工序管理名称" />
        </el-form-item>
        <el-form-item label="工序">
          <el-row>
            <el-col :span="8" style="padding-right:5px">
              <div class="left-content">
                <div class="title">工序名称
                  <i class="el-icon-plus" @click="handleAddProcess"></i>
                </div>
                <div class="container">
                  <div class="item" @click="handleItem(index)" v-for="(item,index) in nameList" :key="index" :class="nameIndex==index?'activeItem':''">
                    <span>{{item}}</span>
                    <div class="item-operation">
                      <i class="el-icon-edit-outline" @click="handleUpdateProcess(index)"></i>
                      <i class="el-icon-delete-solid" @click="handleDelteProcess(index)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="16" style="padding-left:5px">
              <div class="right-content">
                <div class="title">配置</div>
                <el-form class="config-form" ref="configForm" :model="configForm" :rules="configRules" label-width="120px">
                  <el-form-item label="工序名称" prop="assessmentName">
                    <el-input v-model="configForm.assessmentName" placeholder="请选择左侧名称" />
                  </el-form-item>
                  <el-form-item label="工序类型" prop="type">
                    <el-select v-model="configForm.type" placeholder="请选择工序类型类型" clearable size="small">
                      <el-option
                        v-for="dict in statusOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="参与审核权限" prop="status">
                    <el-select v-model="configForm.status" :multiple="true" placeholder="请选择参与审核权限" clearable>
                      <el-option
                        v-for="dict in statusOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="考核评分权限" prop="value1">
                    <el-col :span="4">
                      <el-switch v-model="configForm.value1"></el-switch>
                    </el-col>
                    <el-col :span="20">
                      <el-select v-model="configForm.statuss" disabled placeholder="请选择考核评分权限" clearable>
                        <el-option
                          v-for="dict in statusOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="dict.dictValue"
                        />
                      </el-select>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="操作指南">
                    <el-col :span="4">
                      <el-switch v-model="configForm.value1"></el-switch>
                    </el-col>
                    <el-col :span="20">
                      <el-upload
                      ref="upload"
                      class="upload-demo"
                      :headers="upload.headers"
                      :action="upload.url + '?updateSupport=' + upload.updateSupport"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      :on-progress="handleFileUploadProgress"
                      :on-success="handleFileSuccess"
                      multiple
                      :limit="1"
                      :file-list="fileList">
                      <el-button size="small" type="text">上传附件</el-button>
                    </el-upload>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="安全规范">
                    <el-col :span="4">
                      <el-switch v-model="configForm.value1"></el-switch>
                    </el-col>
                    <el-col :span="20">
                      <el-upload
                      ref="upload"
                      class="upload-demo"
                      :headers="upload.headers"
                      :action="upload.url + '?updateSupport=' + upload.updateSupport"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      :on-progress="handleFileUploadProgress"
                      :on-success="handleFileSuccess"
                      multiple
                      :limit="1"
                      :file-list="fileList">
                      <el-button size="small" type="text">上传附件</el-button>
                    </el-upload>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="物料清单">
                    <el-col :span="4">
                      <el-switch v-model="configForm.value1"></el-switch>
                    </el-col>
                    <el-col :span="20">
                      <el-upload
                      ref="upload"
                      class="upload-demo"
                      :headers="upload.headers"
                      :action="upload.url + '?updateSupport=' + upload.updateSupport"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      :on-progress="handleFileUploadProgress"
                      :on-success="handleFileSuccess"
                      multiple
                      :limit="1"
                      :file-list="fileList">
                      <el-button size="small" type="text">上传附件</el-button>
                    </el-upload>
                    </el-col>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <el-form v-else ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="规范名称" prop="assessmentName">
          <el-input v-model="form.assessmentName" placeholder="请输入规范名称" />
        </el-form-item>
        <el-form-item label="规范排序" prop="assessmentName">
          <el-input v-model="form.assessmentName" placeholder="请输入规范排序" />
        </el-form-item>
        <el-form-item label="关联设备类型" prop="assessmentName">
          <el-select v-model="configForm.type" placeholder="请选择关联设备类型" clearable>
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属工序">
          <el-button size="medium" type="text" @click="handleAddOperation(1)">新增</el-button>
          <el-table :data="operationList">
            <el-table-column align="center" prop="assessmentId">
              <template slot="header">
                <span style="color:red">*  </span>
                <span>工序模板</span>
              </template>
              <template slot-scope="scope">
                <el-select v-model="operationList[scope.$index].a" @change="handleOperation(1)" placeholder="请选择工序模板" clearable>
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="assessmentId">
              <template slot="header">
                <span style="color:red">*  </span>
                <span>工序</span>
              </template>
              <template slot-scope="scope">
                <el-select :disabled="operationList[scope.$index].a ? false : true" v-model="operationList[scope.$index].b" placeholder="请选择工序" clearable>
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteOperation(scope.$index,scope.row,1)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="步骤">
          <el-button size="medium" type="text" @click="handleAddOperation(2)">添加步骤</el-button>
          <el-table :data="stepList">
            <el-table-column align="center" prop="assessmentId" >
              <template slot="header">
                <span style="color:red">*  </span>
                <span>序号</span>
              </template>
              <template slot-scope="scope">
                <el-input type="number" v-model="stepList[scope.$index].a" placeholder="请输入序号" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="assessmentId">
              <template slot="header">
                <span style="color:red">*  </span>
                <span>步骤名称</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="stepList[scope.$index].b" placeholder="请输入步骤名称" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="assessmentId">
              <template slot="header">
                <span style="color:red">*  </span>
                <span>规范要求</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="stepList[scope.$index].c" placeholder="请输入规范要求" />
              </template>
            </el-table-column>
            <el-table-column label="示例图片" align="center" prop="assessmentId">
              <template slot-scope="scope">
                <el-upload
                class="avatar-uploader"
                :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport"
                :show-file-list="false"
                :on-success="function(res,file){return handleAvatarSuccess(res,file,scope.$index)}"
                :before-upload="beforeAvatarUpload">
                <img v-if="stepList[scope.$index].url" :src="stepList[scope.$index].url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteOperation(scope.$index,scope.row,2)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 工序名称弹窗 -->
    <el-dialog title="工序名称" :visible.sync="processOpen" width="400px" append-to-body>
      <el-form ref="processForm" :model="processForm" :rules="processRules" label-width="90px">
        <el-form-item label="工序名称" prop="assessmentName">
          <el-input v-model="processForm.assessmentName" placeholder="请输入工序名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitProcessForm">确 定</el-button>
        <el-button @click="cancelProcess">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAssessment, getAssessment, delAssessment, addAssessment, updateAssessment, exportAssessment } from "@/api/projects/assessment";
import { getToken } from "@/utils/auth";
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
      // 工序表格数据
      assessmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      processOpen:false,//工序名称弹出层
      // 状态数据字典
      statusOptions: [],
      // 上传附件参数
      upload: {
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      fileList:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assessmentCode: undefined,
        assessmentName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        assessmentName: [
          { required: true, message: "工序管理名称不能为空", trigger: "blur" }
        ],
        assessmentCode: [
          { required: true, message: "工序编码不能为空", trigger: "blur" }
        ],
        assessmentSort: [
          { required: true, message: "工序顺序不能为空", trigger: "blur" }
        ]
      },
      // 工序名称表单校验
      processRules: {
        assessmentName: [
          { required: true, message: "工序名称不能为空", trigger: "blur" }
        ],
      },
      activeName:'first',//tab默认选中值
      processForm:{},//工序名称表单
      nameList:[],//工序名称列表
      nameIndex:0,//编辑工序名称index
      isEditProcess:false,
      configForm:{},//配置表单
      // 工序名称表单校验
      configRules: {
        assessmentName: [
          { required: true, message: "工序名称不能为空", trigger: "blur" }
        ],
      },
      operationList:[],//所属工序
      stepList:[],//步骤
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        assessmentId: undefined,
        assessmentCode: undefined,
        assessmentName: undefined,
        assessmentSort: 0,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
      this.resetForm("processForm");
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
      this.reset();
      this.open = true;
      this.operationList=[];
      this.stepList=[];
      if(this.activeName=='first'){
        this.title = "添加工序";
      }else{
        this.title = "添加规范";
      }
    },
    // 取消按钮
    cancelProcess() {
      this.processOpen = false;
      this.reset();
    },
    // 新增工序名称
    handleAddProcess(){
      this.reset();
      this.processOpen=true;
    },
    // 修改工序名称
    handleUpdateProcess(index){
      this.reset();
      this.nameIndex=index;
      this.isEditProcess=true;
      this.processOpen=true;
      this.processForm.assessmentName=this.nameList[index];
    },
    // 删除工序名称
    handleDelteProcess (index){
      this.nameList.splice(index)
    },
    // 工序选择
    handleItem(index){
      this.nameIndex=index;
    },
    // 工序名称提交
    submitProcessForm(){
      this.$refs["processForm"].validate(valid => {
        if (valid) {
          if(this.isEditProcess){
            this.nameList[this.nameIndex]=this.processForm.assessmentName;
          }else{
            this.nameList.push(this.processForm.assessmentName);
            this.isEditProcess=false;
          }
          this.processOpen=false;
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
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
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
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
    },
    // 新增规范-所属工序新增按钮
    handleAddOperation(i){
      if(i==1){
        this.operationList.push({a:'',b:''});
      }else{
        this.stepList.push({a:this.stepList.length+1,b:'',c:'',url:''})
      }
    },
    // 新增规范-所属工序删除按钮
    handleDeleteOperation(index,row,i){
      if(i==1){
        this.operationList.splice(index);
      }else{
        this.stepList.splice(index)
      }
    },
    // 新增规范-所属工序-工序模板切换
    handleOperation(i){
      if(i==1){

      }
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
    handleAvatarSuccess(res, file,index) {
      console.log(res,file,index,99)
      this.stepList[index].url = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return  isLt2M;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  }
};
</script>
<style lang="scss" scoped>
.left-content .title,.right-content .title{
  background: #f2f2f2;
  height: 40px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid #e4e4e4;
  i{
    font-weight: 700;
    cursor: pointer;
  }
}
.left-content,.right-content{
  border: 1px solid #e4e4e4;
  min-height: 440px;
}
.left-content{
  .container{
    height: 400px;
    overflow-y: auto;
    .item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      i{
        margin: 0 5px;
        display: none;
        cursor: pointer;
      }
    }
    .item:hover i{
      display: inline-block;
    }
    .activeItem,.item:hover{
      background: #f2f2f2;
    }
  }
}
.right-content{
  .config-form{
    padding: 10px 20px;
  }
}
.el-form-item .el-form-item{
  margin-bottom: 22px;
}
.el-select{
  width: 100%;
}
/deep/.avatar-uploader .el-upload {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>