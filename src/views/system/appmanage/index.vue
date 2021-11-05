<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <div class="mtemplate-header-container">
      <div class="search-panel">
        <el-form
          :model="mtemplateForm"
          status-icon
          label-width="200px"
          class="mtemplateForm"
        >
          <el-form-item prop="templateName">
            <el-input
              type="text"
              placeholder="请输入应用名称"
              v-model="mtemplateForm.templateName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 使用该组件获取点击通知 -->
      <TableSearch
        :pageSign="pageSign"
        :hideOpt="['Export', 'Import']"
      ></TableSearch>
    </div>
    <template>
      <el-table
        :data="tableData"
        border
        style="
          width: calc(100% - 20px);
          height: 650px;
          left: 0;
          right: 10px;
          position: absolute;
          margin: 12.5px;
          margin-top: 0;
          overflow: auto;
        "
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="appName" label="应用名称"> </el-table-column>
        <el-table-column prop="downloadLink" label="下载链接">
        </el-table-column>
        <el-table-column prop="versionNum" label="版本号"> </el-table-column>
        <el-table-column prop="updateInstructions" label="更新说明">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleMEdit(scope.row)"
              type="text"
              icon="el-icon-edit"
              >修改</el-button
            >
            <el-button
              @click="handleMDelete(scope.row)"
              type="text"
              icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 底部分页 -->
    <div class="bottom-pagination">
      <Pagination
        @pagination="handlePagination"
        :total="page.total"
        :limit="page.limit"
      ></Pagination>
    </div>
    <!-- 新增APP版本 -->
    <el-dialog
      :title="'新增APP版本'"
      :visible.sync="newAppVer"
      :width="'30%'"
      :fullscreen="fullScreen"
    >
      <div class="qualification-panel">
        <div class="manage-head">
          <el-form
            :model="addAppForm"
            :rules="addAppFormRules"
            ref="addAppFormRules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="应用名称" prop="appNm">
              <el-input v-model="addAppForm.appNm" placeholder="请输入应用名称"></el-input>
            </el-form-item>
            <el-form-item label="应用版本号" prop="appVerNum">
              <el-input v-model="addAppForm.appVerNum" placeholder="请输入应用版本号"></el-input>
            </el-form-item>
            <el-form-item label="应用更新说明" prop="appUpdInstructions">
              <el-input type="textarea" placeholder="请输入应用更新说明" v-model="addAppForm.appUpdInstructions"></el-input>
            </el-form-item>
            <el-form-item label="应用文件上传" prop="appFiles">
              <el-upload
                action="/"
                ref="uploadFilesRef"
                :limit="1"
                :http-request='uploadAppFiles'
                :show-file-list="true"
                :on-remove="removeFiles">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAdd">确 定</el-button>
        <el-button type="primary" @click="cancelAdd">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改APP版本 -->
    <el-dialog
      :title="'修改APP版本'"
      :visible.sync="editAppVer"
      :width="'30%'"
      :fullscreen="fullScreen"
    >
      <div class="qualification-panel">
        <div class="manage-head">
          <el-form
            :model="editAppVerForm"
            :rules="editAppVerRules"
            ref="editAppVerRuleser"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="应用名称" prop="appNm">
              <el-input v-model="editAppVerForm.appNm" placeholder="请输入应用名称"></el-input>
            </el-form-item>
            <el-form-item label="应用版本号" prop="appVerNum">
              <el-input v-model="editAppVerForm.appVerNum" placeholder="请输入应用版本号"></el-input>
            </el-form-item>
            <el-form-item label="应用更新说明" prop="appUpdInstructions">
              <el-input type="textarea" placeholder="请输入应用更新说明" v-model="editAppVerForm.appUpdInstructions"></el-input>
            </el-form-item>
            <el-form-item label="应用文件上传" prop="appFilesE" v-model="editAppVerForm.appFilesE">
              <el-upload
                action="/"
                ref="uploadFilesRef"
                :limit="1"
                :http-request='uploadAppFiles'
                :show-file-list="true"
                :on-remove="removeFiles">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <div v-if="editAppVerRules.fileExsit">文件已上传，如需更新请点击上传按钮</div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveUpdate">确 定</el-button>
        <el-button type="primary" @click="cancelUpdate">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { 
  AppManagement,
  uploadAppFile,
  newAppVer,
  getAppVerDetails,
  modifyAppVer,
  singleselectDelApp,
  multiselectDelApp
} from "@/api/appmanage/index.js";
import TableSearch from "@/components/TableSearch/index.vue";
export default {
  name: "appManage",
  components: {
    TableSearch,
  },
  data() {
    return {
      newAppVer: false,
      AppFormData: {},
      fileId: '',
      pageSign: "appmanage",
      editAppVer: false,
      editAppVerForm: {},
      tableData: [],
      loading: true,
      fullScreen: false,
      addAppForm: {},
      editAppVerRules: {
        appNm: [
          { required: true, message: '请输入应用名称', trigger: 'blur' },
        ],
        appVerNum: [
          { required: true, message: '请输入应用版本号', trigger: 'blur' },

        ],
        appUpdInstructions: [
          { required: true, message: '请输入应用更新说明', trigger: 'blur' },
        ],
        appFilesE: [
          { required: true, message: '请上传应用文件', trigger: 'change' },
        ]
      },
      addAppFormRules: {
        appNm: [
          { required: true, message: '请输入应用名称', trigger: 'blur' },
        ],
        appVerNum: [
          { required: true, message: '请输入应用版本号', trigger: 'blur' },

        ],
        appUpdInstructions: [
          { required: true, message: '请输入应用更新说明', trigger: 'blur' },
        ],
        appFiles: [
          { required: true, message: '请上传应用文件', trigger: 'change' },
        ]
      },
      mtemplateForm: {},
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      page: {
        total: 0,
        limit: 10,
      },
    };
  },
  methods: {
    // 多选处理
    handleSelectionChange(selection) {
      this.selectedItem = selection;
    },
    handleMDelete(row) {
      this.handleGenerDelete(undefined, row);
    },
    // 通用删除
    handleGenerDelete(config = undefined, data) {
      let hint;
      if (config) {
        hint = `确认删除已选中的 ${config.selectedItem.length} 条数据?`;
      } else {
        hint = "确认删除当前这条数据?";
      }
      this.$confirm(hint, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 执行删除逻辑
          if (config) {
            let versionIds = config.selectedItem.map((item) => {
              return item.versionId;
            }).join(',');
            await multiselectDelApp(versionIds);
          } else {
            // 执行单选删除逻辑
            await singleselectDelApp(data.versionId);
          }
          // 新增和修改后刷新界面
          this.msgSuccess("删除成功");
          setTimeout(() => {
            this.getList(this.query);
          }, 100);
        })
        .catch(() => {
        });
    },
    saveUpdate() {
      setTimeout(() => {
        this.$refs.editAppVerRuleser.validate(async(valid) => {
        if(valid) {
          let data = {
            appName: this.editAppVerForm.appNm,
            versionNum: this.editAppVerForm.appVerNum,
            updateInstructions: this.editAppVerForm.appUpdInstructions,
            versionId: this.editAppVerForm.versionId
          }
          if(this.fileId !== '') {
            data.fileId = this.fileId
          }
          await modifyAppVer(data)
          this.getList(this.query)
          this.$refs.uploadFilesRef.clearFiles()
          this.editAppVer = false
        } else {
          return false
        }
      })
      }, 100);
    },
    cancelUpdate() {
      this.editAppVerForm = {}
      this.editAppVer = false
      this.$refs.uploadFilesRef.clearFiles()
      this.$refs.editAppVerRuleser.resetFields()
    },
    async handleMEdit(row){
      this.editAppVerForm = {}
      const result = await getAppVerDetails(row.versionId)
      this.editAppVerForm = {
        appNm: result.data.appName,
        appVerNum: result.data.versionNum,
        appUpdInstructions: result.data.updateInstructions,
        versionId: result.data.versionId
      }
      if(result.data.downloadLink !== undefined) {
        this.editAppVerRules.fileExsit = true
        this.editAppVerForm.appFilesE = 'true'
      } else {
        this.editAppVerRules.fileExsit = false
      }
      this.editAppVer = true
    },
    removeFiles() {
      this.addAppForm = {
        appNm: this.addAppForm.appNm,
        appUpdInstructions: this.addAppForm.appUpdInstructions,
        appVerNum: this.addAppForm.appVerNum
      }
      this.editAppVerForm = {
        appNm: this.editAppVerForm.appNm,
        appUpdInstructions: this.editAppVerForm.appUpdInstructions,
        appVerNum: this.editAppVerForm.appVerNum
      }
    },
    async uploadAppFiles(file) {
      this.loading = true
      var formData = new FormData();
      formData.append("file",file.file)
      const result = await uploadAppFile(formData)
      this.msgSuccess('上传成功')
      this.fileId = result.data.fileId
      this.$set(this.addAppForm, 'appFiles', 'true')
      this.$set(this.editAppVerForm, 'appFilesE', 'true')
      this.loading = false
    },  
    saveAdd() {
      this.$refs.addAppFormRules.validate(async (valid) => {
        if(valid) {
          let data = {
            appName: this.addAppForm.appNm,
            updateInstructions: this.addAppForm.appUpdInstructions,
            versionNum: this.addAppForm.appVerNum,
            fileId: this.fileId
          }
          await newAppVer(data)
          this.$refs.uploadFilesRef.clearFiles()
          this.newAppVer = false
          this.getList(this.query)
        } else {
          return false
        }
      })
    },
    cancelAdd() {
      this.addAppForm = {}
      this.newAppVer = false
      this.$refs.addAppFormRules.resetFields()
    },
    async getList(query) {
      const result = await AppManagement(query);
      this.page.total = result.total;
      this.tableData = result.rows.map((item) => {
        item.remake = item.remark;
        item.addresss = item.address;
        item.leadernew = item.leader;
        item.deptNamenew = item.deptName;
        return item;
      });
      this.loading = false
    },
    // 分页处理
    async handlePagination(info) {
      let { page, limit } = info;
      this.page.limit = limit;
      this.query.pageNum = page;
      this.query.pageSize = limit;
      this.getList(this.query);
      // 抽出来去请求一个整体的
    },
  },
  created() {
    this.getList(this.query);
    this.$bus
      .$off(`${this.pageSign}SearchClick`)
      .$on(`${this.pageSign}SearchClick`, () => {
        let query = {};
        if(this.mtemplateForm.templateName !== "") {
          query.appName = this.mtemplateForm.templateName;
        }
        query = Object.assign(this.query, query)
        this.getList(query);
      });
    this.$bus
      .$off(`${this.pageSign}ResetClick`)
      .$on(`${this.pageSign}ResetClick`, () => {
        this.mtemplateForm = {};
        delete this.query.appName
        this.getList(this.query);
      });
    this.$bus
      .$off(`${this.pageSign}CreateClick`)
      .$on(`${this.pageSign}CreateClick`, () => {
        // 清除传入
        this.fileId = ''
        this.addAppForm = {}
        this.newAppVer = true;
      });
    this.$bus
      .$off(`${this.pageSign}ExportClick`)
      .$on(`${this.pageSign}ExportClick`, () => {
        this.msgInfo("功能确定中");
      });
    this.$bus
      .$off(`${this.pageSign}DeleteClick`)
      .$on(`${this.pageSign}DeleteClick`, () => {
        if (this.selectedItem.length > 0) {
          this.handleGenerDelete(
            { selectedItem: this.selectedItem },
            this.selectedItem
          );
        } else {
          this.$message({
            message: "请勾选数据",
            type: "warning",
          });
        }
      });
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 10px;
  .mtemplate-header-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    .search-panel {
      width: 200px;
      height: 50px;
      .mtemplateForm {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding-left: 10px;
        ::v-deep .el-form-item {
          margin: 0;
        }
        ::v-deep .el-form-item__content {
          margin: 0 !important;
          margin-right: 10px !important;
        }
      }
    }
  }
}
::v-deep .el-dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 6px;
}
::v-deep .el-form-item__label {
  width: 120px !important;
  position: absolute;
}
::v-deep .el-form-item__content {
  margin-left: 120px !important;
}
::v-deep .el-dialog__body {
  max-height: 1200px;
  overflow: auto;
  margin-bottom: 20px;
  &::-webkit-scrollbar-thumb {
    background-color: #d9e1e6 !important;
  }
  .slot-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
::v-deep .el-dialog__header {
  background: #f8f8f8;
  padding: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px;
  border-radius: 6px;
}
::v-deep .el-dialog__title {
  font-size: 15px;
  font-weight: 700;
  color: #606266;
}

::v-deep .el-dialog__footer {
  position: absolute;
  right: 0;
  bottom: 0;
}
::v-deep .el-dialog__headerbtn {
  position: inherit;
  color: #606266;
}
// 底部分页
.bottom-pagination {
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>