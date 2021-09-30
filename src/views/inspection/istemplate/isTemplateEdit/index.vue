<template>
  <div class="mtemplateEditForm-container">
    <el-form
      :model="mtemplateEditForm"
      :rules="rules"
      ref="mtemplateEditForm"
      label-width="100px"
    >
      <div class="each-line">
        <el-form-item label="巡检项目模板名称" prop="templateName">
          <el-input autosize placeholder="请输入巡检项目模板名称" v-model="mtemplateEditForm.templateName"></el-input>
        </el-form-item>
      </div>
      
      <div class="each-line special-line">
        <el-form-item label="巡检项">
          <el-button @click="addRow()" type="text">添加项</el-button>
          <el-table
            :data="tableData"
            border
            highlight-current-row
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              label="巡检项"
              width="350">
              <template slot-scope="scope">
                <!-- 通过index来区分每个块的数据 -->
                <el-input autosize v-model="mtemplateEditForm['subProject'+scope.row.index]"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="巡检要求"
              width="350">
               <template slot-scope="scope">
                <!-- 通过index来区分每个块的数据，以及是否禁用的控制 -->
                <el-input autosize v-model="mtemplateEditForm['mPt'+scope.row.index]"></el-input>
              </template>
            </el-table-column>
           <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
              <el-button @click="deleteRow(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
          </el-table>
        </el-form-item>
      </div>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="mtemplateEditForm.remark"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "isTemplateEdit",
  methods: {
    // 新增一行
    addRow() {
      this.tableData.push({
        index: this.tableData.length + 1
      })
    },
    // 减少一行
    deleteRow(row) {
      this.tableData.splice(row.index-1,1)
      this.tableData = this.tableData.map((item,index) => {
        if(item.index-1 > index) {
          return {
            index: index + 1
          }
        } else {
          return item
        }
      })
      // 处理禁用权限
      delete this.disableList[row.index]
      delete this.mtemplateEditForm['mPt'+row.index]
      delete this.mtemplateEditForm['subProject'+row.index]
      for(let key in this.disableList) {
        if ((key * 1) > row.index) {
          this.disableList[key-1] = this.disableList[key]
        }
      }
      if(this.disableList[row.index+1]) {
        delete this.disableList[Object.entries(this.disableList).length]
      }
      this.objectDeal('mPt', row)
      this.objectDeal('subProject', row)
    },
    // 对象处理函数封装
    objectDeal(sign, row) {
      // 定义超过index值的list
      const signList = []
      delete this.mtemplateEditForm[sign + row.index]
      let mtemplateEditFormLength = 0
      for(let key in this.mtemplateEditForm) {
        if(key.startsWith(sign)) {
          mtemplateEditFormLength += 1
          let newKey = key.split(sign)
          if(newKey[1]*1 > row.index) {
            signList.push(newKey[1]*1)
            this.mtemplateEditForm[sign + (newKey[1]*1 - 1)] = this.mtemplateEditForm[sign + (newKey[1]*1)]
          }
        }
      }
      if(signList.length > 0) {
        let deleteOne = sign + signList.sort((a,b) => b-a)[0]
        delete this.mtemplateEditForm[deleteOne]
      }
    },
  },
  props: {
    mtemplateEdit: {}
  },
  mounted() {
    let index = 1
    for(let key in this.mtemplateEditForm) {
      if(key.startsWith('subProject')) {
        this.tableData.push({index})
        index++
      }
    }
  },
  created() {
    this.$bus
    .$off(`dosave`)
    .$on(`dosave`, () => {
      this.$refs['mtemplateEditForm'].validate((valid) => {
        if (valid) {
          let validArray = []
          let flag = true
          for(let key in this.mtemplateEditForm) {
            if(key.startsWith('subProject')) {
              validArray.push(key)
            }
          }
          for(let i=1; i<=validArray.length;i++) {
            if(!(this.mtemplateEditForm['subProject'+i] && this.mtemplateEditForm['mPt'+i])) {
              flag = false
              break
            }
          }
          if(validArray.length === 0) {
            flag = false
          }
          if(flag) {
            this.formInvalid = true
          } else {
            this.formInvalid = false
            this.msgError("巡检项步骤有误，请检查")
          }
        } else {
          this.formInvalid = false
          return false;
        }
      });
    });
    this.$bus
    .$off(`dclose`)
    .$on(`dclose`, () => {
      this.mtemplateEditForm = {}
    });
  },
  watch: {
    mtemplateEdit: {
      handler(val) {
        console.log(val)
        this.mtemplateEditForm = val
      },
      immediate: true
    }
  },
  data() {
    return {
      // 表单是否符合要求
      formInvalid: true,
      // 禁用列表
      disableList: {},
      // 测试表数据
      tableData: [
      ],
      // 组件内部变量
      mtemplateEditForm: {
        // 模板名称
        templateName: "",
        // 设备类型
        deviceType: "",
        // 备注
        remark: ""
      },
      rules: {
        templateName: [
          { required: true, message: '请输入维护模板名称', trigger: 'change' }
        ],
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ]
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mtemplateEditForm-container {
  width: 100%;
  height: 100%;
  .each-line {
    display: flex;
    justify-content: space-between;
    width: 100%;
    &.special-line {
      ::v-deep .el-form-item__content {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }
  ::v-deep .el-form-item__label {
    padding: 0;
    width: 150px !important;
  }
  ::v-deep .el-form-item__content {
    display: flex;
    margin-left: 170px !important;
  }
  ::v-deep .el-form-item {
    width: 100%;
  }
  ::v-deep .el-input__inner {
    width: 100%;
  }
  ::v-deep .el-date-editor {
    width: 100%;
  }
  ::v-deep .el-select {
    width: 100%;
  }
  ::v-deep .el-table__header tr,
    ::v-deep .el-table__header th {
      padding: 0;
  }
  ::v-deep .el-table__body tr,
    ::v-deep .el-table__body td {
      padding: 0;
  }
  ::v-deep .cell {
    padding: 5px 10px;
  }
}
</style>