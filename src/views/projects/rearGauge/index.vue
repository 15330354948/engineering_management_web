<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="rearGaugeCode">
        <el-input
          v-model="queryParams.rearGaugeCode"
          placeholder="请输入考核模板名称"
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
      <el-table-column label="后规羡慕名称" align="center" prop="rearGaugeId" />
      <el-table-column label="位置" align="center" prop="rearGaugeCode" />
      <el-table-column label="备注" align="center" prop="rearGaugeName" />
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
        <el-col :span="12">
          <el-form-item label="后规项目名称" prop="rearGaugeName">
            <el-input v-model="form.rearGaugeName" placeholder="请输入后规名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="位置" prop="rearGaugeName">
            <el-col :span="12" style="padding-right:5px">
              <el-cascader
                v-model="form.rearGaugeName"
                :options="areaList"
                clearable>
              </el-cascader>
            </el-col>
            <el-col :span="12" style="padding-left:5px">
              <el-input v-model="form.rearGaugeName" placeholder="请输入详细描述" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规划区域名称">
            <el-input v-model="form.rearGaugeName" placeholder="请输入规划区域名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高程(m)-前缘">
            <el-input v-model="form.rearGaugeName" placeholder="请输入高程(m)-前缘" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高程(m)-后缘">
            <el-input v-model="form.rearGaugeName" placeholder="请输入高程(m)-后缘" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规模-体积(10*4m^3)">
            <el-input v-model="form.rearGaugeName" placeholder="请输入规模-体积" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="稳定性评价-现状">
            <el-input v-model="form.rearGaugeName" placeholder="请输入稳定性评价-现状" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="稳定性评价-预测">
            <el-input v-model="form.rearGaugeName" placeholder="请输入稳定性评价-预测" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="影响人数">
            <el-input type="number" v-model="form.rearGaugeName" placeholder="请输入影响人数" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="影响房屋(m^2)">
            <el-input type="number" v-model="form.rearGaugeName" placeholder="请输入影响房屋" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="影响土地(亩)">
            <el-input type="number" v-model="form.rearGaugeName" placeholder="请输入影响土地" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他影响">
            <el-input v-model="form.rearGaugeName" placeholder="请输入其他影响" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联相关项目(万元)">
            <el-select v-model="form.status" placeholder="请选择关联相关项目" clearable>
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="防治效益(万元)">
            <el-input v-model="form.rearGaugeName" placeholder="请输入防治效益" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="遗留问题">
            <el-input v-model="form.rearGaugeName" placeholder="请输入遗留问题" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年度计划">
            <el-input v-model="form.rearGaugeName" placeholder="请输入年度计划" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="勘察单位">
            <el-cascader v-model="form.rearGaugeName" :options="areaList" clearable :show-all-levels="false"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设计单位">
            <el-cascader v-model="form.rearGaugeName" :options="areaList" clearable :show-all-levels="false"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="施工单位">
            <el-cascader v-model="form.rearGaugeName" :options="areaList" clearable :show-all-levels="false"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监理单位">
            <el-cascader v-model="form.rearGaugeName" :options="areaList" clearable :show-all-levels="false"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监测单位">
            <el-cascader v-model="form.rearGaugeName" :options="areaList" clearable :show-all-levels="false"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业主-验收">
            <el-switch v-model="form.value1"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区县-验收">
            <el-switch v-model="form.value1"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="市级-验收">
            <el-switch v-model="form.value1"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家级-验收">
            <el-switch v-model="form.value1"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRearGauge, getRearGauge, delRearGauge, addRearGauge, updateRearGauge, exportRearGauge } from "@/api/projects/rearGauge";
import { listArea} from "@/api/area.js"
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
        rearGaugeCode: undefined,
        rearGaugeName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        rearGaugeName: [
          { required: true, message: "后规名称不能为空", trigger: "blur" }
        ],
        rearGaugeCode: [
          { required: true, message: "后规编码不能为空", trigger: "blur" }
        ],
        rearGaugeSort: [
          { required: true, message: "后规顺序不能为空", trigger: "blur" }
        ]
      },
      areaList:[],//区域列表
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
        rearGaugeId: undefined,
        rearGaugeCode: undefined,
        rearGaugeName: undefined,
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
      this.ids = selection.map(item => item.rearGaugeId)
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
      const rearGaugeId = row.rearGaugeId || this.ids
      getRearGauge(rearGaugeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改后规";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.rearGaugeId != undefined) {
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
      const rearGaugeIds = row.rearGaugeId || this.ids;
      this.$confirm('是否确认删除后规编号为"' + rearGaugeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRearGauge(rearGaugeIds);
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