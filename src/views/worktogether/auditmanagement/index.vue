<template>
  <div class="mtask-container">
    <!-- 弹窗组件 -->
    <Popups @dosave="saveInfo" @dclose="handleDialogClose" ref="popups" :dialogTitle="dialogInfo.dialogTitle" :dialogShow="dialogInfo.dialogShow" :dialogWidth="dialogInfo.dialogWidth">
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
          <el-form-item prop="mtaskName">
            <el-input
              type="text"
              placeholder="请输入项目名称"
              v-model="mtaskForm.projectNm"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item prop="mtaskPerson">
            <el-input
              type="text"
              placeholder="请输入子项目名称"
              v-model="mtaskForm.subprojectNm"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item prop="mtaskPerson">
            <el-input
              type="text"
              placeholder="请输入测点名称"
              v-model="mtaskForm.measuringPtNm"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item prop="mtaskPerson">
             <el-date-picker
              v-model="mtaskForm.dt"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <!-- 使用该组件获取点击通知 -->
      <TableSearch :pageSign="pageSign" :hideOpt="['Create', 'Export', 'Delete', 'Import']"></TableSearch>
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
        <el-table-column prop="name" label="项目名称" width="320">
        </el-table-column>
        <el-table-column prop="name" label="子项目名称" width="320">
        </el-table-column>
        <el-table-column prop="name" label="测点名称" width="320">
        </el-table-column>
        <el-table-column prop="name" label="工序名称" width="320">
        </el-table-column>
        <el-table-column prop="name" label="上报人员" width="120">
        </el-table-column>
        <el-table-column prop="name" label="上报时间" width="120">
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <!-- <el-button @click="handleMPerson(scope.row)" type="text" icon="el-icon-user">维护人员</el-button>
            <el-button @click="handleMEdit(scope.row)" type="text" icon="el-icon-edit">修改</el-button> -->
            <el-button @click="handleMDelete(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
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
export default {
  name: "MTask",
  components: {
    TableSearch,
    Popups,
  },
  data() {
    return {
      pageSign: "mtask",
      mtaskForm: {
        // 项目名称
        projectNm: '',
        subprojectNm: '',
        measuringPtNm: '',
        dt: []
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
      console.log(this.slotStatus)
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
      if(ref.formInvalid) {
        // 校验成功，执行保存逻辑, Task 必选的逻辑需要优化
        console.log("保存值为:", formVal)
        this.handleDialogClose()
      }
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