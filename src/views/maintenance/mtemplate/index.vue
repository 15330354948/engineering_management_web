<template>
  <div class="mtemplate-container">
    <!-- 弹窗组件 -->
    <Popups @dosave="saveInfo" @dclose="handleDialogClose" ref="popups" :dialogTitle="dialogInfo.dialogTitle" :dialogShow="dialogInfo.dialogShow" :dialogWidth="dialogInfo.dialogWidth">
      <mtemplateEdit ref="mtemplateEdit" :mtemplateEdit="mtemplateEdit" v-if="slotStatus.mtemplateEdit"></mtemplateEdit>
       <CopyTemplate
        ref="copytemplate"
        :templateName="templateName"
        v-if="slotStatus.copytemplate"
      ></CopyTemplate>
    </Popups>
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
              placeholder="请输入维护模板名称"
              v-model="mtemplateForm.templateName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 使用该组件获取点击通知 -->
      <TableSearch :pageSign="pageSign" :hideOpt="['Import']"></TableSearch>
    </div>

    <!-- 表格 -->
    <div class="table-panel">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: calc(100% - 20px); height: 650px; left: 0; right: 10px; position: absolute; margin: 12.5px; margin-top: 0; overflow: auto"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="maintainName" label="维护模板" width="320">
        </el-table-column>
        <el-table-column prop="num" label="维护项" width="320">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="320">
        </el-table-column>
        <el-table-column prop="remarks" label="备注" width="320">
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <el-button @click="handleMEdit(scope.row)" type="text" icon="el-icon-edit">修改</el-button>
            <el-button @click="handleMDelete(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
            <el-button @click="handleMCopy(scope.row)" type="text" icon="el-icon-document-copy">复制</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
    </div>

    <!-- 底部分页 -->
    <div class="bottom-pagination">
      <Pagination @pagination="handlePagination" :total="page.total" :limit="page.limit"></Pagination>
    </div>
  </div>
</template>

<script>
import TableSearch from "@/components/TableSearch";
import Popups from "../components/popups/index.vue"
import mtemplateEdit from "./mtemplateEdit/index.vue"
import CopyTemplate from "./copyTemplate/index";

