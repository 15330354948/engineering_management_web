<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="gaugeName">
        <el-input
          v-model="queryParams.gaugeName"
          placeholder="请输入后规项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleAdd"
          v-hasPermi="['project:Project:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['project:Project:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleExport"
          v-hasPermi="['project:Project:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['project:Project:remove']"
        >删除选中</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" border :data="rearGaugeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="后规项目名称" align="center" prop="gaugeName" />
      <el-table-column label="位置" align="center" prop="rearGaugeCode">
        <template slot-scope="scope">
          {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}{{scope.row.describe}}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:Project:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:Project:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改后规对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="后规项目名称" prop="gaugeName">
              <el-input v-model="form.gaugeName" placeholder="请输入后规名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置" prop="area">
              <el-col :span="12" style="padding-right:5px">
                <el-cascader
                  v-model="form.area"
                  :options="areaList"
                  :props="{value: 'id'}"
                  clearable>
                </el-cascader>
              </el-col>
              <el-col :span="12" style="padding-left:5px">
                <el-input v-model="form.describe" placeholder="请输入详细描述" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规划区域名称">
              <el-input v-model="form.gaugeRegionName" placeholder="请输入规划区域名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高程(m)-前缘">
              <el-input v-model="form.altitudeFront" placeholder="请输入高程(m)-前缘" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高程(m)-后缘">
              <el-input v-model="form.altitudeAfter" placeholder="请输入高程(m)-后缘" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规模-体积(10*4m^3)">
              <el-input v-model="form.volume" placeholder="请输入规模-体积" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="稳定性评价-现状">
              <el-input v-model="form.presentSituation" placeholder="请输入稳定性评价-现状" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="稳定性评价-预测">
              <el-input v-model="form.forecast" placeholder="请输入稳定性评价-预测" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响人数">
              <el-input type="number" v-model="form.people" placeholder="请输入影响人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响房屋(m^2)">
              <el-input type="number" v-model="form.house" placeholder="请输入影响房屋" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响土地(亩)">
              <el-input type="number" v-model="form.land" placeholder="请输入影响土地" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他影响">
              <el-input v-model="form.other" placeholder="请输入其他影响" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="防治效益(万元)">
              <el-input v-model="form.benefit" placeholder="请输入防治效益" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联相关项目(万元)">
              <el-select v-model="form.projectId" placeholder="请选择关联相关项目" clearable>
                <el-option
                  v-for="dict in projectList"
                  :key="dict.projectId"
                  :label="dict.projectName"
                  :value="dict.projectId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="遗留问题">
              <el-input v-model="form.problem" placeholder="请输入遗留问题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年度计划">
              <el-input v-model="form.plan" placeholder="请输入年度计划" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="勘察单位">
              <el-cascader v-model="form.surveyId" :props="{value:'id',emitPath:false}" :options="companyList" clearable :show-all-levels="false"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设计单位">
              <el-cascader v-model="form.designId" :props="{value:'id',emitPath:false}" :options="companyList" clearable :show-all-levels="false"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工单位">
              <el-cascader v-model="form.constructionId" :props="{value:'id',emitPath:false}" :options="companyList" clearable :show-all-levels="false"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监理单位">
              <el-cascader v-model="form.supervisorId" :props="{value:'id',emitPath:false}" :options="companyList" clearable :show-all-levels="false"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监测单位">
              <el-cascader v-model="form.monitorId" :props="{value:'id',emitPath:false}" :options="companyList" clearable :show-all-levels="false"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业主-验收">
              <el-switch v-model="form.ownerCheck"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区县-验收">
              <el-switch v-model="form.countyCheck"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="市级-验收">
              <el-switch v-model="form.cityCheck"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国家级-验收">
              <el-switch v-model="form.countryCheck"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRearGauge, getRearGauge, delRearGauge, addRearGauge, updateRearGauge, exportRearGauge,listCompany } from "@/api/projects/rearGauge";
import { listProject } from "@/api/projects/project";
import { listArea} from "@/api/common.js"
export default {
  name: "RearGauge",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 后规表格数据
      rearGaugeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gaugeName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        gaugeName: [
          { required: true, message: "后规名称不能为空", trigger: "blur" }
        ],
        area: [
          { required: true, message: "请选择区域", trigger: "change" }
        ],
      },
      areaList:[],//区域列表
      projectList:[],//项目列表
      companyList:[],//单位列表
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    // 获取区域
    listArea().then(res=>{
        this.areaList=res.data;
    })
    // 获取项目
    listProject().then(res=>{
      this.projectList=res.rows;
    })
    // 获取单位
    listCompany().then(res=>{
      this.companyList=res.data
    })
  },
  methods: {
    /** 查询后规列表 */
    getList() {
      this.loading = true;
      listRearGauge(this.queryParams).then(response => {
        this.rearGaugeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 后规状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        gaugeId: undefined,
        rearGaugeCode: undefined,
        gaugeName: undefined,
        rearGaugeSort: 0,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.gaugeId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加后规";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const gaugeId = row.gaugeId || this.ids
      getRearGauge(gaugeId).then(response => {
        this.form = response.data;
        this.form.area=[Number(this.form.provinceCode),Number(this.form.cityCode),Number(this.form.countyCode)];
        this.$forceUpdate()
        if(this.form.ownerCheck==1){
            this.form.ownerCheck=true
          }else{
            this.form.ownerCheck=false
          }
          if(this.form.countyCheck==1){
            this.form.countyCheck=true
          }else{
            this.form.countyCheck=false
          }
          if(this.form.cityCheck==1){
            this.form.cityCheck=true
          }else{
            this.form.cityCheck=false
          }
          if(this.form.countryCheck==1){
            this.form.countryCheck=true
          }else{
            this.form.countryCheck=false
          }
        this.open = true;
        this.title = "修改后规";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.ownerCheck){
            this.form.ownerCheck=1
          }else{
            this.form.ownerCheck=2
          }
          if(this.form.countyCheck){
            this.form.countyCheck=1
          }else{
            this.form.countyCheck=2
          }
          if(this.form.cityCheck){
            this.form.cityCheck=1
          }else{
            this.form.cityCheck=2
          }
          if(this.form.countryCheck){
            this.form.countryCheck=1
          }else{
            this.form.countryCheck=2
          }
          this.form.provinceCode=this.form.area[0]
          this.form.cityCode=this.form.area[1]
          this.form.countyCode=this.form.area[2]
          if (this.form.gaugeId != undefined) {
            updateRearGauge(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRearGauge(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const gaugeIds = row.gaugeId || this.ids;
      this.$confirm('是否确认删除后规编号为"' + gaugeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRearGauge(gaugeIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有后规数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRearGauge(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
  }
};
</script>
<style lang="scss" scoped>
.el-select,.el-cascader{
  width: 100%;
}
</style>