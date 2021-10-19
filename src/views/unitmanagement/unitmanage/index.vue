<template>
  <div class="unitmanagement-container">
    <div class="left">
      <div class="left-title">
        {{leftTitle}}
      </div>
      <div class="search-panel">
        <el-input
          placeholder="请输入单位类别名称"
          suffix-icon="el-icon-search"
          v-model="searchValue">
        </el-input>
      </div>
      <div class="data-list">
        <div @click="selectUnit(item, index)" :class="['data-item', currentIndex===index?'activatedItem':'']"  v-for="(item, index) in dataList" :key="index">{{item.name}}</div>
      </div>
    </div>
    <div class="right">
       <!-- 弹窗组件 -->
      <Popups @dosave="saveInfo" @dclose="handleDialogClose" ref="popups" :dialogTitle="dialogInfo.dialogTitle" :dialogShow="dialogInfo.dialogShow" :dialogWidth="dialogInfo.dialogWidth">     
      </Popups>
      <!-- 顶部搜索 -->
      <div class="mtemplate-header-container">
        <div class="search-panel">
          <el-form
            :model="searchForm"
            status-icon
            label-width="200px"
            class="searchForm"
          >
            <el-form-item prop="name">
              <el-input
                type="text"
                placeholder="请输入姓名"
                v-model="searchForm.name"
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
          style="width: calc(100% - 25px); height: 650px; left: 0; right: 10px; position: absolute; margin: 12.5px; margin-top: 0; overflow: auto"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="单位名称" width="170">
          </el-table-column>
          <el-table-column prop="name" label="类别" width="170">
          </el-table-column>
          <el-table-column prop="name" label="地址" width="170">
          </el-table-column>
          <el-table-column label="资质" width="170">
            <template slot-scope="scope">
              <el-button icon="el-icon-upload" @click="handleUpload(scope.row)" type="text">上传</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="人员" width="170">
          </el-table-column>
          <el-table-column prop="name" label="备注" width="170">
          </el-table-column>
          <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" icon="el-icon-edit">修改</el-button>
              <el-button @click="handleDelete(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
      </div>

      <!-- 底部分页 -->
      <div class="bottom-pagination">
        <Pagination :total="total"></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import TableSearch from "@/components/TableSearch";
  import Popups from "@/views/maintenance/components/popups/index.vue"
  export default {
    name: 'unitmanage',
    components: {
      TableSearch,
      Popups
    },
    data() {
      return {
        // 上一次点击的名字
        lastActivatedName: '',
        // 当前激活选项索引
        currentIndex: -1,
        // 页面标志
        pageSign: 'addrbook',
        // 标题
        leftTitle: '所属单位',
        // 搜索的值
        searchValue: '',
        // 左栏的数据列表
        dataList: [],
        // 基础对比库
        oldDataList: [],
        // 表格中数据的长度
        total: 0,
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
        searchForm: {
          name: ''
        },
        // 表格数据
      tableData: [],
      }
    },
    methods: {
      // 资质上传
      handleUpload(row) {
        console.log("这一行的数据",row);
      },
      // 通用删除
      handleGenerDelete(config=undefined, data) {
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
      handleDelete(row) {
        console.log("这一行的信息", row)
        this.handleGenerDelete(undefined, row) 
      },
      // 单位选择
      selectUnit(item,index) {
        if(this.lastActivatedName === '') {
          this.currentIndex = index
          this.lastActivatedName = item.name
          // 待对接接口，刷新界面，根据name重新请求
          console.log(item.name);
        } else if(this.lastActivatedName!=='' && this.lastActivatedName !== item.name) { 
          this.currentIndex = index
          this.lastActivatedName = item.name
          // 待对接接口，刷新界面，根据name重新请求
          console.log(item.name);
        } else {
          this.currentIndex = -1
          this.lastActivatedName = ''
          // 待对接接口，刷新界面，请求所有数据
        }
      },
      // 多选处理
      handleSelectionChange(selection) {
        this.selectedItem = selection;
      },
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
      },
        // 弹窗关闭处理
      handleDialogClose() {
        this.dialogInfo.dialogShow = false
        this.slotStatus = {}
      },
    },
    created() {
      // mock
      this.oldDataList = this.dataList = [
        {name: '测试数据1'},
        {name: '测试数据2'},
        {name: '测试数据3'},
        {name: '测试数据4'},
        {name: '测试数据5'},
        {name: '测试数据6'},
        {name: '测试数据7'}
      ]
      this.tableData = [
        {
          date: "测试日期1",
          name: "测试1",
          address: "测试地址1",
        },
        {
          date: "测试日期2",
          name: "测试2",
          address: "测试地址2",
        }]
      this.total = this.tableData.length
      this.$bus
      .$off(`${this.pageSign}SearchClick`)
      .$on(`${this.pageSign}SearchClick`, () => {
        console.log("已监听到搜索");
        console.log(this.searchForm);
      });
    this.$bus
      .$off(`${this.pageSign}ResetClick`)
      .$on(`${this.pageSign}ResetClick`, () => {
        console.log("已监听到重置");
        this.searchForm = {};
      });
    this.$bus
      .$off(`${this.pageSign}CreateClick`)
      .$on(`${this.pageSign}CreateClick`, () => {
        console.log("已监听到创建");
        // 清除传入
        this.mtemplateEdit = {}
        this.slotStatus = {
          mtemplateEdit: true
        }
        this.dialogInfo = {
          dialogShow: true,
          dialogTitle: "人员新增",
          dialogWidth: "35%"
        }
      });
    this.$bus
      .$off(`${this.pageSign}ImportClick`)
      .$on(`${this.pageSign}ImportClick`, () => {
        this.msgInfo("导入功能确定中");
      });
    this.$bus
      .$off(`${this.pageSign}ExportClick`)
      .$on(`${this.pageSign}ExportClick`, () => {
        this.msgInfo("导出功能确定中");
      });
    this.$bus
      .$off(`${this.pageSign}DeleteClick`)
      .$on(`${this.pageSign}DeleteClick`, () => {
        if(this.selectedItem.length>0) {
          this.handleGenerDelete({selectedItem: this.selectedItem}, this.selectedItem)
        }else{
          this.$message({
            message: '请勾选数据',
            type: 'warning'
          });
        }
      });
    },
    watch: {
      searchValue: {
        handler(val) {
          if(val.length > 0) {
            this.dataList = []
            for(let item of this.oldDataList) {
              if(item.name.indexOf(val) != -1) {
                this.dataList.push(item)
              }
            }
          } else {
            this.dataList = this.oldDataList
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.unitmanagement-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 10px;
  display: flex;
  .left {
    width: 336px;
    height: 100%;
    border: 1px solid #e4e4e4;  
    .left-title{
      width: 100%;
      height: 40px;
      background: #f2f2f2;
      font-weight: 700;
      font-size: 15px;
      display: flex;
      align-items: center;
      padding-left: 12px;
    }
    .search-panel {
      width: 100%;
      height: 60px;
      padding: 10px;
    }
    .data-list {
      height: calc(100% - 100px);
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar-track
      {
        -webkit-box-shadow: none;
      }
      &::-webkit-scrollbar-thumb
      {
        border-radius: 10px;
        -webkit-box-shadow: none;
        background-color: #d9e1e6;
      }

      .data-item {
        width: 100%;
        height: 33px;
        padding: 10px;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;

        &:hover {
          background: #dce5fa;
        }

        &.activatedItem {
          background: #dce5fa;
        }
      }
    }
  }
  .right {
    flex: 1;
    height: 100%;
    margin-left: 20px;
    border: 1px solid #e4e4e4;
    position: relative;
    // 表格
    .table-panel {
      position: relative;
      width: 100%;
      height: 650px;
    }
    .mtemplate-header-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    .search-panel {
      width: 200px;
      height: 50px;
      .searchForm {
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
      // 底部分页
    .bottom-pagination {
      position: absolute;
      bottom: 0px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  }
}
</style>