import {
  maintTmplLst,
  maintDetails,
  modifyMaintDetails,
  addMaintDetails,
  DeleteMaintDetails,
  btchDeletionMaintDetails,
  ExportMaintDetails
} from "@/api/maintenance/index.js";
export default {
  name: "MTemplate",
  components: {
    TableSearch,
    Popups,
    mtemplateEdit,
    CopyTemplate
  },
  data() {
    return {
      pageSign: "MTemplate",
      pageSign: "mtask",
      mtemplateForm: {
        // 维护模板名称
        templateName: ""
      },
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      templateName: "",
      page: {
        total: 0,
        limit: 10,
      },
      checkPersonList: [
        {
          label: "测试人1",
          value: "testPerson1",
        },
        {
          label: "测试人2",
          value: "testPerson2",
        },
      ],
      // 表格数据
      tableData: [],
      // 表格当前选中项
      selectedItem: [],
      // 弹窗相关
      dialogInfo: {
        // dialog 标题
        dialogTitle: "",
        // dialog 显示隐藏
        dialogShow: false,
        // dialog 宽度
        dialogWidth: ""
      },
      slotStatus: {
        mtemplateEdit: false,
      },
      mtemplateEdit: {}
    };
  },
  methods: {
    // 分页查询
    async getList(query) {
      const result = await maintTmplLst(query);
      this.page.total = result.rows.length;
      this.tableData = result.rows;
    },
    // 分页处理
    async handlePagination(info) {
      // console.log("分页信息为", info);
      let { page, limit } = info;
      this.page.limit = limit;
      this.query.pageNum = page;
      this.query.pageSize = limit;
      this.getList(this.query);
      // 抽出来去请求一个整体的
    },
    // 多选处理
    handleSelectionChange(selection) {
      this.selectedItem = selection;
    },
    // 弹窗关闭处理
    handleDialogClose() {
      this.dialogInfo.dialogShow = false
      this.slotStatus = {}
    },
    // 通用删除
    handleDelete(config=undefined, data) {
      let hint
      if(config) {
        hint = `确认删除已选中的 ${config.selectedItem.length} 条数据?`
      } else {
        hint = "确认删除当前这条数据?"
      }
      this.$confirm(hint, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 执行删除逻辑
        if (config) {
            // console.log(config.selectedItem)
            let maintainIds = config.selectedItem.map((item) => {
              return item.maintainId;
            });
            // console.log(maintainIds);
            btchDeletionMaintDetails(maintainIds);
          } else {
            // 执行单选删除逻辑
            DeleteMaintDetails(data.maintainId);
          }
          // 新增和修改后刷新界面
          this.msgSuccess("删除成功");
          setTimeout(() => {
            this.getList();
          }, 100);
      }).catch(() => {
      });
    },
    // 修改
    async handleMEdit(row) {
      this.mtemplateEdit = {};
      const { data: result } = await maintDetails(row.maintainId);
      let oldObj = {};
      for (let i = 0; i < result.subMaintainTemplates.length; i++) {
        oldObj["subMaintainId" + (i + 1)] =
          result.subMaintainTemplates[i].subMaintainId;
        oldObj["subProject" + (i + 1)] =
          result.subMaintainTemplates[i].subMaintainName;
        oldObj["mPt" + (i + 1)] =
          result.subMaintainTemplates[i].subMaintainRequirement;
      }
      this.mtemplateEdit = {
        ...oldObj,
        maintainId: result.maintainId,
        remark: result.remarks,
        templateName: result.maintainName,
        deviceType: result.equipmentType
      };
      this.slotStatus = {
        mtemplateEdit: true,
      };
      this.dialogInfo = {
        dialogShow: true,
        dialogTitle: "巡检模板修改",
        dialogWidth: "55%",
      };
    },
    // 删除
    handleMDelete(row) {
      this.handleDelete(undefined, row) 
    },
    // 复制
    async handleMCopy(row) {
      const { data: result } = await maintDetails(row.maintainId);
      let oldObj = {};
      for (let i = 0; i < result.subMaintainTemplates.length; i++) {
        oldObj["subProject" + (i + 1)] =
          result.subMaintainTemplates[i].subMaintainName;
        oldObj["mPt" + (i + 1)] =
          result.subMaintainTemplates[i].subMaintainRequirement;
      }
      let tempObj = {
        ...oldObj,
        maintainId: result.maintainId,
        remark: result.remarks,
        templateName: result.maintainName,
        equipmentType: result.equipmentType
      };
      const subMaintainTemplates = [];
      for (let key in tempObj) {
        if (key.startsWith("mPt")) {
          // console.log(key);
          let subInsObj = {};
          if ("subMaintainId" + key.split("mPt")[1] in tempObj) {
            subInsObj.subMaintainId =
              tempObj["subMaintainId" + key.split("mPt")[1]];
          }
          subInsObj.subMaintainName =
            tempObj["subProject" + key.split("mPt")[1]];
          subInsObj.subMaintainRequirement =
            tempObj["mPt" + key.split("mPt")[1]];
          subMaintainTemplates.push(subInsObj);
        }
      }
      let cqndtInspectionTemplate = {
        remarks: tempObj.remark,
        maintainName: tempObj.templateName,
        subMaintainTemplates,
        equipmentType: tempObj.equipmentType
      };
      this.cpyTheRslt = cqndtInspectionTemplate
      this.templateName = tempObj.templateName + "复制";
      this.slotStatus = {
        copytemplate: true,
      };
      this.dialogInfo = {
        dialogShow: true,
        dialogTitle: "维护模板复制",
        dialogWidth: "20%"
      }
    },
    // 保存
    async saveInfo() {
      // 对应的表单数据
      let whichOne = Object.entries(this.slotStatus)[0][0]
      let ref = this.$refs[whichOne]
      let formVal = this.$refs[whichOne][whichOne+'Form']
      if(ref.formInvalid) {
        if (whichOne === "mtemplateEdit") {
          // 修改的逻辑
          // 校验成功，执行保存逻辑, Task 必选的逻辑需要优化
          console.log("保存值为:", formVal)
          const subMaintainTemplates = [];
          for (let key in formVal) {
            if (key.startsWith("mPt")) {
              // console.log(key);
              let subInsObj = {};
              if ("subMaintainId" + key.split("mPt")[1] in formVal) {
                subInsObj.subMaintainId =
                  formVal["subMaintainId" + key.split("mPt")[1]];
              }
              subInsObj.subMaintainName =
                formVal["subProject" + key.split("mPt")[1]];
              subInsObj.subMaintainRequirement =
                formVal["mPt" + key.split("mPt")[1]];
              subInsObj.maintainId = formVal.maintainId
              subMaintainTemplates.push(subInsObj);
            }
          }
          let cqndtInspectionTemplate = {};
          if (formVal.maintainId) {
            // 修改
            cqndtInspectionTemplate = {
              maintainId: formVal.maintainId,
              remarks: formVal.remark,
              maintainName: formVal.templateName,
              equipmentType:formVal.deviceType,
              subMaintainTemplates,
            };
            const result = await modifyMaintDetails(cqndtInspectionTemplate);
            // console.log('修改结果', result);
            this.msgSuccess(result.msg);
          } else {
            cqndtInspectionTemplate = {
              remarks: formVal.remark,
              maintainName: formVal.templateName,
              subMaintainTemplates,
              equipmentType:formVal.deviceType,
            };
            const result = await addMaintDetails(cqndtInspectionTemplate);
            this.msgSuccess(result.msg);
          }
        }
        if (whichOne === "copytemplate") {
          this.cpyTheRslt.maintainName = formVal.templateName
          addMaintDetails(this.cpyTheRslt)
        }  
        // 刷新界面
        setTimeout(() => {
          this.getList();
          this.handleDialogClose();
        }, 100);
      }
    }
  },
  created() {
    this.getList(this.query);
    this.$bus
      .$off(`${this.pageSign}SearchClick`)
      .$on(`${this.pageSign}SearchClick`, () => {
        let query = {};
        query.maintainName = this.mtemplateForm.templateName;
        this.getList(query);
      });
    this.$bus
      .$off(`${this.pageSign}ResetClick`)
      .$on(`${this.pageSign}ResetClick`, () => {
        // console.log("已监听到重置");
        this.mtemplateForm = {};
        this.getList();
      });
    this.$bus
      .$off(`${this.pageSign}CreateClick`)
      .$on(`${this.pageSign}CreateClick`, () => {
        // 清除传入
        this.mtemplateEdit = {}
        this.slotStatus = {
          mtemplateEdit: true
        }
        this.dialogInfo = {
          dialogShow: true,
          dialogTitle: "维护模板新增",
          dialogWidth: "55%"
        }
      });
    this.$bus
      .$off(`${this.pageSign}ExportClick`)
      .$on(`${this.pageSign}ExportClick`, async() => {
        const result = await ExportMaintDetails();
        this.download(result.msg);
      });
    this.$bus
      .$off(`${this.pageSign}DeleteClick`)
      .$on(`${this.pageSign}DeleteClick`, () => {
        if(this.selectedItem.length>0) {
          this.handleDelete({selectedItem: this.selectedItem}, this.selectedItem)
        }else{
          this.$message({
            message: '请勾选数据',
            type: 'warning'
          });
        }
      });
  },
};
</script>

<style lang="scss" scoped>
.mtemplate-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  // 表格
  .table-panel {
    width: 100%;
  }
  // 顶部搜索
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
  // 表格
  // 底部分页
  .bottom-pagination {
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>