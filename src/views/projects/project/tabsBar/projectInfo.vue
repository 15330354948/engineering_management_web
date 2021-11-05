<template>
  <div>
    <el-form :model="addForm" ref="addForm" label-width="120px" :rules="rules">
      <h3>项目概况</h3>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="addForm.projectName" placeholder="请输入项目名称" clearable :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目编号" prop="projectCode">
            <el-input v-model="addForm.projectCode" placeholder="请输入项目编号" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属标段" prop="bidSection">
            <el-select v-model="addForm.bidSection" :disabled="btnType=='info'" placeholder="请选择所属标段" clearable
              size="small" style="width:100%">
              <el-option v-for="dict in bidSectionOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建设期次" prop="period">
            <el-select v-model="addForm.period" :disabled="btnType=='info'" placeholder="请选择创建期次" clearable size="small"
              style="width:100%">
              <el-option v-for="dict in periodOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目地址" prop="area">
            <el-cascader style="width:40%" v-model="addForm.area" ref="area" :options="areaOptions"
              :props="{ value: 'id'}" clearable :disabled="btnType=='info'"></el-cascader>
            <el-input style="width:55%;margin-left: 10px" v-model="addForm.projectAddress" clearable placeholder="详细地址"
              :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备案号" prop="record">
            <el-input v-model="addForm.record" placeholder="请输入备案号" clearable :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="addForm.longitude" placeholder="请输入经度" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="addForm.latitude" placeholder="请输入纬度" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维护负责人" prop="maintainUser">
            <el-input v-model="addForm.maintainUser" placeholder="请输入纬度" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="远程方式" prop="remoteMode">
            <el-input v-model="addForm.remoteMode" placeholder="请输入纬度" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册到期时间" prop="registrationExpiration">
           <el-date-picker v-model="addForm.registrationExpiration" type="date" placeholder="选择日期" style="width:100%" :disabled="btnType=='info'">
            </el-date-picker>
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
          <el-form-item label="考核模板" prop="assessmentId">
            <el-select v-model="addForm.assessmentId" clearable placeholder="请选择参与方" style="width:100%"
              :disabled="btnType=='info'">
              <el-option v-for="item in assessOption" :key="item.dictValue" :label="item.dictLabel"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联水印" prop="watermarkId">
            <el-select v-model="addForm.watermarkId" placeholder="请选择参与方" style="width:100%" :disabled="btnType=='info'"
              clearable>
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
              <el-select v-model="addForm.list[index].companyName" clearable @change="companyChange($event,index)"
                placeholder="请选择单位名称" style="width:100%">
                <el-option v-for="it in companySelete(item)" :key="it.id" :label="it.label" :value="it.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位负责人" :prop="`list[${index}].companyUser`">
              <el-input v-model="addForm.list[index].companyUser" placeholder="选择单位后自动获取" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" :prop="`list[${index}].companyPhone`">
              <el-input v-model="addForm.list[index].companyPhone" disabled clearable placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监督人员" :prop="`list[${index}].companySupervise`">
              <el-input v-model="addForm.list[index].companySupervise" placeholder="分配后自动获取" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <h3>其他</h3>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="项目概况" prop="projectSurvey">
            <el-input v-model="addForm.projectSurvey" clearable placeholder="请输入内容" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目措施" prop="projectMeasures">
            <el-input v-model="addForm.projectMeasures" clearable placeholder="请输入内容" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="addForm.remarks" clearable placeholder="请输入内容" :disabled="btnType=='info'" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="总质评分" prop="score">
            <el-input v-model="addForm.score" placeholder="系统自动生成" disabled />
          </el-form-item>
        </el-col> -->
      </el-row>

    </el-form>


    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
  import {
    getArea,
    updateProject,
    infoProject,
    getTreeselect,
    getCompanyInfo
  } from "@/api/projects/project";
  export default {
    props: ["btnType", "projectData"],
    data() {
      return {
        rules: {
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
          list: [{
            companyId: '',
            companyName: '',
            companyUser: '',
            companyPhone: '',
            companySupervise: '',
          }, {
            companyId: '',
            companyName: '',
            companyUser: '',
            companyPhone: '',
            companySupervise: '',
          }, {
            companyId: '',
            companyName: '',
            companyUser: '',
            companyPhone: '',
            companySupervise: '',
          }, {
            companyId: '',
            companyName: '',
            companyUser: '',
            companyPhone: '',
            companySupervise: '',
          }]
        },
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
        companyType: [],
        companyTree: []
      }
    },
    created() {
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
      this.getDicts("cqndt_company_type").then(response => {
        this.companyType = response.data
      });
    },
    mounted() {},
    watch: {
      projectData: {
        immediate: true,
        handler(val) {
          infoProject(val.projectId).then(res => {
            let data = res.data;
            data.list.forEach(item => {
              // Number(item.companyId)
             item.companyName = Number(item.companyName)
            })
            console.log(data);

            data.assessmentId += '';
            data.bidSection += '';
            data.watermarkId += '';
            data.period += '';
            this.addForm = data;
            this.addForm.area = [Number(data.provinceCode), Number(data.cityCode), Number(data.countyCode)]
          })

        }
      }
    },
    methods: {
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            if (this.$refs.area.inputValue) {
              let areaList = this.$refs.area.inputValue.split('/');
              this.$set(this.addForm, 'provinceName', areaList[0])
              this.$set(this.addForm, 'cityName', areaList[1])
              this.$set(this.addForm, 'countyName', areaList[2])
              this.$set(this.addForm, 'provinceCode', this.addForm.area[0].toString())
              this.$set(this.addForm, 'cityCode', this.addForm.area[1].toString())
              this.$set(this.addForm, 'countyCode', this.addForm.area[2].toString())
              delete this.addForm.area
            }
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
      companyChange(e, index) {
        getCompanyInfo(e).then(res => {
          this.addForm.list[index].companyUser = res.data.leader;
          this.addForm.list[index].companyPhone = res.data.phone;
          this.addForm.list[index].companySupervise = res.data.companySupervise;
        })
      },
      getTree() {
        getTreeselect().then(res => {
          this.companyTree = res.data
        })
      },
      typeFormat(row) {
        return this.selectDictLabel(this.companyType, row.companyId);
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
      getAreaList() {
        getArea().then(res => {
          this.areaOptions = res.data;
        });
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
    }
  }

</script>

<style lang="scss">

</style>
