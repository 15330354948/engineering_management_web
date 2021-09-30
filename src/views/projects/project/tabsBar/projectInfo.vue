<template>
  <div>
    <el-form :model="addForm" ref="addForm" label-width="120px" :rules="rules">
      <h3>项目概况</h3>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="ProjectName">
            <el-input v-model="addForm.ProjectName" placeholder="请输入项目名称" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目编号" prop="ProjectCode">
            <el-input v-model="addForm.ProjectCode" placeholder="请输入编码名称" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属标段" prop="section">
            <el-input v-model="addForm.section" placeholder="请输入内容" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建设期次" prop="construction">
            <el-input v-model="addForm.construction" placeholder="请输入内容" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目地址" prop="address">
            <el-cascader style="width:40%" v-model="addForm.address" :options="areaOptions"
              :props="{ checkStrictly: true }" clearable :disabled="btnType=='info'"></el-cascader>
            <el-input style="width:55%;margin-left: 10px" v-model="addForm.remark1" placeholder="详细地址"
              :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经纬度" prop="LongAndLatitude">
            <el-input v-model="addForm.LongAndLatitude" placeholder="请输入内容" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备案号" prop="record">
            <el-input v-model="addForm.record" placeholder="请输入内容" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
      </el-row>

      <h3>项目配置</h3>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="计划验收时间" prop="acceptanceTime">
            <el-date-picker v-model="addForm.acceptanceTime" type="date" placeholder="选择日期" style="width:100%" disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划归档时间" prop="filingTime">
            <el-date-picker v-model="addForm.filingTime" type="date" placeholder="选择日期" style="width:100%" disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划竣工时间" prop="completionTime">
            <el-date-picker v-model="addForm.completionTime" type="date" placeholder="选择日期" style="width:100%" disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考核模板" prop="assessModel">
            <el-select v-model="addForm.assessModel" multiple placeholder="请选择参与方" style="width:100%"
              :disabled="btnType=='info'">
              <el-option v-for="item in assessOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联水印" prop="watermark">
            <el-select v-model="addForm.watermark" multiple placeholder="请选择参与方" style="width:100%"
              :disabled="btnType=='info'">
              <el-option v-for="item in markOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目状态" prop="state">
            <el-input v-model="addForm.state" placeholder="系统自动生成" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <div>
        <h3>施工方</h3>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="单位名称" prop="companyName">
              <el-select v-model="addForm.companyName" multiple placeholder="请选择单位名称" style="width:100%" disabled>
                <el-option v-for="item in companyOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位负责人" prop="unitLeader">
              <el-input v-model="addForm.unitLeader" placeholder="选择单位后自动获取" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="addForm.phone" placeholder="请输入内容" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监督人员" prop="supervisor">
              <el-input v-model="addForm.supervisor" placeholder="分配后自动获取" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div>
        <h3>监理方</h3>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="单位名称" prop="companyName2">
              <el-select v-model="addForm.companyName2" multiple placeholder="请选择单位名称" style="width:100%" disabled>
                <el-option v-for="item in companyOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位负责人" prop="unitLeader2">
              <el-input v-model="addForm.unitLeader2" placeholder="选择单位后自动获取" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone2">
              <el-input v-model="addForm.phone2" placeholder="请输入内容" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监督人员" prop="supervisor2">
              <el-input v-model="addForm.supervisor2" placeholder="分配后自动获取" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div>
        <h3>业主方</h3>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="单位名称" prop="companyName3">
              <el-select v-model="addForm.companyName3" multiple placeholder="请选择单位名称" style="width:100%" disabled>
                <el-option v-for="item in companyOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位负责人" prop="unitLeader3">
              <el-input v-model="addForm.unitLeader3" placeholder="选择单位后自动获取" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone3">
              <el-input v-model="addForm.phone3" placeholder="请输入内容" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监督人员" prop="supervisor3">
              <el-input v-model="addForm.supervisor3" placeholder="分配后自动获取" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </div>


      <div>
        <h3>设计方</h3>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="单位名称" prop="companyName4">
              <el-select v-model="addForm.companyName4" multiple placeholder="请选择单位名称" style="width:100%" disabled>
                <el-option v-for="item in companyOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位负责人" prop="unitLeader4">
              <el-input v-model="addForm.unitLeader4" placeholder="选择单位后自动获取" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone4">
              <el-input v-model="addForm.phone4" placeholder="请输入内容" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监督人员" prop="supervisor4">
              <el-input v-model="addForm.supervisor4" placeholder="分配后自动获取" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <h3>其他</h3>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="项目概况" prop="survey">
            <el-input v-model="addForm.survey" placeholder="请输入内容" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目措施" prop="measures">
            <el-input v-model="addForm.measures" placeholder="请输入内容" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="addForm.remarks" placeholder="请输入内容" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总质评分" prop="score">
            <el-input v-model="addForm.score" placeholder="系统自动生成" disabled />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>


    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["btnType"],
    data() {
      return {
        rules: {
          ProjectName: [{
            required: true,
            message: "项目名称不能为空",
            trigger: "blur"
          }],
          section: [{
            required: true,
            message: "所属标段不能为空",
            trigger: "blur"
          }],
          construction: [{
            required: true,
            message: "建设期次不能为空",
            trigger: "blur"
          }],
          address: [{
            required: true,
            message: "项目地址不能为空",
            trigger: "blur"
          }],
          LongAndLatitude: [{
            required: true,
            message: "经纬度不能为空",
            trigger: "blur"
          }],
          acceptanceTime: [{
            required: true,
            message: "计划验收时间不能为空",
            trigger: "blur"
          }],
          filingTime: [{
            required: true,
            message: "计划归档时间不能为空",
            trigger: "blur"
          }],
          completionTime: [{
            required: true,
            message: "计划竣工时间不能为空",
            trigger: "blur"
          }],
          assessModel: [{
            required: true,
            message: "考核模板不能为空",
            trigger: "blur"
          }],
          watermark: [{
            required: true,
            message: "关联水印不能为空",
            trigger: "blur"
          }],
          companyName: [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
          companyName2: [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
          companyName3: [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
          companyName4: [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
        },
        addForm: {},
        addOpen: false,
        step: 0,
        stepOption: [{
          value: '0',
          label: '施工方',
          disabled: true
        }, {
          value: '1',
          label: '监理方'
        }, {
          value: '2',
          label: '业主方'
        }, {
          value: '3',
          label: '设计方'
        }],
        stepValue: [],
        // 项目地址
        areaOptions: [],
        // 关联水印配置
        markOption: [],
        // 考核模板
        assessOption: [],
        // 单位名称
        companyOption: [],
      }
    },
    methods: {
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // if (this.form.ProjectId != undefined) {
            //   updateProject(this.form).then(response => {
            //     this.msgSuccess("修改成功");
            //     this.open = false;
            //     this.getList();
            //   });
            // } else {
            //   addProject(this.form).then(response => {
            //     this.msgSuccess("新增成功");
            //     this.open = false;
            //     this.getList();
            //   });
            // }
          }
        });
      },
      handelChange(e) {
        console.log(e.indexOf('2'));
      },
      cancel() {
        this.$emit("closeDialog");
        this.reset();
      },
      reset() {
        // this.addForm = {
        //   ProjectName: undefined,
        // };   
        this.resetForm("addForm");
      },
      nextBtn() {
        this.step = 1
      },
    }
  }

</script>

<style lang="scss">

</style>
