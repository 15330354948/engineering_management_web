<template>
  <div class="mtask-container">
    <!-- 弹窗组件 -->
    <Popups @dosave="saveInfo" @dclose="handleDialogClose" ref="popups" :dialogTitle="dialogInfo.dialogTitle" :dialogShow="dialogInfo.dialogShow" :dialogWidth="dialogInfo.dialogWidth">
      <mtaskProject ref="mtaskProject" :readonly="readonly" :mtaskProjectForm="mtaskProjectForm" v-if="slotStatus.mtaskProject"></mtaskProject>
    </Popups>
    <!-- 顶部搜索 -->
    <div class="mtask-header-container">
      <div class="search-panel">
        <el-form
          :model="mtaskForm"
          status-icon
          label-width="200px"
          class="mtaskForm"
        >
          <el-form-item prop="deviceType">
            <el-select clearable v-model="mtaskForm.unit" placeholder="请选择测点单位">
              <el-option label="项目一" value="shanghai"></el-option>
              <el-option label="项目二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="deviceType">
            <el-select clearable v-model="mtaskForm.peropletype" placeholder="请选择人员类型">
              <el-option label="项目一" value="shanghai"></el-option>
              <el-option label="项目二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="mtaskName">
            <el-input
              type="text"
              placeholder="请输入姓名"
              v-model="mtaskForm.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 使用该组件获取点击通知 -->
      <div style="margin-right: 1000px">
        <TableSearch :pageSign="pageSign" :hideOpt="['Create', 'Export', 'Delete', 'Import']"></TableSearch>
      </div>
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
        <el-table-column prop="name" label="姓名" width="320">
        </el-table-column>
        <el-table-column prop="name" label="人员类型" width="320">
        </el-table-column>
        <el-table-column prop="name" label="所属单位" width="320">
        </el-table-column>
        <el-table-column
            label="负责项目"
            >
            <template slot-scope="scope">
              <el-button @click="editRow(scope.row, 'readonly')" type="text">1</el-button>
            </template>
        </el-table-column>
          <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
              <el-button @click="editRow(scope.row)" type="text" icon="el-icon-edit">修改</el-button>
            </template>
          </el-table-column>
      </el-table>
      <!-- 分页组件 -->
    </div>

    <!-- 底部分页 -->
    <div class="bottom-pagination">
      <Pagination :total="100"></Pagination>
    </div>
  </div>
</template>

<script>
import TableSearch from "@/components/TableSearch";
import Popups from "@/views/maintenance/components/popups/index.vue"
import mtaskProject from './mtaskProject/index.vue'
export default {
  name: "MTask",
  components: {
    TableSearch,
    Popups,
    mtaskProject
  },
  data() {
    return {
      pageSign: "mtask",
      mtaskForm: {
        // 项目名称
        unit: '',
        peropletype: '',
        name: ''
      },
      // 弹窗相关
      dialogInfo: {
        // dialog 标题
        dialogTitle: "",
        // dialog 显示隐藏
        dialogShow: false,
        // dialog 宽度
        dialogWidth: ""
      },
      // 状态列表
      mtaskStatusList: [
        {
          label: "待维护",
          value: 0,
        },
        {
          label: "进行中",
          value: 1,
        },
        {
          label: "待审核",
          value: 2,
        },
        {
          label: "已审核",
          value: 3,
        },
        {
          label: "已逾期",
          value: 4,
        },
      ],
      // 结果列表
      mtaskResultList: [
        {
          label: "优秀",
          value: 0
        },
        {
          label: "良好",
          value: 1
        },
        {
          label: "一般",
          value: 2
        },
        {
          label: "较差",
          value: 3
        }
      ],
      readonly: false,
      mtaskProjectForm: [
       {
         name: '测试',
       }
      ],
      // 表格数据
      tableData: [
        {
          date: "测试日期1",
          name: "测试1",
          address: "测试地址1"
        },
        {
          date: "测试日期2",
          name: "测试2",
          address: "测试地址2"
        }
      ],
      // 表格当前选中项
      selectedItem: [],
      // 插槽组件管理
      slotStatus: {
        mtaskEdit: false,
        mPeople: false
      },
      // 修改时传入，创建时清楚
      taskTableForm: {}
    };
  },
  methods: {
    // 多选处理
    handleSelectionChange(selection) {
      this.selectedItem = selection
    },
    // 修改
    editRow(row, status) {
      if(status) {
        this.slotStatus = {
          mtaskProject: true
        }
        this.readonly = false
        this.dialogInfo = {
          dialogShow: true,
          dialogTitle: "负责项目",
          dialogWidth: "65%"
        }
      } else {
        this.slotStatus = {
          mtaskProject: true
        }
        this.readonly = true
        this.dialogInfo = {
          dialogShow: true,
          dialogTitle: "任务计划编辑",
          dialogWidth: "65%"
        }
      }
     
    },
    // 弹窗关闭处理
    handleDialogClose() {
      this.dialogInfo.dialogShow = false
      this.slotStatus = {}
    },
    // 维护人员
    handleMPerson(row) {
      console.log("这一行内容的信息", row)
      this.slotStatus = {
        mPeople: true
      }
      this.dialogInfo = {
        dialogShow: true,
        dialogTitle: "维护人员分配",
        dialogWidth: "20%"
      }
    },
    // 修改
    handleMEdit(row) {
      console.log("这一行内容的信息", row)
      this.taskTableForm = {
        projectName: "测试",
        subProject1: "beijing",
        subProject2: "shanghai",
        subProject3: "shanghai"
      }
      this.slotStatus = {
        mtaskEdit: true
      }
      this.dialogInfo = {
        dialogShow: true,
        dialogTitle: "修改维护任务",
        dialogWidth: "55%"
      }
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
        console.log("要删除的信息", data)
        this.tableData = []
      }).catch(() => {
        console.log("取消删除")
      });
    },
    // 删除
    handleMDelete(row) {
      console.log("这一行的信息", row)
      this.handleDelete(undefined, row) 
    },
    // 提交数据
    saveInfo() {
      // 对应的表单数据
      let whichOne = Object.entries(this.slotStatus)[0][0]
      let ref = this.$refs[whichOne]
      let formVal = this.$refs[whichOne][whichOne+'Form']
      console.log("保存值为:", formVal)
      this.handleDialogClose()
    }
  },
  created() {
    this.$bus
      .$off(`${this.pageSign}SearchClick`)
      .$on(`${this.pageSign}SearchClick`, () => {
        console.log("已监听到搜索");
        console.log(this.mtaskForm);
      });
    this.$bus
      .$off(`${this.pageSign}ResetClick`)
      .$on(`${this.pageSign}ResetClick`, () => {
        console.log("已监听到重置");
        this.mtaskForm = {};
      });
    this.$bus
      .$off(`${this.pageSign}CreateClick`)
      .$on(`${this.pageSign}CreateClick`, () => {
        console.log("已监听到创建");
        // 清除传入
        this.taskTableForm = {}
        this.slotStatus = {
          mtaskEdit: true
        }
        this.dialogInfo = {
          dialogShow: true,
          dialogTitle: "创建维护任务",
          dialogWidth: "55%"
        }
      });
    this.$bus
      .$off(`${this.pageSign}ExportClick`)
      .$on(`${this.pageSign}ExportClick`, () => {
        this.msgInfo("功能确定中");
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
.mtask-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  // 顶部搜索
  .mtask-header-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    .search-panel {
      width: 100%;
      height: 50px;
      .mtaskForm {
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