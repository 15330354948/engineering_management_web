<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="20">
        <el-form :model="queryParams" ref="queryParams" :inline="true" label-width="85px">
          <el-form-item prop="contractName">
            <el-input v-model="queryParams.contractName" placeholder="请输入合同名称" clearable size="small" />
          </el-form-item>
          <el-form-item prop="time">
            <el-date-picker v-model="queryParams.time" type="datetimerange" range-separator="至"
              start-placeholder="付款开始日期" end-placeholder="付款结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
            <el-button type="primary" @click="handleAdd">创建</el-button>
            <el-button type="primary" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" border :data="informationList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="合同编号" align="center" prop="contractNo" />
          <el-table-column label="合同名称" align="center" prop="contractName" />
          <el-table-column label="合同金额" align="center" prop="contractAmount" />
          <el-table-column label="变更金额" align="center" prop="changeAmount" />
          <el-table-column label="已付金额" align="center" prop="result" />
          <el-table-column label="待付金额" align="center" prop="result" />
          <el-table-column label="付款次数" align="center" prop="result" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
          @pagination="getList" />

      </el-col>
      <el-col :span="4">
        <div class="rightList">
          <div class="group" v-for="(item,index) in rightList" :key="index">
            <span class="num">{{item.num}}</span>
            <span class="name">{{item.name}}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form :model="form" :rules="rules" ref="form" label-width="85px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item prop="contractName" label="合同名称">
              <el-input v-model="form.contractName" placeholder="请输入合同名称" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="contractNo" label="合同编号">
              <el-input v-model="form.contractNo" placeholder="请输入合同编号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="contractAmount" label="合同金额">
              <el-input v-model="form.contractAmount" placeholder="请输入合同金额" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="记录">
              <el-button type="text" @click="handleAddDetails">添加</el-button>
            </el-form-item>
          </el-col>


          <el-table :data="tableList" border ref="tb" :row-class-name="rowClassName">
            <el-table-column label="序号" align="center" prop="xh" width="50"></el-table-column>
            <el-table-column label="更变金额" align="center" prop="changeAmount" width="240">
              <template slot-scope="scope">
                <div v-show="scope.row.isSet">
                  <el-row :gutter="24">
                    <el-col :span="10">
                      <el-select v-model="tableList[scope.row.xh-1].symbol" placeholder=" ">
                        <el-option v-for="dict in changeOptions" :key="dict.value" :label="dict.label"
                          :value="dict.value" />
                      </el-select>
                    </el-col>
                    <el-col :span="14">
                      <el-input v-model="tableList[scope.row.xh-1].changeAmount" />
                    </el-col>
                  </el-row>
                </div>
                <div v-show="!scope.row.isSet">
                  {{tableList[scope.row.xh-1].symbol}}{{tableList[scope.row.xh-1].changeAmount}}
                  </div>
              </template>
            </el-table-column>
            <el-table-column label="付款日期" align="center" prop="time" width="260">
              <template slot-scope="scope">
                <div v-show="scope.row.isSet">
                  <el-date-picker v-model="tableList[scope.row.xh-1].time" type="date" placeholder="选择日期">
                  </el-date-picker>
                </div>
                <div v-show="!scope.row.isSet">{{tableList[scope.row.xh-1].time}}</div>
              </template>
            </el-table-column>
            <el-table-column label="付款金额" align="center" prop="payment" width="260">
              <template slot-scope="scope">

                <el-input v-show="scope.row.isSet" v-model="tableList[scope.row.xh-1].payment"
                  placeholder="请输入小于或等于0的金额" />
                <div v-show="!scope.row.isSet">{{tableList[scope.row.xh-1].payment}}</div>
              </template>
            </el-table-column>
            <el-table-column label="附件" align="center" prop="enclosure" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isSet">
                  <el-upload class="upload-demo" v-model="tableList[scope.row.xh-1].enclosure"
                    action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
                    :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button size="small" type="text">点击上传</el-button>
                  </el-upload>
                </div>
                <div v-show="!scope.row.isSet" v-text="fileList.length < 1 ? '暂无' : fileList"></div>
              </template>
            </el-table-column>

            <el-table-column label="备注" align="center" prop="remarks" width="260">
              <template slot-scope="scope">
                <div v-show="scope.row.isSet">
                  <el-input v-model="tableList[scope.row.xh-1].remarks" />
                </div>
                <div v-show="!scope.row.isSet">{{tableList[scope.row.xh-1].remarks}}</div>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row, true)">
                  {{scope.row.isSet?'保存':"修改"}}</el-button>
                <el-button size="small" type="text" @click="handleDelete(scope.row.xh-1, scope.row, false)">
                  {{scope.row.isSet?'取消':"删除"}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tabTb: true,
        fileList: [],
        tableList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          ProjectCode: undefined,
          ProjectName: undefined,
          status: undefined
        },
        form: {},
        changeOptions: [{
          value: '+',
          label: '+'
        }, {
          value: '-',
          label: '-'
        }],
        loading: false,
        informationList: [],
        total: 0,
        ids: '',
        open: false,
        title: "",
        rightList: [{
          name: "累计合同金额",
          num: 0
        }, {
          name: "累计支付金额",
          num: 0
        }, {
          name: "累计更变金额",
          num: 0
        }, {
          name: "累计待付金额",
          num: 0
        }],
        rules: {
          contractName: [{
            required: true,
            message: "合同名称不能为空",
            trigger: "blur"
          }],
          contractNo: [{
            required: true,
            message: "合同编号不能为空",
            trigger: "blur"
          }],
          contractAmount: [{
            required: true,
            message: "合同金额不能为空",
            trigger: "blur"
          }],
          tabRowIndex: null,
          tabColumnIndex: null,
          // 选中行
          sel: null,
        }
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleDelete(index, row, cg) {
        if (!row.isSet && !cg) {
          this.$confirm('您确定要删除该数据?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function () {}).then(() => {
            this.tableList.splice(index, 1)
          })
        }
      },
      handleEdit(index, row) {
        for (let i of this.tableList) {
          if (!i.changeAmount) return this.$message.warning("请填写变更金额");
        }
        row.isSet = !row.isSet
      },
      rowClassName({
        row,
        rowIndex
      }) {
        row.xh = rowIndex + 1;
      },
      readMasterUser() {
        this.tableList.map(i => {
          i.isSet = false;
          return i
        })
      },
      handleAddDetails() {
        for (let i of this.tableList) {
          if (!i.changeAmount) return this.$message.warning("请填写变更金额");
          if (i.isSet) return this.$message.warning("请先保存当前编辑项");
        }
        let obj = {
          symbol: '+',
          changeAmount: '',
          time: '',
          payment: '',
          enclosure: '',
          remarks: '',
          isSet: true,

        };
        this.tableList.push(obj);
      },
      getList() {},
      handleQuery() {},
      resetQuery() {
        this.resetForm("queryParams");
        this.handleQuery();
      },
      handleAdd() {
        this.title = '投资管理新增'
        this.open = true;
      },
      handleExport() {},
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ProjectId)
      },
      submitForm(){},
      cancel(){
        this.resetForm("form");
        this.tableList = []
        this.open = false;
      },
    }
  }

</script>

<style lang="scss" scoped>
  .rightList {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
  }

  .rightList .group {
    width: 100px;
    margin-left: 10px;
    background: #999;
    border-radius: 10px;
    color: #fff;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin-top: 20px;
  }

  .rightList .num {
    font-size: 20px;
  }

</style>
