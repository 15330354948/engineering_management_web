<template>
  <div>
    <el-form
      :model="copytemplateForm"
      :rules="rules"
      ref="copytemplateForm"
      label-width="100px"
    >
    <el-form-item label="模板名称" prop="templateName">
      <el-input autosize placeholder="请输入复制后的巡检项目名称" v-model="copytemplateForm.templateName"></el-input>
    </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'CopyTemplate',
    props: ['templateName'],
    data() {
      return {
        copytemplateForm: {},
        rules: {
          templateName: [
            { required: true, message: '请输入复制后的巡检项目名称', trigger: 'change' }
          ],
        }
      }
    },
    watch: {
      templateName: {
        handler(e) {
          this.copytemplateForm = {
            templateName: e
          }
          console.log("hh",this.copytemplateForm)
        },
        immediate: true
      }
    },
    created() {
      this.$bus
      .$off(`dosave`)
      .$on(`dosave`, () => {
        this.$refs['copytemplateForm'].validate((valid) => {
          if (valid) {
            this.formInvalid = true
          } else {
            this.formInvalid = false
            return false;
          }
        });
      });
      this.$bus
      .$off(`dclose`)
      .$on(`dclose`, () => {
        this.copytemplateForm = {}
      });
    }
  }
</script>

<style lang="scss" scoped>

</style>