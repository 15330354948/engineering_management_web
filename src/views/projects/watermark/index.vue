<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="watermarkCode">
        <el-input
          v-model="queryParams.watermarkCode"
          placeholder="请输入水印模板"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
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
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:Project:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['project:Project:remove']"
        >删除选中</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="watermarkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="水印编号" align="center" prop="watermarkId" />
      <el-table-column label="水印名称" align="center" prop="watermarkCode" />
      <el-table-column label="水印地址" align="center" prop="watermarkName" />
      <el-table-column label="建设期次" align="center" prop="watermarkSort" />
      <el-table-column label="所属标段" align="center" prop="watermarkSort" />
      <el-table-column label="水印状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-link"
            @click="handleRelation(scope.row)"
            v-hasPermi="['project:Project:edit']"
          >关联项目</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-info"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:Project:edit']"
          >详情</el-button>
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

    <!-- 添加或修改水印对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="水印模板" prop="watermarkName">
          <el-input v-model="form.watermarkName" placeholder="请输入水印模板" />
        </el-form-item>
        <el-form-item label="水印位置" prop="watermarkCode">
          <el-select v-model="form.type" placeholder="请选择水印位置" clearable>
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="测点名称水印">
          <el-switch v-model="form.value1"></el-switch>
        </el-form-item>
        <el-form-item label="时间水印">
          <el-switch v-model="form.value1"></el-switch>
        </el-form-item>
        <el-form-item label="地址水印" >
          <el-switch v-model="form.value1"></el-switch>
        </el-form-item>
        <el-form-item label="经纬度水印">
          <el-switch v-model="form.value1"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 关联项目 -->
    <el-dialog :title="titleRelation" :visible.sync="openRelation" width="1200px" append-to-body>
      <projectDialog @closeDialog="closeDialog" ref="son"></projectDialog>
    </el-dialog>
  </div>
</template>

<script>
import { listWatermark, getWatermark, delWatermark, addWatermark, updateWatermark, exportWatermark } from "@/api/projects/watermark";
import projectDialog from "./projectDialog.vue"
export default {
  name: "Watermark",
  components:{projectDialog},
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
      // 水印表格数据
      watermarkList: [],
      // 弹出层标题
      title: "",
      titleRelation:"",
      // 是否显示弹出层
      open: false,
      openRelation:false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        watermarkCode: undefined,
        watermarkName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        watermarkName: [
          { required: true, message: "水印名称不能为空", trigger: "blur" }
        ],
        watermarkCode: [
          { required: true, message: "水印编码不能为空", trigger: "blur" }
        ],
        watermarkSort: [
          { required: true, message: "水印顺序不能为空", trigger: "blur" }
        ]
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询水印列表 */
    getList() {
      this.loading = true;
      listWatermark(this.queryParams).then(response => {
        this.watermarkList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 水印状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 关闭
    closeDialog(){
      this.openRelation=false;
    },
    // 表单重置
    reset() {
      this.form = {
        watermarkId: undefined,
        watermarkCode: undefined,
        watermarkName: undefined,
        watermarkSort: 0,
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
      this.ids = selection.map(item => item.watermarkId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加水印";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const watermarkId = row.watermarkId || this.ids
      getWatermark(watermarkId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改水印";
      });
    },
    // 关联项目按钮
    handleRelation(row){
      this.openRelation=true;
      this.titleRelation='水印：' + row.name + '  正在分配项目'
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.watermarkId != undefined) {
            updateWatermark(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWatermark(this.form).then(response => {
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
      const watermarkIds = row.watermarkId || this.ids;
      this.$confirm('是否确认删除水印编号为"' + watermarkIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWatermark(watermarkIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有水印数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportWatermark(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
  }
};
</script>
<style lang="scss" scoped>
.el-select{
  width: 100%;
}
</style>