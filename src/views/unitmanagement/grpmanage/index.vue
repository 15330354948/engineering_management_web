<template>
  <div class="unitmanagement-container">
    <div class="left">
      <div class="left-title">
        {{leftTitle}}
      </div>
      <div class="search-panel">
        <el-input
          placeholder="请输入单位名称"
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
                placeholder="请输入分组名称"
                v-model="searchForm.name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 使用该组件获取点击通知 -->
        <TableSearch :pageSign="pageSign" :hideOpt="['Import', 'Export']"></TableSearch>
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
          <el-table-column prop="groupName" label="分组名称" width="300">
          </el-table-column>
          <el-table-column prop="nickNames" label="人员" width="300">
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="300">
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
        <Pagination
          @pagination="handlePagination"
          :total="page.total"
          :limit="page.limit"
        ></Pagination>
      </div>
    </div>
    <!-- 新增分组 -->
      <el-dialog
        :title="'新增分组'"
        :visible.sync="newGrp"
        :width="'40%'"
        :fullscreen="fullScreen"
      >
        <div slot="title" style="" class="header-title">
          新增分组
          <div
            @click="() => (fullScreen = !fullScreen)"
            class="fullscreen"
          ></div>
        </div>

        <!-- 内容 -->
        <div class="content-panel">
            <el-form
              :model="newGrpForm"
              :rules="newGrpFormRules"
              ref="newGrpForm"
              label-width="100px"
            >
                <el-form-item label="分组名称" prop="deptName">
                  <el-input v-model="newGrpForm.deptName"></el-input>
                </el-form-item>
                <el-form-item label="分配人员" prop="assignPersonnel">
                <el-select style="width: 100%" v-model="newGrpForm.assignPersonnel" multiple placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  v-model="newGrpForm.remark"
                ></el-input>
              </el-form-item>
            </el-form>
        </div>

        <div class="slot-container">
          <slot></slot>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="newGrp = false">取 消</el-button>
          <el-button type="primary" @click="newGrpFunc">保 存</el-button>
        </span>
      </el-dialog>
    <!-- 修改分组 -->
      <el-dialog
        :title="'修改分组'"
        :visible.sync="editDialog"
        :width="'40%'"
        :fullscreen="fullScreen"
      >
        <div slot="title" style="" class="header-title">
          修改分组
          <div
            @click="() => (fullScreen = !fullScreen)"
            class="fullscreen"
          ></div>
        </div>

        <!-- 内容 -->
        <div class="content-panel">
            <el-form
              :model="EditGrpForm"
              :rules="EditGrpFormRules"
              ref="newGrpForm"
              label-width="100px"
            >
                <el-form-item label="分组名称" prop="groupName">
                  <el-input v-model="EditGrpForm.groupName"></el-input>
                </el-form-item>
                <el-form-item label="分配人员" prop="assignPersonnel">
                <el-select style="width: 100%" v-model="EditGrpForm.assignPersonnel" multiple placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  v-model="EditGrpForm.remark"
                ></el-input>
              </el-form-item>
            </el-form>
        </div>

        <div class="slot-container">
          <slot></slot>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="modifyAndSave">保 存</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
  import TableSearch from "@/components/TableSearch";
  import Popups from "@/views/maintenance/components/popups/index.vue"
  import {
    grpLst,
    lstOfUnits,
    assignPersonnel,
    newGrpApi,
    updateGrpApi,
    deleteGrpApi
  } from '@/api/grpmanage/index.js'
  export default {
    name: 'grpmanage',
    components: {
      TableSearch,
      Popups
    },
    data() {
      return {
        // 上一次点击的名字
        lastActivatedName: '',
              fullScreen: false,
        // 当前激活选项索引
        currentIndex: -1,
        // 页面标志
        pageSign: 'addrbook',
        // 标题
        leftTitle: '所属单位',
        // 搜索的值
        searchValue: '',
        page: {
        total: 0,
        limit: 10,
      },
      newGrpForm: {},
      query: {
        pageNum: 1,
        pageSize: 10,
      },
        // 左栏的数据列表
        dataList: [],
        // 基础对比库
        oldDataList: [],
        // 表格中数据的长度
        total: 0,
        // 表格当前选中项
        selectedItem: [],
        currentlySelectedUnit: '',
        newGrp: false,
        editDialog: false,
        // 弹窗相关
        dialogInfo: {
          // dialog 标题
          dialogTitle: "",
          // dialog 显示隐藏
          dialogShow: false,
          // dialog 宽度
          dialogWidth: ""
        },
        EditGrpForm: {},
        searchForm: {
          name: ''
        },
        options: [{
          label: '测试1',
          value: '测试1'
        }, {
          label: '测试2',
          value: '测试2'
        }],
        // 表格数据
      tableData: [],
        newGrpFormRules: {
          deptName: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
          assignPersonnel: [{ required: true, message: "请选择分配人员", trigger: "blur" }],
        },
        EditGrpFormRules: {
          deptName: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
          assignPersonnel: [{ required: true, message: "请选择分配人员", trigger: "blur" }],
        },
      }
    },
    methods: {
      // 保存
      async modifyAndSave() {
        this.$refs.newGrpForm.validate(async (valid) => {
          if(valid) { 
            this.EditGrpForm.userIds = this.EditGrpForm.assignPersonnel.join(',')
            let data = {
                deptId: this.EditGrpForm.deptId,
                groupName: this.EditGrpForm.deptName,
                remark: this.EditGrpForm.remark,
                userIds: this.EditGrpForm.assignPersonnel.join(','),
                groupId: this.EditGrpForm.groupId
              }
            console.log(data)
            await updateGrpApi(data)
            this.editDialog = false
            this.getList()
          } else {
            return false
          }
        })
      },
      // 修改分组
      async handleEdit(row) {
        console.log(row)
        let res = []
        if(row.userIds !== '') {
          if(row.userIds.indexOf(',') !== -1) {
            res = row.userIds.split(',').map((item) => {
            return item*1
          })
          } else {
            res.push(row.userIds*1)
          }
        }
       
        this.editDialog = true  
        this.EditGrpForm = JSON.parse(JSON.stringify(row))
        const result = await assignPersonnel({deptId: row.deptId})
        
        this.options = result.rows.map((item) => {
            item.label = item.nickName
            item.value = item.userId
            return item
          })
        this.$set(this.EditGrpForm, 'assignPersonnel', res)
        console.log("asdasd",this.EditGrpForm)
      },
      // 查询分组列表
      async getList(query) {
        const result = await grpLst(query)
        console.log('result', result)
        this.page.total = result.total;
        this.tableData = result.rows.map((item) => {
          item.nickNames = item.sysUsers.map((item) => {
            return item.nickName
          }).join('，')
          return item
        })
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
        }).then(async () => {
          // 执行删除逻辑
          console.log("要删除的信息", data)
          if(config) {
            await deleteGrpApi(data.map((item) => item.groupId).join(','))
          } else {
            await deleteGrpApi(data.groupId.toString())
          }
          this.msgSuccess('删除成功')
           setTimeout(() => {
            this.getList();
          }, 100);
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
          let query = Object.assign(this.query, { deptId: item.deptId });
           this.currentlySelectedUnit = item.deptId
          this.getList(query);
        } else if(this.lastActivatedName!=='' && this.lastActivatedName !== item.name) { 
          this.currentIndex = index
          this.lastActivatedName = item.name
          // 待对接接口，刷新界面，根据name重新请求
          let query = Object.assign(this.query, { deptId: item.deptId });
           this.currentlySelectedUnit = item.deptId
          this.getList(query);
        } else {
          this.currentIndex = -1
          this.lastActivatedName = ''
          // 待对接接口，刷新界面，请求所有数据
          delete this.query.parentId;
          this.currentlySelectedUnit = ""
          this.getList(this.query);
        }
      },
      async newGrpFunc() {
        this.$refs.newGrpForm.validate(async (valid) => {
        if(valid) {
          console.log(this.newGrpForm)
          let data = {
            deptId: this.currentlySelectedUnit,
            groupName: this.newGrpForm.deptName,
            remark: this.newGrpForm.remark,
            userIds: this.newGrpForm.assignPersonnel.join(',')
          }
          const result = await newGrpApi(data)
          this.newGrp = false
          this.getList()
        } else {
          return false
        }
      })
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
    async created() {
      // 单位列表
      const result = await lstOfUnits()
      // mock
      this.oldDataList = this.dataList = result.rows.map((item) => {
        item.name = item.deptName
        return item
      })
      this.getList(this.query);
      this.$bus
      .$off(`${this.pageSign}SearchClick`)
      .$on(`${this.pageSign}SearchClick`, () => {
        console.log("已监听到搜索");
        console.log(this.searchForm);
        let query = {};
        if(this.searchForm.name !== "") {
          query.groupName = this.searchForm.name;
        }
        query = Object.assign(this.query, query)
        this.getList(query);
      });
    this.$bus
      .$off(`${this.pageSign}ResetClick`)
      .$on(`${this.pageSign}ResetClick`, () => {
        console.log("已监听到重置");
        this.searchForm = {};
        delete this.query.groupName
        this.getList(this.query);
      });
    this.$bus
      .$off(`${this.pageSign}CreateClick`)
      .$on(`${this.pageSign}CreateClick`, async () => {
        console.log("已监听到创建");
         if(this.currentlySelectedUnit!=='') {
          // 清除传入
          // const {data} = await getCatg()
          // this.creAnOrganizationForm.catg = data
          // this.creAnOrganizationForm.currentlyCreatedCatg = this.currentlySelectedUnit
          const result = await assignPersonnel({deptId: this.currentlySelectedUnit})
          this.options = result.rows.map((item) => {
            item.label = item.nickName
            item.value = item.userId
            return item
          })
          this.newGrpForm = {}
          this.newGrp = true
        } else {
          this.msgWarn("请先在左侧选择一项参与方")
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
  .content-panel {
    width: 100%;
    height: 100%;
    margin-bottom: 40px;
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