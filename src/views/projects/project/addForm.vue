<template>
  <div>
    <div v-if="step == 0">
      <el-form :model="addForm" ref="addForm" label-width="120px" :rules="rules">
        <el-form-item label="项目参与方" prop="stepValue">
          <el-select v-model="addForm.stepValue" @change="handelChange" ref="stepValue" multiple placeholder="请选择参与方"
            id="selects" v-defaultSelect="[addForm.stepValue,companyType,'dictValue','disabled',true]">
            <el-option v-for="item in companyType" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"
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
      <el-button type="primary" @click="prevStep">上一步</el-button>
      <el-tabs v-model="activeName">
        <el-tab-pane label="项目信息" name="first">
          <el-form :model="addForm" ref="addForm" label-width="120px" :rules="rules">
            <h3>项目概况</h3>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="项目名称" prop="projectName">
                  <el-input v-model="addForm.projectName" clearable placeholder="请输入项目名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目编号" prop="projectCode">
                  <el-input v-model="addForm.projectCode" disabled placeholder="请输入项目编号" />
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
                <el-form-item label="项目地址" prop="area">
                  <el-cascader style="width:40%" v-model="addForm.area" :options="areaOptions" ref="area"
                    :props="{value: 'id'}" clearable>
                  </el-cascader>
                  <el-input style="width:55%;margin-left: 10px" v-model="addForm.projectAddress" clearable
                    placeholder="详细地址" />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="经纬度" prop="LongAndLatitude">
                  <el-input v-model="addForm" placeholder="请输入内容" />
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item label="备案号" prop="record">
                  <el-input v-model="addForm.record" placeholder="请输入内容" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经度" prop="longitude">
                  <el-input v-model="addForm.longitude" placeholder="请输入经度" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="纬度" prop="latitude">
                  <el-input v-model="addForm.latitude" placeholder="请输入纬度" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="维护负责人" prop="maintainUser">
                  <el-input v-model="addForm.maintainUser" placeholder="请输入纬度" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="远程方式" prop="remoteMode">
                  <el-input v-model="addForm.remoteMode" placeholder="请输入纬度" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="注册到期时间" prop="registrationExpiration">
                  <el-date-picker v-model="addForm.registrationExpiration" type="date" value-format="yyyy-MM-dd"
                    placeholder="选择日期" style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <h3>项目配置</h3>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="计划验收时间" prop="acceptanceTime">
                  <el-date-picker v-model="addForm.acceptanceTime" value-format="yyyy-MM-dd" type="date"
                    placeholder="选择日期" style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="计划归档时间" prop="filingTime">
                  <el-date-picker v-model="addForm.filingTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"
                    style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="计划竣工时间" prop="completionTime">
                  <el-date-picker v-model="addForm.completionTime" value-format="yyyy-MM-dd" type="date"
                    placeholder="选择日期" style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="考核模板" prop="assessmentId">
                  <el-select v-model="addForm.assessmentId" clearable placeholder="请选择考核模板" style="width:100%">
                    <el-option v-for="item in assessOption" :key="item.dictValue" :label="item.dictLabel"
                      :value="item.dictValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联水印" prop="watermarkId">
                  <el-select v-model="addForm.watermarkId" clearable placeholder="请选择关联水印" style="width:100%">
                    <el-option v-for="item in markOption" :key="item.dictValue" :label="item.dictLabel"
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

            <div v-for="(item,index) in addForm.list" :key="index">
              <h3>
                {{typeFormat(item)}}
              </h3>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="单位名称" :prop="`list[${index}].companyName`">
                    <el-select v-model="addForm.list[index].companyName" ref="companyRef" clearable
                      @change="companyChange($event,index)" placeholder="请选择单位名称" style="width:100%">
                      <el-option v-for="it in companySelete(item) " :key="it.id" :label="it.label" :value="it.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位负责人" prop="constructionUser">
                    <el-input v-model="addForm.list[index].companyUser" placeholder="选择单位后自动获取" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系方式" prop="constructionPhone">
                    <el-input v-model="addForm.list[index].companyPhone" clearable placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="监督人员" prop="constructionSupervise">
                    <el-input v-model="addForm.list[index].companySupervise" placeholder="分配后自动获取" disabled />
                  </el-form-item>
                </el-col>
              </el-row>

            </div>

            <h3>其他</h3>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="项目概况" prop="projectSurvey">
                  <el-input v-model="addForm.projectSurvey" clearable placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目措施" prop="projectMeasures">
                  <el-input v-model="addForm.projectMeasures" clearable placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remarks">
                  <el-input v-model="addForm.remarks" clearable placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="总质评分" prop="score">
                  <el-input v-model="addForm.score" placeholder="系统自动生成" disabled />
                </el-form-item>
              </el-col> -->
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
    addProject,
    getTreeselect,
    getCompanyInfo
  } from "@/api/projects/project";
  export default {
    directives: {
      defaultSelect
    },
    props: ["companyType"],
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
          area: [{
            required: true,
            message: "项目地址不能为空",
            trigger: "blur"
          }],
          // projectAddress: [{
          //   required: true,
          //   message: "项目地址不能为空",
          //   trigger: "blur"
          // }],
          longitude: [{
            required: true,
            message: "经度不能为空",
            trigger: "blur"
          }],
          latitude: [{
            required: true,
            message: "纬度不能为空",
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
          'list[0].companyName': [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
          'list[1].companyName': [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
          'list[2].companyName': [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }],
          'list[3].companyName': [{
            required: true,
            message: "单位名称不能为空",
            trigger: "blur"
          }]
        },

        addForm: {
          stepValue: [],
          list: []
        },
        addOpen: false,
        step: 0,
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
        ownerNameOption: [],
        companyTree: [],
      }
    },
    created() {
      this.addForm.stepValue.push(this.companyType[2].dictValue);
      this.getAreaList();
      this.getTree();
      this.getDicts("cqndt_period").then(response => {
        this.periodOptions = response.data;
      });
      this.getDicts("cqndt_bid_section").then(response => {
        this.bidSectionOptions = response.data;
      });
      this.getDicts("cqndt_assessment_type").then(response => {
        this.assessOption = response.data;
      });
      this.getDicts("cqndt_watermark_type").then(response => {
        this.markOption = response.data;
      });

    },
    methods: {
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let areaList = this.$refs.area.inputValue.split('/');
            this.$set(this.addForm, 'provinceName', areaList[0])
            this.$set(this.addForm, 'cityName', areaList[1])
            this.$set(this.addForm, 'countyName', areaList[2])
            this.$set(this.addForm, 'provinceCode', this.addForm.area[0].toString())
            this.$set(this.addForm, 'cityCode', this.addForm.area[1].toString())
            this.$set(this.addForm, 'countyCode', this.addForm.area[2].toString())
            delete this.addForm.area
            if (this.addForm.projectId != undefined) {
              updateProject(this.addForm).then(response => {
                this.msgSuccess("修改成功");
                this.$emit("closeDialog");
              });
            } else {
              addProject(this.addForm).then(response => {
                this.msgSuccess("新增成功");
                this.$emit("closeDialog");
              });
            }
          }
        });
      },
      getTree() {
        getTreeselect().then(res => {
          console.log(res);
          this.companyTree = res.data
        })
      },
      getAreaList() {
        getArea().then(res => {
          this.areaOptions = res.data;
        });
      },

      companyChange(e, index) {
        console.log(this.$refs.companyRef);

        this.$nextTick(() => {
          this.addForm.list[index].companyName = this.$refs.companyRef[index].selectedLabel
        })
        getCompanyInfo(e).then(res => {
          this.addForm.list[index].companyUser = res.data.leader;
          this.addForm.list[index].companyPhone = res.data.phone;
          this.addForm.list[index].companySupervise = res.data.createBy;
        })
      },
      handelChange(e) {
        // for (var i = 0; i < e.length; i++) {
        //   this.addForm.list[i].companyId = e[i]
        // }
      },
      companySelete(e) {
        let companyName = this.selectDictLabel(this.companyType, e.companyId)
        let arr = []
        this.companyTree.forEach((item, index) => {
          if (item.label == companyName) {
            if (item.children) {
              arr = item.children;
            }
          }
        })
        return arr
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
        this.addForm = {
          stepValue: [],
          list: []
        }
        this.addForm.stepValue.push(this.companyType[2].dictValue)
        this.step = 0
      },
      // 上一步
      prevStep() {
        this.reset();
      },
      // 下一步
      nextBtn() {
        this.step = 1
        for (var i = 0; i < this.addForm.stepValue.length; i++) {
          this.addForm.list.push({
            companyId: '',
            companyName: '',
            companyType: '',
            companyUser: '',
            companyPhone: '',
            companySupervise: '',
          })
          this.addForm.list[i].companyId = this.addForm.stepValue[i];
          this.addForm.list[i].companyType = this.addForm.stepValue[i];

        }
      },
      typeFormat(row) {
        return this.selectDictLabel(this.companyType, row.companyId);
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
