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
        <el-form :model="queryParams" ref="queryParams" :inline="true" label-width="85px">
          <el-form-item prop="pointName">
            <el-input v-model="queryParams.pointName" placeholder="请输入资料名称" clearable size="small" />
          </el-form-item>
          <el-form-item prop="time">
            <el-date-picker v-model="queryParams.time" type="datetimerange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
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
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['project:Project:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row)"
                v-hasPermi="['project:Project:edit']">详情</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                v-hasPermi="['project:Project:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
          @pagination="getList" />
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="资料名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入资料名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资料类型" prop="type">
              <el-input v-model="form.type" placeholder="请输入资料类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附件" prop="enclosure">
              <el-upload class="upload-demo" :action="upload.url" :headers="upload.headers" :on-preview="handlePreview"
                :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" clearable size="small" />
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
  import {
    getToken
  } from '@/utils/auth'
  export default {
    data() {
      return {
        queryParams: {},
        form: {},
        rules: {
          name: [{
            required: true,
            message: "资料名称不能为空",
            trigger: "blur"
          }],
          type: [{
            required: true,
            message: "资料类型不能为空",
            trigger: "blur"
          }],
          enclosure: [{
            required: true,
            message: "请选择附件",
            trigger: "blur"
          }],
        },
        dataList: [{
          ProjectId: "测试"
        }],
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        loading: false,
        ids: "",
        title: "",
        open: false,
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 设置上传的请求头部
          headers: {
            Authorization: "Bearer " + getToken()
          },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/upload",
        },
        fileList: []
      }
    },
    methods: {
      getList() {},
      handleQuery() {},
      resetQuery() {
        this.resetForm("queryParams");
        this.handleQuery();
      },
      download() {},
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ProjectId)
      },
      handleUpdate() {
        this.open = true;
        this.title = "资料修改"
      },
      handleDetail() {},
      handleDelete() {},
      submitForm() {},
      cancel() {
        this.open = false;
      }

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

  .el-icon-refresh {
    cursor: pointer;
  }

  /deep/.el-textarea__inner {
    resize: none;
    display: block;
    line-height: 1.5;
    min-height: 75px;
    height: 75px;
  }

</style>
