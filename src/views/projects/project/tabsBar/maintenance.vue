<template>
  <div>
    <el-form :model="queryParams" ref="queryParams" :inline="true" label-width="85px">
      <el-form-item prop="maintainName">
        <el-input v-model="queryParams.maintainName" placeholder="请输入维护任务名称" clearable size="small" />
      </el-form-item>
      <el-form-item prop="createUser">
        <el-input v-model="queryParams.createUser" placeholder="请输入维护人" clearable size="small" />
      </el-form-item>
      <el-form-item prop="endTime">
        <el-date-picker v-model="queryParams.endTime" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="result">
        <el-select v-model="queryParams.result" placeholder="请选择结果" clearable size="small">
          <el-option v-for="dict in resultOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" border :data="maintenanceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="维护任务名称" align="center" prop="maintainName" />
      <el-table-column label="维护人" align="center" prop="createUser" />
      <el-table-column label="实际完成时间" align="center" prop="endTime" />
      <el-table-column label="维护结果" align="center" prop="result" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 详情 -->
    <el-dialog :title="title" :visible.sync="infoOpen" v-if="infoOpen" width="85%" append-to-body>
      <el-row :gutter="24">
        <el-col :span="5">
          <div class="subList">
            <div class="header">
              <span>监测列表</span>
            </div>
            <div class="treeList">
              <el-input class="searchInput" placeholder="请输入测点名称" v-model="filterText">
              </el-input>
              <el-tree class="filter-tree" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
                default-expand-all highlight-current :filter-node-method="filterNode" ref="tree" node-key="id">
              </el-tree>
            </div>
          </div>
        </el-col>

        <el-col :span="19">

          <h4>维护内容</h4>
          <el-table border :data="tableData" style="width: 100%" :header-cell-style="{'background-color': '#fff'}">
            <el-table-column label="维护任务名称" align="center" prop="subMaintainName" />
            <el-table-column label="维护人" align="center" prop="createUser" />
            <el-table-column label="计划完成时间" align="center" prop="updateTime" />
          </el-table>

          <h4>维护照片</h4>
          <div class="photo">
            <viewer :images="images" @inited="inited" class="inspectionPhotos-viewer" ref="viewer">
              <template #default="scope">
                <img v-for="src in scope.images" :src="src" :key="src" />
                {{ scope.options }}
              </template>
            </viewer>
          </div>

          <h4>备注</h4>
          <el-input type="textarea" v-model="textarea2" readonly>
          </el-input>

          <!-- <div class="testInfo">
          <el-collapse :value="data.map(item => item.id)">
            <el-collapse-item v-for="(item,index) in data" :key="index" :name="index">
              <template slot="title">
                <div class="topTilte">
                  <span class="text">{{item.name}}</span>
                  <div class="text">
                    <span class="delete" @click="handelDel">删除</span>
                    <span>{{item.state}}</span>
                  </div>
                </div>
              </template>
              <div class="content"></div>
              <p>备注：</p>
            </el-collapse-item>
          </el-collapse>
        </div> -->
        </el-col>

      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import TreeRender from '@/components/TreeRender'
  import {
    listMaintain,
    infoMaintain
  } from "@/api/projects/project";
  import "viewerjs/dist/viewer.css";
  import {
    component as Viewer
  } from "v-viewer";
  export default {
    props: ['btnType', 'projectData'],
    components: {
      Viewer
    },
    data() {
      return {
        images: [
          "https://picsum.photos/200/200",
          "https://picsum.photos/300/200",
          "https://picsum.photos/250/200",
        ],
        textarea2: "",
        form: {},
        resultOptions: [],
        ids: '',
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          maintainName: undefined,
          createUser: undefined,
          endTime: undefined,
          result: undefined
        },
        loading: false,
        maintenanceList: [],
        tableData: [{
          maintainName: "测试"
        }],
        title: '',
        infoOpen: false,
        activeName: ['1', '2', '3', '4'],
        icon: 'el-icon-delete',
        filterText: '',
        // 树形
        treeData: [{
          id: 1,
          label: '一级 1',
          loading: false
        }, {
          id: 2,
          label: '一级 2',
          loading: false
        }, {
          id: 3,
          label: '一级 3',
          loading: false
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      treeData: {
        handler(val) {
          val.forEach(item => {
            setTimeout(() => {
              item.loading = false
            }, 2000)
          })
          if (val.length > 0) {
            this.contnentShow = true
          } else {
            this.contnentShow = false
          }
        },
      },
      projectData: {
        immediate: true,
        handler(val) {
          this.getList();
        }
      }
    },
    computed: {
      opened() {
        return this.data.map((item) => {
          return item.id
        });
      }
    },
    created() {
      // this.$nextTick(() => {
      //   // treeBox 元素的ref   value 绑定的node-key
      //   this.$refs.tree.setCurrentKey(1);
      // });
      for (var i = 0; i < this.treeData.length; i++) {
        this.treeData[0].loading = true;
      }
    },
    methods: {
      inited(viewer) {
        this.$viewer = viewer;
      },
      filterNode(value, data) {
        console.log(data.label);
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getList() {
        this.loading = true;
        listMaintain(this.queryParams).then(response => {
          this.maintenanceList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
      },
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      resetQuery() {
        this.resetForm("queryParams");
        this.handleQuery();
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ProjectId)
      },
      handleDetail(row) {
        this.title = '维护详情'
        infoMaintain(row.maintainId).then(res => {
          this.tableData = res.data.subMaintainTemplates
        })
        this.infoOpen = true
      },
      // 树形点击 
      handleNodeClick(data) {
        data.loading = true
        setTimeout(() => {
          data.loading = false
        }, 1000)
      },

    }
  }

</script>

<style lang="scss" scoped>
  .subList {
    width: 100%;
    height: 700px;
    border: 1px solid #e6e6e6;
  }

  .subList .header {
    width: 100%;
    height: 40px;
    background-color: #f8f8f9;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    padding: 0 10px;
  }

  .subList .header span {
    font-weight: bold;
  }


  .subList .searchInput {
    padding: 5px 10px;
    border-bottom: 1px solid #e6e6e6;
  }

  /deep/ .el-tree-node {
    height: 40px;
    border-bottom: 1px solid #e6e6e6;
    line-height: 40px;
  }

  /deep/ .el-tree-node__content {
    height: 40px;
    line-height: 40px !important;
  }

  /deep/ .topTilte {
    width: 100%;
    display: flex;
    justify-content: space-between;

  }

  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #212e3e !important;
  }


  /deep/.infoTable tr {
    pointer-events: none;
  }

  .photo {
    width: 100%;
    height: 300px;
    border: 1px solid #dfe6ec;
  }

  /deep/.el-textarea__inner {
    resize: none;
    display: block;
    line-height: 1.5;
    min-height: 75px;
    height: 75px;
  }

</style>
