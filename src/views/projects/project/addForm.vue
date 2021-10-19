<template>
  <div>
    <div v-if="step == 0">
      <el-form :model="addForm" ref="addForm" label-width="120px" :rules="rules">
        <el-form-item label="项目参与方" prop="stepValue">
          <el-select v-model="addForm.stepValue" @change="handelChange" multiple placeholder="请选择参与方" id="selects"
            v-defaultSelect="[addForm.stepValue,stepOption,'value','disabled',true]">
            <el-option v-for="item in stepOption" :key="item.value" :label="item.label" :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nextBtn">下一步</el-button>
      </div>
    </div>
    <div v-if="step == 1">
      <el-button type="primary" @click="step=0">上一步</el-button>
      <el-tabs v-model="activeName">
        <el-tab-pane label="项目信息" name="first">
          <el-form :model="addForm" ref="addForm" label-width="120px" :rules="rules">
            <h3>项目概况</h3>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="项目名称" prop="projectName">
                  <el-input v-model="addForm.projectName" placeholder="请输入项目名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目编号" prop="projectCode">
                  <el-input v-model="addForm.projectCode" placeholder="请输入编码名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属标段" prop="bidSection">
                  <el-select v-model="addForm.bidSection" placeholder="请选择所属标段" clearable size="small"
                    style="width:100%">
                    <el-option v-for="dict in bidSectionOptions" :key="dict.dictValue" :label="dict.dictLabel"
                      :value="dict.dictValue" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建设期次" prop="period">
                  <el-select v-model="addForm.period" placeholder="请选择创建期次" clearable size="small" style="width:100%">
                    <el-option v-for="dict in periodOptions" :key="dict.dictValue" :label="dict.dictLabel"
                      :value="dict.dictValue" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目地址" prop="projectAddress">
                  <el-cascader style="width:40%" v-model="addForm.projectAddress" :options="areaOptions"
                    :props="{ checkStrictly: true, value: 'id'}" clearable></el-cascader>
                  <el-input style="width:55%;margin-left: 10px" v-model="addForm.projectAddress1" placeholder="详细地址" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经纬度" prop="LongAndLatitude">
                  <el-input v-model="addForm.LongAndLatitude" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备案号" prop="record">
                  <el-input v-model="addForm.record" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>

            <h3>项目配置</h3>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="计划验收时间" prop="acceptanceTime">
                  <el-date-picker v-model="addForm.acceptanceTime" type="date" placeholder="选择日期" style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="计划归档时间" prop="filingTime">
                  <el-date-picker v-model="addForm.filingTime" type="date" placeholder="选择日期" style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="计划竣工时间" prop="completionTime">
                  <el-date-picker v-model="addForm.completionTime" type="date" placeholder="选择日期" style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="考核模板" prop="assessmentId">
                  <el-select v-model="addForm.assessmentId" multiple placeholder="请选择考核模板" style="width:100%">
                    <el-option v-for="item in assessOption" :key="item.dictValue" :label="item.dictLabel"
                      :value="item.dictValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联水印" prop="watermarkId">
                  <el-select v-model="addForm.watermarkId" multiple placeholder="请选择关联水印" style="width:100%">
                    <el-option v-for="item in bidSectionOptions" :key="item.dictValue" :label="item.dictLabel"
                      :value="item.dictValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目状态" prop="projectType">
                  <el-input v-model="addForm.projectType" placeholder="系统自动生成" disabled />
                </el-form-item>
              </el-col>
            </el-row>

            <div v-if="addForm.stepValue.indexOf('0')!= -1">
              <h3>施工方</h3>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="单位名称" prop="constructionName">
                    <el-select v-model="addForm.constructionName" multiple placeholder="请选择单位名称" style="width:100%">
                      <el-option v-for="item in bidSectionOptions" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位负责人" prop="constructionUser">
                    <el-input v-model="addForm.constructionUser" placeholder="选择单位后自动获取" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系方式" prop="constructionPhone">
                    <el-input v-model="addForm.constructionPhone" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="监督人员" prop="constructionSupervise">
                    <el-input v-model="addForm.constructionSupervise" placeholder="分配后自动获取" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div v-if="addForm.stepValue.indexOf('1')!= -1">
              <h3>监理方</h3>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="单位名称" prop="supervisorName">
                    <el-select v-model="addForm.supervisorName" multiple placeholder="请选择单位名称" style="width:100%">
                      <el-option v-for="item in bidSectionOptions" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位负责人" prop="supervisorUser">
                    <el-input v-model="addForm.supervisorUser" placeholder="选择单位后自动获取" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系方式" prop="supervisorPhone">
                    <el-input v-model="addForm.supervisorPhone" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="监督人员" prop="supervisorProctor">
                    <el-input v-model="addForm.supervisorProctor" placeholder="分配后自动获取" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div v-if="addForm.stepValue.indexOf('2')!= -1">
              <h3>业主方</h3>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="单位名称" prop="ownerName">
                    <el-select v-model="addForm.ownerName" multiple placeholder="请选择单位名称" style="width:100%">
                      <el-option v-for="item in bidSectionOptions" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位负责人" prop="ownerUser">
                    <el-input v-model="addForm.ownerUser" placeholder="选择单位后自动获取" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系方式" prop="ownerPhone">
                    <el-input v-model="addForm.ownerPhone" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="监督人员" prop="ownerSupervise">
                    <el-input v-model="addForm.ownerSupervise" placeholder="分配后自动获取" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>


            <div v-if="addForm.stepValue.indexOf('3')!= -1">
              <h3>设计方</h3>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="单位名称" prop="designName">
                    <el-select v-model="addForm.designName" multiple placeholder="请选择单位名称" style="width:100%">
                      <el-option v-for="item in companyOption" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位负责人" prop="designUser">
                    <el-input v-model="addForm.designUser" placeholder="选择单位后自动获取" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系方式" prop="designPhone">
                    <el-input v-model="addForm.designPhone" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="监督人员" prop="designSupervise">
                    <el-input v-model="addForm.designSupervise" placeholder="分配后自动获取" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <h3>其他</h3>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="项目概况" prop="projectSurvey">
                  <el-input v-model="addForm.projectSurvey" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目措施" prop="projectMeasures">
                  <el-input v-model="addForm.projectMeasures" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remarks">
                  <el-input v-model="addForm.remarks" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总质评分" prop="score">
                  <el-input v-model="addForm.score" placeholder="系统自动生成" disabled />
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>

        </el-tab-pane>
      </el-tabs>


      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    defaultSelect
  } from './directive';
  import {
    getArea,
    addProject
  } from "@/api/projects/project";
  export default {
    directives: {
      defaultSelect
    },
    data() {
      return {
        activeName: 'first',
        rules: {
          stepValue: [{
            required: true,
            message: "项目参与方不能为空",
            trigger: "blur"
          }],
          projectName: [{
            required: true,
            message: "项目名称不能为空",
            trigger: "blur"
          }],
          bidSection: [{
            required: true,
            message: "所属标段不能为空",
            trigger: "blur"
          }],
          period: [{
            required: true,
            message: "建设期次不能为空",
            trigger: "blur"
          }],
          projectAddress: [{
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
          assessmentId: [{
            required: true,
            message: "考核模板不能为空",
            trigger: "blur"
          }],
          watermarkId: [{
            required: true,
            message: "关联水印不能为空",
            trigger: "blur"
          }],
          constructionName: [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
          supervisorName: [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
          ownerName: [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
          designName: [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
        },

        addForm: {
          stepValue: [],
        },
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
        // 建设期次
        periodOptions: [],
        // 所属标段
        bidSectionOptions: [],
        // 考核模板
        assessOption: [],
        // 单位名称
        companyOption: [],
        // 施工方单位
        constructionOption: [],
        // 监理方单位
        supervisorOption: [],
        // 业主方单位
        ownerNameOption: []
      }
    },
    created() {
      this.addForm.stepValue.push(this.stepOption[0].value);
      this.getAreaList();
      this.getDicts("cqndt_period").then(response => {
        this.periodOptions = response.data;
      });
      this.getDicts("cqndt_bid_section").then(response => {
        this.bidSectionOptions = response.data;
      });
      this.getDicts("cqndt_assessment_type").then(response => {
        this.assessOption = response.data;
      });
    },
    methods: {
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.$set(this.addForm, 'provinceCode', this.addForm.projectAddress[0])
            this.$set(this.addForm, 'cityCode', this.addForm.projectAddress[1])
            this.$set(this.addForm, 'countyCode', this.addForm.projectAddress[2])
            this.addForm.assessmentId = this.addForm.assessmentId.join()
            this.addForm.constructionName = this.addForm.constructionName.join()
            this.addForm.watermarkId = this.addForm.watermarkId.join()
            delete this.addForm.stepValue
            if (this.addForm.projectId != undefined) {
              updateProject(this.addForm).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addProject(this.addForm).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      getAreaList() {
        getArea().then(res => {
          this.areaOptions = res.data;
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
        //   projectName: undefined,
        // };
        // this.resetForm("addForm");
        this.addForm.stepValue = []
        this.addForm.stepValue.push(this.stepOption[0].value)
        this.step = 0
      },
      nextBtn() {
        this.step = 1
      },
    }
  }

</script>

<style lang="scss" scoped>
  .el-tabs__content {
    height: 600px;
    overflow-y: scroll;
  }

</style>
