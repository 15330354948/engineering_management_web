<template>
  <div class="mpeople-container">
    <el-form
      :model="mPeopleForm"
      :rules="rules"
      ref="mPeopleForm"
      label-width="100px"
    >
      <div class="each-line">
        <el-form-item label="审批人员" prop="approvers">
          <el-select disabled clearable v-model="mPeopleForm.approvalCo">
            <el-option label="项目一" value="shanghai"></el-option>
            <el-option label="项目二" value="beijing"></el-option>
          </el-select>
          <el-select clearable v-model="mPeopleForm.approvers" placeholder="请选择审批人员">
            <el-option label="项目一" value="shanghai"></el-option>
            <el-option label="项目二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="each-line">
        <el-form-item label="维护人员" prop="maintPersonnel">
          <el-select clearable v-model="mPeopleForm.maintPersonnel" placeholder="请选择维护人员">
            <el-option label="项目一" value="shanghai"></el-option>
            <el-option label="项目二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "mPeople",
    data() {
      return {
        // 人员表单
        mPeopleForm: {
          // 禁选项
          approvalCo: "圣元演示",
          // 审批人员
          approvers: "",
          // 维护人员
          maintPersonnel: ""
        },
        rules: {
          approvers: [
            { required: true, message: '请选择审核人员', trigger: 'change' }
          ],
          maintPersonnel: [
            { required: true, message: '请选择维护人员', trigger: 'change' }
          ]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.mpeople-container {
  width: 100%;
  height: 100%;
  .each-line {
    width: 100%;
  }
  ::v-deep .el-form-item__label {
    padding: 0;
  }
  ::v-deep .el-form-item__content   {
    margin-left: 120px !important;
    .el-select {
      margin-bottom: 10px;
    }
  }
  ::v-deep .el-form-item {
    flex: 1;
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