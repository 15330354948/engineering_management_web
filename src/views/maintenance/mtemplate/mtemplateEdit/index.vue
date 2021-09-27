<template>
  <div class="mtemplateEditForm-container">
    <el-form
      :model="mtemplateEditForm"
      :rules="rules"
      ref="mtemplateEditForm"
      label-width="100px"
    >
      <div class="each-line">
        <el-form-item label="维护模板名称" prop="templateName">
          <el-input autosize placeholder="请输入维护模板名称" v-model="mtemplateEditForm.templateName"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select clearable @change="handleProjectSelect" v-model="mtemplateEditForm.deviceType" placeholder="请选择设备类型">
            <el-option label="项目一" value="shanghai"></el-option>
            <el-option label="项目二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="each-line">
        <el-form-item label="计划完成日期" prop="acceptanceTm">
          <el-date-picker
            v-model="mtemplateEditForm.acceptanceTm"
            type="date"
            placeholder="请选择验收时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="维护单位" prop="maintUnit">
          <el-select clearable v-model="mtemplateEditForm.maintUnit" placeholder="请选择维护单位">
            <el-option label="单位一" value="shanghai"></el-option>
            <el-option label="单位二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </div>
      
      <div class="each-line">
        <el-form-item label="任务" prop="task" v-model="mtemplateEditForm.task">
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
              label="子项目名称"
              width="350">
              <template slot-scope="scope">
                <!-- 通过index来区分每个块的数据 -->
                <el-select @change="handleSubProjectSelect($event, scope.row)" clearable :disabled="subproDisabled" v-model="mtemplateEditForm['subProject'+scope.row.index]" placeholder="请选择子项目">
                  <el-option label="子项目1" value="shanghai"></el-option>
                  <el-option label="子项目2" value="beijing"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="测点名称"
              width="350">
               <template slot-scope="scope">
                <!-- 通过index来区分每个块的数据，以及是否禁用的控制 -->
                <el-select @change="handleMptSelect($event, scope.row)" clearable :disabled="!disableList[scope.row.index]" v-model="mtemplateEditForm['mPt'+scope.row.index]" placeholder="请选择测点">
                  <el-option label="测点1" value="shanghai"></el-option>
                  <el-option label="测点2" value="beijing"></el-option>
                </el-select>
              </template>
            </el-table-column>
           <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
              <el-button :disabled="subproDisabled" @click="addRow(scope.row)" type="text" icon="el-icon-plus">新增</el-button>
              <el-button :disabled="subproDisabled" v-if="tableData.length > 1" @click="deleteRow(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
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
  name: "mtemplateEditForm",
  methods: {
    // 项目选择
    handleProjectSelect(e) {
      // !== '' 说明选中
      if (e !== '') {
        this.subproDisabled = false
      } else {
        this.subproDisabled = true
        this.tableData.length = 1
        this.mtemplateEditForm = {}
        this.disableList = {}
      }
    },
    // 子项目选择
    handleSubProjectSelect(e,row) {
      // !== '' 说明选中
      if (e !== '') {
        // 开放一个禁用列表
        this.disableList[row.index] = true
      } else {
        // 开放一个禁用列表
        this.disableList[row.index] = false
      }
    },
    // 测点选中
    handleMptSelect(e,row) {
      if (e !== '') {
        this.mtemplateEditForm['mPt' + row.index] = e
      } else {
        
      }
    },
    // 新增一行
    addRow(row) {
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
    // 初始化数据
    initData() {
      let index = 1
      for(let key in this.mtemplateEditForm) {
        if(key.startsWith('subProject')) {
          this.subproDisabled = false
          if(index !== 1) {
            this.disableList[index] = true
            this.tableData.push({index})
          } else {
            this.disableList["1"] = true
          }
          index++
        }
      }
    }
  },
  props: {
    mtemplateEdit: {}
  },
  mounted() {
    // 初始化数据
    this.initData()
  },
  created() {
    this.$bus
    .$off(`dosave`)
    .$on(`dosave`, () => {
      for(let key in this.mtemplateEditForm) {
        if(key.startsWith('subProject')) {
          this.mtemplateEditForm.task = true
        }
      }
      this.$refs['mtemplateEditForm'].validate((valid) => {
        if (valid) {
          this.formInvalid = true
        } else {
          this.formInvalid = false
          return false;
        }
      });
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
      // 子项目及禁用状态
      subproDisabled: true,
      // 测点名称禁用状态
      mPtDisabled: true,
      // 测试表数据
      tableData: [
        {index:1}
      ],
      // 组件内部变量
      mtemplateEditForm: {
        // 模板名称
        templateName: "",
        // 设备类型
        deviceType: "",
        // 任务名称
        taskName: "",
        // 项目名称
        projectName: "",
        // 验收时间
        acceptanceTm: "",
        // 维护单位
        maintUnit: "",
        //任务
        task: "",
        // 备注
        remark: ""
      },
      ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
      },
      rules: {
        templateName: [
          { required: true, message: '请输入维护模板名称', trigger: 'change' }
        ],
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        acceptanceTm: [
          { type: 'date', required: true, message: '请选择计划完成时间', trigger: 'change' }
        ],
        maintUnit: [
          { required: true, message: '请选择维护单位', trigger: 'change' }
        ],
        task: [
          { required: true, message: '请选择对应任务', trigger: 'blur' }
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
  }
  ::v-deep .el-form-item__label {
    padding: 0;
  }
  ::v-deep .el-form-item__content {
    display: flex;
    margin-left: 120px !important;
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