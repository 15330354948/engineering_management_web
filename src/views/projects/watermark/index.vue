<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="watermarkName">
        <el-input
          v-model="queryParams.watermarkName"
          placeholder="请输入水印模板"
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

    <el-table v-loading="loading" border :data="watermarkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="水印模板" align="center" prop="watermarkName" />
      <el-table-column label="水印位置" align="center" prop="watermarkAddress" :formatter="addressFormat" />
      <el-table-column label="测点名称水印" align="center" prop="watermarkPoint" :formatter="watermarkPointFormat"></el-table-column>
      <el-table-column label="水印时间" align="center" prop="watermarkTime" :formatter="timeFormat" />
      <el-table-column label="地址水印" align="center" prop="watermarkPointAddress" :formatter="pointAddressFormat" />
      <el-table-column label="经纬度水印" align="center" prop="watermarkCoordinate" :formatter="coordinateFormat" />
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

    <!-- 添加或修改水印对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="水印模板" prop="watermarkName">
          <el-input v-model="form.watermarkName" placeholder="请输入水印模板" />
        </el-form-item>
        <el-form-item label="水印位置" prop="watermarkAddress">
          <el-select v-model="form.watermarkAddress" placeholder="请选择水印位置" clearable>
            <el-option
              v-for="dict in addressOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="测点名称水印">
          <el-switch v-model="form.watermarkPoint"></el-switch>
        </el-form-item>
        <el-form-item label="时间水印">
          <el-switch v-model="form.watermarkTime"></el-switch>
        </el-form-item>
        <el-form-item label="地址水印" >
          <el-switch v-model="form.watermarkPointAddress"></el-switch>
        </el-form-item>
        <el-form-item label="经纬度水印">
          <el-switch v-model="form.watermarkCoordinate"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 关联项目 -->
    <el-dialog :title="titleRelation" v-if="openRelation" :visible.sync="openRelation" width="1200px" append-to-body>
      <projectDialog @closeDialog="closeDialog" :areaList="areaList" ref="son"></projectDialog>
    </el-dialog>
  </div>
</template>

<script>
import { listWatermark, getWatermark, delWatermark, addWatermark, updateWatermark, exportWatermark } from "@/api/projects/watermark";
import { listArea} from "@/api/area.js"
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
      // 水印位置数据字典
      addressOptions: [],
      // 开关字典
      switchOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
        watermarkAddress: [
          { required: true, message: "水印位置不能为空", trigger: "change" }
        ],
      },
      areaList:[],//区域列表
    };
  },
  created() {
    this.getList();
    this.getDicts("cqndt_watermark_type").then(response => {//水印位置字典
      this.addressOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {//开关字典
      this.switchOptions = response.data;
    });
    // 获取区域
    listArea().then(res=>{
        this.areaList=res.data;
    })
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
    // 水印位置字典翻译
    addressFormat(row, column) {
      return this.selectDictLabel(this.addressOptions, row.watermarkAddress);
    },
    // 测点名称字典翻译
    watermarkPointFormat(row, column) {
      return this.selectDictLabel(this.switchOptions, row.watermarkPoint);
    },
    // 水印时间字典翻译
    timeFormat(row, column) {
      return this.selectDictLabel(this.switchOptions, row.watermarkTime);
    },
    // 地址水印字典翻译
    pointAddressFormat(row, column) {
      return this.selectDictLabel(this.switchOptions, row.watermarkPointAddress);
    },
    // 经纬度水印字典翻译
    coordinateFormat(row, column) {
      return this.selectDictLabel(this.switchOptions, row.watermarkCoordinate);
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
        watermarkName: undefined,
        watermarkAddress:undefined,
        watermarkPoint:undefined,
        watermarkTime:undefined,
        watermarkPointAddress:undefined,
        watermarkCoordinate:undefined,
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
        this.form.watermarkAddress=this.form.watermarkAddress.toString()
        if(this.form.watermarkPoint==0){
          this.form.watermarkPoint=true
        }else{
          this.form.watermarkPoint=false
        }
        if(this.form.watermarkTime==0){
          this.form.watermarkTime=true
        }else{
          this.form.watermarkTime=false
        }
        if(this.form.watermarkCoordinate==0){
          this.form.watermarkCoordinate=true
        }else{
          this.form.watermarkCoordinate=false
        }
        if(this.form.watermarkPointAddress==0){
          this.form.watermarkPointAddress=true
        }else{
          this.form.watermarkPointAddress=false
        }
        this.open = true;
        this.title = "修改水印";
      });
    },
    // 关联项目按钮
    handleRelation(row){
      this.openRelation=true;
      console.log(222222)
      this.titleRelation='水印：' + row.name + '  正在分配项目'
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.watermarkPoint){
            this.form.watermarkPoint=0
          }else{
            this.form.watermarkPoint=1
          }
          if(this.form.watermarkTime){
            this.form.watermarkTime=0
          }else{
            this.form.watermarkTime=1
          }
          if(this.form.watermarkCoordinate){
            this.form.watermarkCoordinate=0
          }else{
            this.form.watermarkCoordinate=1
          }
          if(this.form.watermarkPointAddress){
            this.form.watermarkPointAddress=0
          }else{
            this.form.watermarkPointAddress=1
          }
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