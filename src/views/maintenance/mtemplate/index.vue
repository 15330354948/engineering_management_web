<template>
  <div class="mtemplate-container">
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
      <TableSearch :pageSign="pageSign"></TableSearch>
    </div>

    <!-- 表格 -->
    <div class="table-panel">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: calc(100% - 20px); height: 650px; left: 0; right: 10px; position: absolute; margin: 12.5px; overflow: auto"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="维护模板" width="320">
        </el-table-column>
        <el-table-column prop="name" label="维护项" width="320">
        </el-table-column>
        <el-table-column prop="name" label="创建时间" width="320">
        </el-table-column>
        <el-table-column prop="name" label="备注" width="320">
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" icon="el-icon-edit">修改</el-button>
            <el-button type="text" icon="el-icon-delete">删除</el-button>
            <el-button type="text" icon="el-icon-document-copy">复制</el-button>
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
  name: "MTemplate",
  components: {
    TableSearch,
  },
  data() {
    return {
      pageSign: "MTemplate",
      pageSign: "mtask",
      mtemplateForm: {
        // 维护模板名称
        templateName: ""
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
      tableData: [
        {
          date: "测试日期1",
          name: "测试1",
          address: "测试地址1",
        },
        {
          date: "测试日期2",
          name: "测试2",
          address: "测试地址2",
        }
      ],
      // 表格当前选中项
      selectedItem: [],
    };
  },
  methods: {
    handleSelectionChange(selection) {
      this.selectedItem = selection;
    },
  },
  created() {
    this.$bus
      .$off(`${this.pageSign}SearchClick`)
      .$on(`${this.pageSign}SearchClick`, () => {
        console.log("已监听到搜索");
        console.log(this.mtemplateForm);
      });
    this.$bus
      .$off(`${this.pageSign}ResetClick`)
      .$on(`${this.pageSign}ResetClick`, () => {
        console.log("已监听到重置");
        this.mtemplateForm = {};
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
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
  }
}
</style>