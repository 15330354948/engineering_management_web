<template>
  <div class="unitmanagement-container">
    <div class="left">
      <div class="left-title">
        {{ leftTitle }}
      </div>
      <div class="search-panel">
        <el-input
          placeholder="请输入单位名称"
          suffix-icon="el-icon-search"
          v-model="searchValue"
        >
        </el-input>
      </div>
      <div class="data-list">
        <div
          @click="selectUnit(item, index)"
          :class="['data-item', currentIndex === index ? 'activatedItem' : '']"
          v-for="(item, index) in dataList"
          :key="index"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="right">
      <!-- 弹窗组件 -->
      <Popups
        @dosave="saveInfo"
        @dclose="handleDialogClose"
        ref="popups"
        :dialogTitle="dialogInfo.dialogTitle"
        :dialogShow="dialogInfo.dialogShow"
        :dialogWidth="dialogInfo.dialogWidth"
      >
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
          style="
            width: calc(100% - 25px);
            height: 650px;
            left: 0;
            right: 10px;
            position: absolute;
            margin: 12.5px;
            margin-top: 0;
            overflow: auto;
          "
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="employeeName" label="姓名" width="200">
          </el-table-column>
          <el-table-column prop="sexcn" label="性别" width="200">
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="200">
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" width="200">
          </el-table-column>
          <el-table-column prop="postName" label="岗位" width="200">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row)"
                type="text"
                icon="el-icon-edit"
                >修改</el-button
              >
              <el-button
                @click="handleDelete(scope.row)"
                type="text"
                icon="el-icon-delete"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
      </div>

      <!-- 底部分页 -->
      <div class="bottom-pagination">
        <Pagination
          @pagination="handlePagination"
          :total="page.total"
          :limit="page.limit"
        ></Pagination>
      </div>

      <!-- 人员新增 -->
      <el-dialog
        :title="'人员新增'"
        :visible.sync="newStf"
        :width="'40%'"
        :fullscreen="fullScreen"
      >
        <div slot="title" style="" class="header-title">
          人员新增
          <div
            @click="() => (fullScreen = !fullScreen)"
            class="fullscreen"
          ></div>
        </div>

        <!-- 内容 -->
        <div class="content-panel">
          <el-form
            :model="newStfForm"
            :rules="newStfFormRules"
            ref="newStfForm"
            label-width="100px"
          >
            <div class="each-line">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="newStfForm.name"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-select
                  style="width: 100%"
                  v-model="newStfForm.sex"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in gender"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="each-line">
              <el-form-item label="手机号" prop="phonenum">
                <el-input v-model="newStfForm.phonenum"></el-input>
              </el-form-item>
              <el-form-item label="所属单位" prop="affl">
                <el-input disabled v-model="newStfForm.affl"></el-input>
              </el-form-item>
            </div>
            <div class="each-line">
              <el-form-item label="部门" prop="deptName">
                <el-input v-model="newStfForm.deptName"></el-input>
              </el-form-item>
              <el-form-item label="岗位" prop="post">
                <el-input v-model="newStfForm.post"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="slot-container">
          <slot></slot>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="newStf = false">取 消</el-button>
          <el-button type="primary" @click="savePeople">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 人员修改 -->
      <el-dialog
        :title="'人员修改'"
        :visible.sync="newStfEdit"
        :width="'40%'"
        :fullscreen="fullScreen"
      >
        <div slot="title" style="" class="header-title">
          人员修改
          <div
            @click="() => (fullScreen = !fullScreen)"
            class="fullscreen"
          ></div>
        </div>

        <!-- 内容 -->
        <div class="content-panel">
          <el-form
            :model="newStfFormEdit"
            :rules="newStfFormRulesEdit"
            ref="newStfForm"
            label-width="100px"
          >
            <div class="each-line">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="newStfFormEdit.name"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-select
                  style="width: 100%"
                  v-model="newStfFormEdit.sex"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in gender"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="each-line">
              <el-form-item label="手机号" prop="phonenum">
                <el-input v-model="newStfFormEdit.phonenum"></el-input>
              </el-form-item>
              <el-form-item label="所属单位" prop="affl">
                <el-input disabled v-model="newStfFormEdit.affl"></el-input>
              </el-form-item>
            </div>
            <div class="each-line">
              <el-form-item label="部门" prop="deptName">
                <el-input v-model="newStfFormEdit.deptName"></el-input>
              </el-form-item>
              <el-form-item label="岗位" prop="post">
                <el-input v-model="newStfFormEdit.post"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="slot-container">
          <slot></slot>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="newStf = false">取 消</el-button>
          <el-button type="primary" @click="updatePeople">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import TableSearch from "@/components/TableSearch";
