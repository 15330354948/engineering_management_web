<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item prop="configCode">
        <el-input
          v-model="queryParams.configCode"
          placeholder="请输入预警提醒名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择类型"
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
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="configList"
    >
      <el-table-column label="预警提醒名称" align="center" prop="configId" />
      <el-table-column label="类型" align="center" prop="configCode" />
      <el-table-column label="站内" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="!configList[scope.$index].edit">{{scope.row.remark}}开启</span>
          <el-switch v-else v-model="form.value1"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="短信" align="center" prop="configSort">
        <template slot-scope="scope">
          <span v-if="!configList[scope.$index].edit">{{scope.row.remark}}开启</span>
          <el-switch v-else v-model="form.value2"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="模板" align="center" prop="configSort">
        <template slot-scope="scope">
          <span v-if="!configList[scope.$index].edit">短信模板</span>
          <span v-else style="color:#409eff;cursor:pointer;" @click="handleMould(scope.row)">短信模板</span>
        </template>
      </el-table-column>
      <el-table-column label="发送范围" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="!configList[scope.$index].edit">{{scope.row.remark}}开启</span>
          <el-select v-else
            v-model="form.value3"
            placeholder="请选择发送发文"
            clearable
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </template>
      </el-table-column>
       <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div v-if="!configList[scope.$index].edit">
            <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.$index,scope.row)"
            v-hasPermi="['project:Project:edit']"
            >修改</el-button
          >
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-check"
              @click="handleSave(scope.$index,scope.row)"
              v-hasPermi="['project:Project:edit']"
              >保存</el-button
            >
            <el-button
            size="mini"
            type="text"
            icon="el-icon-close"
            @click="handleCancel(scope.$index,scope.row)"
            v-hasPermi="['project:Project:edit']"
            >取消</el-button
          >
          </div>
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
    <!-- 模板配置对话框 -->
    <el-dialog
      title="模板配置"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="通用条件">
              <el-button @click="handleAddName">项目名称</el-button>
              <el-button @click="handleAddDay">天数</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="站内模板">
              <div class="content-editor" contenteditable="true" @click="getPos" v-html="innerHTML">
                {{innerHTML}}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="短信模板">
              <div class="content-editor" contenteditable="true" @click="getPos" v-html="innerHTML">
                {{innerHTML}}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listConfig,getConfig,updateConfig} from "@/api/warning/config";

export default {
  name: "config",
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
      // 预警配置表格数据
      configList: [],
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
        configCode: undefined,
        configName: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        configName: [
          { required: true, config: "预警配置名称不能为空", trigger: "blur" },
        ],
        configCode: [
          { required: true, config: "预警配置编码不能为空", trigger: "blur" },
        ],
        configSort: [
          { required: true, config: "预警配置顺序不能为空", trigger: "blur" },
        ],
      },
      range:null,
      innerHTML:'【<div class="insert-tag" contenteditable="false">项目名称<i class="close el-icon-error" @click="delElClose"></i></div>】已经逾期【<div class="insert-tag" data-type="${days}" contenteditable="false">天数<i class="close el-icon-error" data-parent="normal" onclick="delElClose()"></i></div>】，请注意施工进度'
    };
  },
  mounted(){
    window.delElClose=this.delElClose
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 项目名称点击
    handleAddName(){
      if(this.range){
        var span = document.createElement('span');
        span.innerHTML='<div class="insert-tag" contenteditable="false">项目名称<i class="close el-icon-error" data-parent="normal" onclick="delElClose(this)"></i></div>'
        this.range.insertNode(span);//在焦点插入节点
      }
    },
    // 天数点击
    handleAddDay(){
      if(this.range){
        var span = document.createElement('span');
        span.innerHTML='<div class="insert-tag" contenteditable="false">天数<i class="close el-icon-error" data-parent="normal" onclick="delElClose(this)"></i></div>'
        this.range.insertNode(span);//在焦点插入节点
      }
    },
    //找到焦点位置
    getPos(event){
      this.range = window.getSelection().getRangeAt(0);
      let a=event.currentTarget.innerHTML.replace(/项目名称/g,'${projectName}').replace(/天数/g,'${day}').replace(/<.*?>/ig,"")
      console.log(a)
    },
    // 删除
    delElClose(){
      let e=window.event || arguments.callee.caller.arguments[0];
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);//删除父节点
    },
    /** 查询预警配置列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then((response) => {
        this.configList = response.rows;
        this.configList.forEach(item=>{
          item.edit=false;
        })
        this.total = response.total;
        this.loading = false;
      });
    },
    // 预警配置状态字典翻译
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
        configId: undefined,
        configCode: undefined,
        configName: undefined,
        configSort: 0,
        status: "0",
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
    // 模板短信按钮
    handleMould(row){
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(index,row) {
      if(this.configList.findIndex(e=>e.edit===true)==-1){
        this.configList[index].edit=true;
        this.$set(this.configList,index,this.configList[index]);
      }else{
        this.msgError("请先保存或取消正在修改的预警提示");
      }
      this.reset();
    },
    /** 提交按钮 */
    submitForm: function () {
      this.open=false;
    },
    // 保存
    handleSave(index,row){
      this.form.id=row.id;
      updateConfig(this.form).then((response) => {
        this.msgSuccess("修改成功");
        this.configList[index].edit=false;
        this.$set(this.configList,index,this.configList[index]);
        this.getList();
      });
    },
    // 取消
    handleCancel(index,row){
      this.configList[index].edit=false;
      this.$set(this.configList,index,this.configList[index]);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.content-editor{
  height: 240px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  line-height: 24px;
  /deep/.insert-tag {
    display: inline-block;
    margin: 0 4px;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    .close {
      color: #e84335;
      margin-left: 4px;
      cursor: pointer;
    }
  }
}
</style>