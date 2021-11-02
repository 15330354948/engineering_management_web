<template>
  <div class="content">
    <el-row :gutter="24">
      <el-col :span="5">
        <div class="left-content">
          <div class="header">
            <span>资料类型</span>
            <span class="el-icon-refresh" @click="refresh"></span>
          </div>

          <div class="container">
            <div class="item" @click="handleItem(item,index)" v-for="(item,index) in nameList" :key="index"
              :class="nameIndex==index?'activeItem':''">
              <span>{{item.dictLabel}}</span>
              <!-- <div class="item-operation">
                <i class="el-icon-edit-outline" @click="handleUpdateProcess(index)"></i>
                <i class="el-icon-delete-solid" @click="handleDelteProcess(index)"></i>
              </div> -->
            </div>
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
            <el-button type="primary" @click="handleAdd">创建</el-button>
            <el-button type="primary" @click="download">下载</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" border :data="dataList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="项目编号" align="center" prop="projectId" />
          <el-table-column label="资料名称" align="center" prop="dataFileName" />
          <el-table-column label="上传人" align="center" prop="createUser" />
          <el-table-column label="日期" align="center" prop="createTime" />
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['project:Project:edit']" v-if="btnType=='edit'">修改</el-button>
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

    <el-dialog :title="title" :visible.sync="open" width="25%" v-if="open" append-to-body :before-close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="资料名称" prop="dataFileName">
              <el-input v-model="form.dataFileName" placeholder="请输入资料名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资料类型" prop="dataFileType">
              <el-select v-model="form.dataFileType" placeholder="请选择资料类型" clearable size="small" style="width:100%"
                disabled>
                <el-option v-for="dict in nameList" :key="dict.dictValue" :label="dict.dictLabel"
                  :value="dict.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="fileId">
              <el-upload class="upload-demo" v-model="form.fileId" :action="upload.url" :headers="upload.headers"
                :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove"
                :on-success="handleSuccess" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
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
  } from '@/utils/auth';
  import {
    listDataFile,
    addDataFile,
    eidtDataFile,
    infoDataFile,
    getFIleInfo,
    delDataFile
  } from "@/api/projects/project";
  export default {
    props: ["projectData","btnType"],
    watch: {
      projectData: {
        immediate: true,
        handler(val) {

        }
      }
    },
    data() {
      return {
        queryParams: {},
        form: {
          fileId: ""
        },
        rules: {
          dataFileName: [{
            required: true,
            message: "资料名称不能为空",
            trigger: "blur"
          }],
          dataFileType: [{
            required: true,
            message: "资料类型不能为空",
            trigger: "blur"
          }],
          fileId: [{
            required: true,
            message: "请选择附件",
            trigger: "blur"
          }],
        },
        dataList: [],
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
        fileList: [],
        nameList: [], //资料文件列表
        nameIndex: 0, //编辑资料文件名称index
        dataFileId: undefined
      }
    },
    created() {
      this.getDicts("cqndt_file_type").then(response => {
        this.nameList = response.data;
        this.dataFileId = response.data[0].dictValue
        this.form.dataFileType = this.dataFileId
        this.getList();
      });

    },
    methods: {
      getList() {
        this.loading = true;
        listDataFile(
          Object.assign(this.queryParams, {
            dataFileId: this.dataFileId
          })).then(res => {
          this.loading = false;
          this.total = res.total;
          this.dataList = res.rows
        })
      },
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      resetQuery() {
        this.resetForm("queryParams");
        this.handleQuery();
      },
      download() {},
      handleRemove(file, fileList) {
        if (!Array.isArray(this.form.fileId)) {
          this.form.fileId = this.form.fileId.split(",");
        }
        let fileId = file.fileId || file.response.data.fileId
        console.log(fileId);
        let index = this.form.fileId.indexOf(fileId)
        this.form.fileId.splice(index, 1)
        this.form.fileId = this.form.fileId.join(',')
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        console.log(files);
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleSuccess(res, file) {
        if (this.form.fileId == "") {
          this.form.fileId = [];
          this.form.fileId.push(res.data.fileId)
          this.form.fileId = this.form.fileId.join(',')
        } else {
          this.form.fileId = this.form.fileId.split(",")
          this.form.fileId.push(res.data.fileId)
          this.form.fileId = this.form.fileId.join(',')
        }
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.dataFileId)
      },
      handleUpdate(row) {
        this.fileList = [];
        infoDataFile(row.dataFileId).then(res => {
          getFIleInfo(res.data.fileId).then(res => {
            this.fileList = res.data;
            this.fileList.forEach((item, index) => {
              this.$set(item, 'name', res.data[index].original)
            })
          })
          res.data.dataFileType += ""
          this.form = res.data
        })
        this.open = true;
        this.title = "资料修改"
      },
      handleAdd() {
        this.open = true;
        this.title = "资料新增"
      },
      handleItem(item, index) {
        this.dataFileId = item.dictValue;
        this.form.dataFileType = item.dictValue;
        this.nameIndex = index;
        this.getList();
      },
      refresh() {
        this.nameIndex = 0;
        this.getDicts("cqndt_file_type").then(response => {
          this.nameList = response.data;
        });
      },
      handleDetail() {},
      handleDelete(row) {
        const dataFileId = row.dataFileId || this.ids;
        this.$confirm('是否确认删除编号为"' + dataFileId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delDataFile(dataFileId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            console.log(this.form);
            if (this.form.dataFileId) {
              eidtDataFile(this.form).then(res => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
            } else {
              addDataFile(Object.assign(this.form, {
                projectId: this.projectData.projectId
              })).then(res => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
            }
          }
        })
      },
      handleClose() {
        this.resetForm("form");
        this.cancel();
      },
      cancel() {
        this.open = false;
      }

    }
  }

</script>

<style lang="scss" scoped>
  .left-content {
    width: 100%;
    border: 1px solid #e6e6e6;
  }

  .left-content .header {
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

  .left-content {
    .container {
      height: calc(100vh - 500px);
      overflow-y: auto;

      .item {
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;

        i {
          margin: 0 5px;
          display: none;
          cursor: pointer;
        }
      }

      .item:hover i {
        display: inline-block;
      }

      .activeItem,
      .item:hover {
        background: #f2f2f2;
      }
    }
  }

  .left-content .header span {
    font-weight: bold;
  }

  .left-content .header .addItem {
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