import Popups from "@/views/maintenance/components/popups/index.vue";
import { 
lstOfUnits,
addAddrBook, 
addrBookLst,
updateAddrBook,
deleteAddrBook
} from "@/api/addrbookmanage/index.js";
export default {
  name: "addrbookmanage",
  components: {
    TableSearch,
    Popups,
  },
  data() {
    return {
      gender: [
        {
          label: "男",
          value: 0,
        },
        {
          label: "女",
          value: 1,
        },
      ],
      // 上一次点击的名字
      lastActivatedName: "",
      // 当前激活选项索引
      currentIndex: -1,
      // 页面标志
      pageSign: "addrbook",
      // 标题
      leftTitle: "所属单位",
      // 搜索的值
      searchValue: "",
      // 左栏的数据列表
      dataList: [],
      // 基础对比库
      oldDataList: [],
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      newStf: false,
      page: {
        total: 0,
        limit: 10,
      },
      newStfEdit: false,
      newStfFormEdit: {},

      newStfForm: {},
      // 表格中数据的长度
      total: 0,
      // 表格当前选中项
      selectedItem: [],
      currentlySelectedUnit: "",
      fullScreen: false,
      selectedCoNm: "",
      // 弹窗相关
      dialogInfo: {
        // dialog 标题
        dialogTitle: "",
        // dialog 显示隐藏
        dialogShow: false,
        // dialog 宽度
        dialogWidth: "",
      },
      searchForm: {
        name: "",
      },
      // 表格数据
      tableData: [],
      newStfFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        phonenum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        affl: [
          { required: true, message: "请输入所属单位", trigger: "blur" },
        ],
      },
      newStfFormRulesEdit: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        phonenum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        affl: [
          { required: true, message: "请输入所属单位", trigger: "blur" },
        ],
      }
    };
  },
  methods: {
    savePeople() {
      this.$refs.newStfForm.validate(async (valid) => {
        if(valid) {
          let data = {
            departmentName: this.newStfForm.deptName,
            deptId: this.currentlySelectedUnit,
            employeeName: this.newStfForm.name,
            phone: this.newStfForm.phonenum,
            postName: this.newStfForm.post,
            sex: this.newStfForm.sex
          }
          await addAddrBook(data)
          this.newStf = false
          this.getList({deptId: this.currentlySelectedUnit})
        } else {
          return false
        }
      })
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
        .then(() => {
          // 执行删除逻辑
          if(config) {
            let bookIds = config.selectedItem.map((item) => {
              return item.bookId;
            }).join(',');
            deleteAddrBook(bookIds)
          } else {
            deleteAddrBook(data.bookId)
          }
          // 新增和修改后刷新界面
          this.msgSuccess("删除成功");
          setTimeout(() => {
            this.getList();
          }, 100);
        })
        .catch(() => {
        });
    },
    // 删除
    handleDelete(row) {
      this.handleGenerDelete(undefined, row);
    },
    // 查询分组列表
    async getList(query) {
      const result = await addrBookLst(query);
      this.page.total = result.total;
      this.tableData = result.rows.map((item) => {
        item.sexcn = item.sex === '0' ? '男': '女'
        return item;
      });
    },
    handleEdit(row) {
      this.newStfFormEdit = {
        sex :row.sex * 1,
        name: row.employeeName,
        phonenum : row.phone,
        affl : row.deptName,
        deptName : row.departmentName,
        post : row.postName,
        deptId: row.deptId,
        bookId: row.bookId
      }
      this.newStfEdit = true
    },
    async updatePeople() {
      let data = {
        departmentName: this.newStfFormEdit.deptName,
        deptId: this.newStfFormEdit.deptId,
        bookId: this.newStfFormEdit.bookId,
        employeeName: this.newStfFormEdit.name,
        sex: this.newStfFormEdit.sex,
        phone: this.newStfFormEdit.phonenum,
        postName: this.newStfFormEdit.post
      }
      const result = await updateAddrBook(data)
      if(result.code === 200) {
        this.msgSuccess(result.msg)
      }
      this.newStfEdit = false
      this.getList({deptId: this.currentlySelectedUnit})
    },
    // 单位选择
    selectUnit(item, index) {
      if (this.lastActivatedName === "") {
        this.currentIndex = index;
        this.lastActivatedName = item.name;
        let query = Object.assign(this.query, { deptId: item.deptId });
        this.currentlySelectedUnit = item.deptId;
        this.selectedCoNm = item.deptName;
        // 待对接接口，刷新界面，根据name重新请求
        this.getList(query);
      } else if (
        this.lastActivatedName !== "" &&
        this.lastActivatedName !== item.name
      ) {
        this.currentIndex = index;
        this.lastActivatedName = item.name;
        let query = Object.assign(this.query, { deptId: item.deptId });
        this.currentlySelectedUnit = item.deptId;
        this.selectedCoNm = item.deptName;
        // 待对接接口，刷新界面，根据name重新请求
        this.getList(query);
      } else {
        this.currentIndex = -1;
        this.lastActivatedName = "";
        // 待对接接口，刷新界面，请求所有数据
        delete this.query.deptId;
        this.currentlySelectedUnit = "";
        this.selectedCoNm = "";
        this.getList(this.query);
      }
    },
    // 分页处理
    handlePagination(info) {
      let { page, limit } = info;
      this.page.limit = limit;
      this.query.pageNum = page;
      this.query.pageSize = limit;
      this.getList(this.query);
    },
    // 多选处理
    handleSelectionChange(selection) {
      this.selectedItem = selection;
    },
    saveInfo() {
      // 对应的表单数据
      let whichOne = Object.entries(this.slotStatus)[0][0];
      let ref = this.$refs[whichOne];
      let formVal = this.$refs[whichOne][whichOne + "Form"];
      if (ref.formInvalid) {
        // 校验成功，执行保存逻辑, Task 必选的逻辑需要优化
        this.handleDialogClose();
      }
    },
    // 弹窗关闭处理
    handleDialogClose() {
      this.dialogInfo.dialogShow = false;
      this.slotStatus = {};
    },
  },
  async created() {
    // mock
    const result = await lstOfUnits();
    // mock
    this.oldDataList = this.dataList = result.rows.map((item) => {
      item.name = item.deptName;
      return item;
    });
    this.getList(this.query);
    this.total = this.tableData.length;
    this.$bus
      .$off(`${this.pageSign}SearchClick`)
      .$on(`${this.pageSign}SearchClick`, () => {
        let query = {};
        if(this.searchForm.name !== "") {
          query.employeeName = this.searchForm.name;
        }
        query = Object.assign(this.query, query)
        this.getList(query);
      });
    this.$bus
      .$off(`${this.pageSign}ResetClick`)
      .$on(`${this.pageSign}ResetClick`, () => {
        this.searchForm = {};
        delete this.query.employeeName
        this.getList(this.query);
      });
    this.$bus
      .$off(`${this.pageSign}CreateClick`)
      .$on(`${this.pageSign}CreateClick`, () => {
        // 清除传入
        this.newStfForm = {}
        if (this.currentlySelectedUnit !== "") {
          this.newStfForm.affl = this.selectedCoNm
          this.newStf = true;
        } else {
          this.msgWarn("请先在左侧选择一项参与方");
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
  watch: {
    searchValue: {
      handler(val) {
        if (val.length > 0) {
          this.dataList = [];
          for (let item of this.oldDataList) {
            if (item.name.indexOf(val) != -1) {
              this.dataList.push(item);
            }
          }
        } else {
          this.dataList = this.oldDataList;
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.content-panel {
  width: 100%;
  height: 100%;
  margin-bottom: 40px;
  .each-line {
    display: flex;
    justify-content: space-between;
    padding-right: 125px;
    ::v-deep .el-input {
      width: 250px;
    }
  }
}
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
    .left-title {
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
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: none;
      }
      &::-webkit-scrollbar-thumb {
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
  ::v-deep .el-dialog {
    margin-top: 250px !important;
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