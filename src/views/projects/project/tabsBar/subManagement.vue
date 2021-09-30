<template>
  <div class="container">
    <el-form :model="queryParams" ref="queryParams" :inline="true" label-width="85px">
      <el-form-item prop="pointName">
        <el-input v-model="queryParams.pointName" placeholder="请输入资料名称" clearable size="small" />
      </el-form-item>
      <el-form-item prop="area" placeholder="请选择区域">
        <el-cascader v-model="queryParams.area" :options="areaOptions" clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item prop="subType">
        <el-select v-model="queryParams.subType" multiple placeholder="请选择子项类型" style="width:100%">
          <el-option v-for="item in subTypeOption" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="state">
        <el-select v-model="queryParams.state" multiple placeholder="请选择状态" style="width:100%">
          <el-option v-for="item in stateOption" :key="item.value" :label="item.label" :value="item.value">
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
      <el-col :span="1.5">
        <el-button type="primary" @click="subHandleImport" v-if="btnType=='edit'">子项导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="subHandleExport">子项导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="testHandleImport" v-if="btnType=='edit'">测点导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="testHandleExport">测点导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="handleDel">删除选中
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="QRcode">二维码下载
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="subProjectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属项目" align="center" prop="ProjectId" />
      <el-table-column label="子项名称" align="center" prop="ProjectCode" />
      <el-table-column label="类型" align="center" prop="ProjectName" />
      <el-table-column label="地址" align="center" prop="ProjectSort" />
      <el-table-column label="工序" align="center" prop="ProjectSort" />
      <el-table-column label="分组" align="center" prop="ProjectSort" />
      <el-table-column label="状态" align="center" prop="ProjectSort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-tools" @click="handleDistribution(scope.row)"
            v-if="btnType=='edit'">分配
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row)">详情</el-button>
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
    <el-dialog :title="title" :visible.sync="infoOpen" width="80%" append-to-body :before-close="infoHandleClose">
      <subProInfo ref="subInfo"></subProInfo>
    </el-dialog>
  </div>
</template>

<script>
  import subProInfo from '../subProInfo.vue'
  export default {
    components: {
      subProInfo
    },
    props: ["btnType"],
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
        areaOptions: [],
        subTypeOption: [],
        stateOption: [],
        subProjectList: [{
          ProjectId: '11'
        }],
        title: "",
        // 施工人员弹出层
        distributionOpen: false,
        // 子项管理弹出层
        infoOpen: false,
        distributionForm: {},
        distributionrRules: {
          constructionTeam: [{
            required: true,
            message: "施工组不能为空",
            trigger: "blur"
          }],
        }
      }
    },
    methods: {
      // 分页查询
      getList() {},
      handleQuery() {},
      resetQuery() {
        this.resetForm("queryParams");
        this.handleQuery();
      },
      handleAdd() {},
      subHandleImport() {},
      subHandleExport() {},
      testHandleImport() {},
      testHandleExport() {},
      handleDel() {},
      QRcode() {},
      // 分配按钮操作
      handleDistribution() {
        this.title = "施工人员分配";
        this.distributionOpen = true;
      },
      // 施工人员提交
      distributionSubmitForm() {},
      // 详情
      handleDetail() {
        this.title = "子项详情";
        this.infoOpen = true;
      },
      // 修改
      handleUpdate() {},
      // 下载
      handleDownload() {},
      // 删除
      handleDelete() {},
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ProjectId)
      },
      cancel() {
        this.distributionOpen = false;
        // this.resetForm("eidtForm");
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
