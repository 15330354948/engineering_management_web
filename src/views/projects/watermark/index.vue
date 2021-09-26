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
      <el-form :model="queryParams2" ref="queryForm2" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item prop="ProjectCode">
          <el-input
            v-model="queryParams2.ProjectCode"
            placeholder="请输入项目编号/名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-cascader
              :options="options"
              clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams2.status" placeholder="请选择创建期次" clearable size="small">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams2.status" placeholder="请选择所属标段" clearable size="small">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams2.status" placeholder="请选择项目状态" clearable size="small">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery2">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery2">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :disabled="multiple2"
            @click="handleRelations"
            v-hasPermi="['project:Project:add']"
          >选中关联</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="projectList" @selection-change="handleSelectionChange2">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="项目编号" align="center" prop="ProjectId" />
        <el-table-column label="项目名称" align="center" prop="ProjectCode" />
        <el-table-column label="项目地址" align="center" prop="ProjectName" />
        <el-table-column label="建设期次" align="center" prop="ProjectSort" />
        <el-table-column label="所属标段" align="center" prop="ProjectSort" />
        <el-table-column label="项目状态" align="center" prop="status" :formatter="statusFormat" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-link"
              @click="handleRelations(scope.row)"
              v-hasPermi="['project:Project:edit']"
            >关联</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDisassociate(scope.row)"
              v-hasPermi="['project:Project:remove']"
            >取消关联</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-show="total2>0"
        :total="total2"
        :page.sync="queryParams2.pageNum"
        :limit.sync="queryParams2.pageSize"
        @pagination="getProjectList"
      />
    </el-dialog>
  </div>
</template>

<script>
import { listWatermark, getWatermark, delWatermark, addWatermark, updateWatermark, exportWatermark } from "@/api/projects/watermark";

export default {
  name: "Watermark",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      ids2: [],
      // 非单个禁用
      single: true,
      single2: true,
      // 非多个禁用
      multiple: true,
      multiple2: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      total2: 0,
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
      queryParams2: {
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
      projectList:[],//关联项目 
      options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
      }]
    };
  },
  created() {
    this.getList();
    this.getProjectList();
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
    // 查询关联项目列表
    getProjectList() {
      this.loading = true;
      listWatermark(this.queryParams).then(response => {
        this.projectList = response.rows;
        this.total2 = response.total;
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
    handleQuery2() {
      this.queryParams2.pageNum = 1;
      this.getProjectList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 重置按钮操作 */
    resetQuery2() {
      this.resetForm("queryForm2");
      this.handleQuery2();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.watermarkId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 多选框选中数据
    handleSelectionChange2(selection) {
      console.log(88)
      this.ids2 = selection.map(item => item.watermarkId)
      this.single2 = selection.length!=1
      this.multiple2 = !selection.length
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
    // 关联操作
    handleRelations(){
      this.msgSuccess("关联成功");
    },
    // 取消关联操作
    handleDisassociate(){
      this.msgSuccess("取消关联成功");
    }
  }
};
</script>
<style lang="scss" scoped>
.el-select{
  width: 100%;
}
</style>