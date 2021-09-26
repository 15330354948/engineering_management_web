<template>
  <div class="mtask-container">
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
              placeholder="请输入维护任务名称"
              v-model="mtaskForm.mtaskName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item prop="mtaskPerson">
            <el-input
              type="text"
              placeholder="请输入维护人"
              v-model="mtaskForm.mtaskPerson"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item prop="planningDate">
            <el-date-picker
            v-model="mtaskForm.planningDate"
            type="date"
            placeholder="请选择计划时间">
          </el-date-picker>
          </el-form-item>
          <el-form-item prop="finishDate">
            <el-date-picker
            v-model="mtaskForm.finishDate"
            type="date"
            placeholder="请选择实际完成时间">
          </el-date-picker>
          </el-form-item>
          <el-form-item label-width="200px" prop="mtaskStatus">
            <el-select
              v-model="mtaskForm.mtaskStatus"
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in mtaskStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="200px" prop="mtaskResult">
            <el-select
              v-model="mtaskForm.mtaskResult"
              placeholder="请选择结果"
            >
              <el-option
                v-for="item in mtaskResultList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- 使用该组件获取点击通知 -->
      <div style="position:absolute; right: 10px"><TableSearch :pageSign="pageSign"></TableSearch></div>
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
        <el-table-column prop="name" label="维护任务名称" width="620">
        </el-table-column>
        <el-table-column prop="name" label="维护人" width="120">
        </el-table-column>
        <el-table-column prop="name" label="计划完成时间" width="220">
        </el-table-column>
        <el-table-column prop="name" label="实际完成时间" width="220">
        </el-table-column>
        <el-table-column prop="name" label="状态" width="120">
        </el-table-column>
        <el-table-column prop="name" label="维护结果" width="120">
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" icon="el-icon-user">维护人员</el-button>
            <el-button type="text" icon="el-icon-edit">修改</el-button>
            <el-button type="text" icon="el-icon-delete">删除</el-button>
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
export default {
  name: "MTask",
  components: {
    TableSearch,
  },
  data() {
    return {
      pageSign: "mtask",
      mtaskForm: {
        // 维护任务名称
        mtaskName: "",
        // 维护人
        mtaskPerson: "",
        // 计划时间
        planningDate: "",
        // 实际完成时间
        finishDate: "",
        // 状态
        mtaskStatus: "",
        // 结果
        mtaskResult: ""
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
      selectedItem: []
    };
  },
  methods: {
    handleSelectionChange(selection) {
      this.selectedItem = selection
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
            this.$confirm(`确认删除已选中的 ${this.selectedItem.length} 条数据?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            // 执行删除逻辑
            this.tableData = []
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
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
  }
}
</style>