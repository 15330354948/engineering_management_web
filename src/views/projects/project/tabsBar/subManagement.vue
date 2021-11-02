<template>
  <div class="subManagement_container">
    <el-form :model="queryParams" ref="queryParams" :inline="true" label-width="85px">
      <el-form-item prop="area">
        <el-cascader v-model="queryParams.area" :props="{checkStrictly: true, value: 'id'}" placeholder="请选择区域"
          :options="areaOptions" clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item prop="subProjectName">
        <el-input v-model="queryParams.subProjectName" placeholder="请输入子项名称" clearable size="small" />
      </el-form-item>

      <el-form-item prop="type">
        <el-select v-model="queryParams.type" multiple placeholder="请选择子项类型" style="width:100%">
          <el-option v-for="item in subTypeOptions" :key="item.dictValue" :label="item.dictLabel"
            :value="item.dictValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="state">
        <el-select v-model="queryParams.state" multiple placeholder="请选择状态" style="width:100%">
          <el-option v-for="item in stateOption" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click="handleQuery">搜索</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button @click="resetQuery">重置</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="handleAdd" v-if="btnType=='edit'">创建</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" @click="handleChildImport" v-hasPermi="['project:Project:import']">子项导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="handleChildExport" v-hasPermi="['project:Project:export']">子项导出
        </el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="primary" @click="handleImport" v-hasPermi="['project:Project:import']">导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="handleExport" v-hasPermi="['project:Project:export']">导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" :disabled="multiple" @click="handleDelete">删除选中
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="subProjectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属项目" align="center" prop="subProjectId" />
      <el-table-column label="子项名称" align="center" prop="subProjectName" />
      <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column label="地址" align="center" prop="address">
        <template slot-scope="scope">
          {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}{{scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column label="工序" align="center" prop="procedureName" />
      <el-table-column label="分组" align="center" prop="grouping" />
      <el-table-column label="状态" align="state" prop="state" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-tools" @click="handleDistribution(scope.row)"
            v-if="btnType=='edit'">分配
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row)">测点详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-if="btnType=='edit'">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-bottom" @click="handleDownload(scope.row)">下载</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 施工人员分配 -->
    <el-dialog :title="title" :visible.sync="distributionOpen" width="30%" append-to-body :before-close="handleClose">
      <el-form ref="distributionForm" :model="distributionForm" :rules="distributionrRules" label-width="80px">
        <el-form-item label="施工组" prop="constructionTeam">
          <el-input v-model="distributionForm.constructionTeam" placeholder="请输入项目名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="distributionSubmitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog :title="title" :visible.sync="infoOpen" v-if="infoOpen" width="85%" append-to-body
      :before-close="infoHandleClose">
      <subProInfo @closeDialog="closeDialog" :subProjectId="subProjectId" ref="subInfo"></subProInfo>
    </el-dialog>

    <!-- 创建 -->
    <el-dialog :title="title" :visible.sync="subOpen" width="40%" append-to-body :before-close="handleClose">
      <el-form :model="subForm" ref="subForm" :rules="subRules" :inline="true" label-width="100px">
        <el-form-item label="子项目名称" prop="subProjectName">
          <el-input v-model="subForm.subProjectName" placeholder="请输入测点名称" clearable size="small"
            style="width: 300px" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="subForm.type" placeholder="请选择设备类型" clearable size="small" style="width: 300px">
            <el-option v-for="dict in subTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="工序" prop="procedureName">
          <el-select v-model="subForm.procedureName" placeholder="请选择工序" clearable size="small" style="width: 300px">
            <el-option v-for="dict in workingOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目地址" prop="area">
          <el-cascader style="width:45%" ref="area" v-model="subForm.area" :options="areaOptions"
            :props="{checkStrictly: true, value: 'id'}" clearable></el-cascader>
          <el-input style="width:50%;margin-left: 10px" v-model="subForm.address" placeholder="详细地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="subForm.remark" type="textarea" placeholder="请输入测点名称" clearable size="small"
            style="width: 300px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import subProInfo from '../subProInfo.vue'
  import {
    getArea,
    listSubProject,
    addSubProject,
    editSubProject,
    infoSubProject,
    delSubProject,
    exportSubProject,
    updateProject,
    infoProject
  } from "@/api/projects/project";
  export default {
    components: {
      subProInfo
    },
    props: ["btnType", "projectData"],
    data() {
      return {
        loading: false,
        total: 0,
        ids: "",
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        form: {},
        subForm: {},
        areaOptions: [],
        // 子项类型
        subTypeOptions: [],
        // 项目状态: 
        stateOption: [],

        // 设备类型
        devTypeOptions: [],
        // 工序
        workingOptions: [],
        subProjectList: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        title: "",
        // 施工人员弹出层
        distributionOpen: false,
        // 子项管理弹出层
        infoOpen: false,
        // 子项新增
        subOpen: false,
        subProjectId: '',
        distributionForm: {},
        distributionrRules: {
          constructionTeam: [{
            required: true,
            message: "施工组不能为空",
            trigger: "blur"
          }],
        },
        subRules: {
          subProjectName: [{
            required: true,
            message: "子项目名称不能为空",
            trigger: "blur"
          }],
          type: [{
            required: true,
            message: "类型不能为空",
            trigger: "blur"
          }],
          working: [{
            required: true,
            message: "工序不能为空",
            trigger: "blur"
          }],
          area: [{
            required: true,
            message: "地址不能为空",
            trigger: "blur"
          }]
        },
      }
    },
    created() {
      this.getList();
      this.getAreaList();
      this.getDicts("cqndt_sub_project_type").then(response => {
        this.subTypeOptions = response.data;
      });
      this.getDicts("cqndt_project_type").then(response => {
        this.stateOption = response.data;
      });

      this.getDicts("cqndt_procedure_type").then(response => {
        this.workingOptions = response.data;
      });
    },
    methods: {
      // 分页查询
      getList() {
        this.loading = true;
        listSubProject(this.queryParams).then(response => {
          this.subProjectList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      handleQuery() {
        this.queryParams.pageNum = 1;
        if (this.queryParams.area) {
          this.$set(this.queryParams, 'provinceCode', this.queryParams.area[0])
          this.$set(this.queryParams, 'cityCode', this.queryParams.area[1])
          this.$set(this.queryParams, 'countyCode', this.queryParams.area[2])
        }
        delete this.queryParams.area
        this.getList();
      },
      typeFormat(row, column) {
        return this.selectDictLabel(this.subTypeOptions, row.type);
      },
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      //  获取行政区
      getAreaList() {
        getArea().then(res => {
          this.areaOptions = res.data;
        });
      },
      handleAdd(row) {
        this.title = "子项目新增";
        this.subOpen = true;
      },
      // subHandleImport() {},
      // subHandleExport() {},
      handleImport() {},
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有子项目数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportSubProject(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      // 分配按钮操作
      handleDistribution() {
        this.title = "施工人员分配";
        this.distributionOpen = true;
      },
      // 施工人员提交
      distributionSubmitForm() {},
      // 详情
      handleDetail(row) {
        this.title = "测点详情";
        this.infoOpen = true;
        this.subProjectId = row.subProjectId;
      },
      // 修改
      handleUpdate(row) {
        infoSubProject(row.subProjectId).then(res => {
          // this.subForm = res.data;
          let data = res.data;
          data.type += '';
          this.subForm = data;
          this.subForm.area = []
          this.subForm.area.push(data.provinceCode / 1, data.cityCode / 1, data.countyCode / 1)
        })
        // subProjectId
        this.title = "子项目修改";
        this.subOpen = true;
      },
      // 下载
      handleDownload() {},
      // 删除
      handleDelete(row) {
        const subProjectIds = row.subProjectId || this.ids;
        this.$confirm('是否确认删除编号为"' + subProjectIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delSubProject(subProjectIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.subProjectId);
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      // 创建项目提交
      subSubmit() {
        this.$refs["subForm"].validate(valid => {
          if (valid) {
            let areaList = this.$refs.area.inputValue.split('/');
            this.$set(this.subForm, 'provinceName', areaList[0])
            this.$set(this.subForm, 'cityName', areaList[1])
            this.$set(this.subForm, 'countyName', areaList[2])
            this.$set(this.subForm, 'provinceCode', this.subForm.area[0].toString())
            this.$set(this.subForm, 'cityCode', this.subForm.area[1].toString())
            this.$set(this.subForm, 'countyCode', this.subForm.area[2].toString())

            if (this.subForm.subProjectId != undefined) {
              editSubProject(this.subForm).then(response => {
                this.msgSuccess("修改成功");
                this.subOpen = false;
                this.getList();
              });
            } else {
              addSubProject(Object.assign(this.subForm, {
                projectId: this.projectData.projectId,
                projectName: this.projectData.projectName,
              })).then(response => {
                this.msgSuccess("新增成功");
                this.subOpen = false;
                this.getList();
              })
            }
          }
        });
      },
      closeDialog() {
        this.infoOpen = false;
      },
      cancel() {
        this.distributionOpen = false;
        this.subOpen = false;
        this.resetForm("subForm");
        this.resetForm("distributionForm");
      },
      handleClose() {
        this.cancel();
      },
      // 子项管理关闭弹出层
      infoHandleClose() {
        this.infoOpen = false;
        this.$refs.subInfo.infoCancel();
      }
    }
  }

</script>

<style>

</style>
