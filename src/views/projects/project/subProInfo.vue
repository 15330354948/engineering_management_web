<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="5">
        <div class="subList">
          <div class="header">
            <span>监测列表</span>
            <span class="addItem" @click="addPoint">添加测点</span>
          </div>
          <div class="treeList">
            <el-input class="searchInput" placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
            <el-tree class="filter-tree" :data="treeData" :props="defaultProps" default-expand-all highlight-current
              :filter-node-method="filterNode" ref="tree" node-key="id">
            </el-tree>
          </div>
        </div>
      </el-col>

      <el-col :span="19">
        <el-form :model="infoForm" ref="infoForm" :rules="rules" :inline="true" label-width="85px">
          <el-form-item label="测点名称" prop="pointName">
            <el-input v-model="infoForm.pointName" placeholder="请输入测点名称" clearable size="small"
              :disabled="isDisabled" />
          </el-form-item>
          <el-form-item label="设计经纬度" prop="LongAndLatitude">
            <el-input v-model="infoForm.LongAndLatitude" placeholder="请输入设计经纬度" clearable size="small"
              :disabled="isDisabled">
              <el-button style="padding-right:10px" slot="suffix" type="text" v-if="isDisabled==false">选择</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="devType">
            <el-select v-model="infoForm.devType" placeholder="请选择设备类型" clearable size="small" :disabled="isDisabled">
              <el-option v-for="dict in devTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备ID" prop="devId" v-if="isDisabled==true">
            <el-input v-model="infoForm.devId" size="small" disabled />
          </el-form-item>
        </el-form>
        <div class="dialog-footer" v-if="isDisabled==false">
          <el-button type="primary" @click="infoSubmitForm">确 定</el-button>
          <el-button @click="infoCancel">取 消</el-button>
        </div>

        <div class="testInfo" v-if="isDisabled==true && contnentShow == true">
          <el-collapse v-model="opened">
            <el-collapse-item name="1">
              <template slot="title">
                <div class="topTilte">
                  <span class="text">基础定位</span>
                  <div class="text">
                    <span>审核中</span>
                  </div>
                </div>
              </template>
              <div class="content"></div>
              <p>备注：</p>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template slot="title">
                <div class="topTilte">
                  <span class="text">基础建设</span>
                  <div class="text">
                    <span class="delete">删除</span>
                    <span>审核中</span>
                  </div>
                </div>
              </template>
              <div class="content"></div>
              <p>备注：</p>
            </el-collapse-item>
            <el-collapse-item name="3">
              <template slot="title">
                <div class="topTilte">
                  <span class="text">设备安装</span>
                  <div class="text">
                    <span class="delete">删除</span>
                    <span>审核中</span>
                  </div>
                </div>
              </template>
              <div class="content"></div>
              <p>备注：</p>
            </el-collapse-item>
            <el-collapse-item name="4">
              <template slot="title">
                <div class="topTilte">
                  <span class="text">设备调试</span>
                </div>
              </template>
              <div class="content"></div>
              <p>备注：</p>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  export default {
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      treeData: {
        immediate: true,
        handler(val) {
          if (val.length > 0) {
            this.contnentShow = true
          } else {
            this.contnentShow = false
          }
        },

      }
    },
    computed: {
      opened() {
        return this.activeName.map((g) => {
          return g
        });
      }
    },
    created() {
      this.$nextTick(() => {
        // treeBox 元素的ref   value 绑定的node-key
        this.$refs.tree.setCurrentKey(1);
      });
    },
    data() {
      return {
        //   手风琴默认展开
        activeName: ['1', '2', '3', '4'],
        filterText: '',
        // 子项详情
        infoForm: {},
        isDisabled: true,
        contnentShow: false,
        // 设备类型
        devTypeOptions: [],
        // 树形
        treeData: [{
          id: 1,
          label: '一级 1',
        }, {
          id: 2,
          label: '一级 2',
        }, {
          id: 3,
          label: '一级 3',
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        rules: {
          pointName: [{
            required: true,
            message: "测点名称不能为空",
            trigger: "blur"
          }],
          LongAndLatitude: [{
            required: true,
            message: "经纬度不能为空",
            trigger: "blur"
          }],
          devType: [{
            required: true,
            message: "设备类型不能为空",
            trigger: "blur"
          }],
        }
      }
    },
    methods: {
      filterNode(value, data) {
        console.log(data.label);
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      //   添加测点
      addPoint() {
        this.isDisabled = false
      },
      infoSubmitForm() {

      },
      infoCancel() {
        this.resetForm("infoForm");
        this.isDisabled = true;
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

  .subList .header .addItem {
    font-weight: normal;
    color: #66b1ff;
    cursor: pointer;
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

  .topTilte .text {
    padding: 0 10px;
  }

  .topTilte .text span {
    padding: 0 3px;
  }

  .topTilte .text .delete {
    color: #409eff;
  }

  /deep/ #el-collapse-head-5187 {
    background-color: #f8f8f9;
  }

  /deep/ .el-collapse-item__header {
    border: 1px solid #e6e6e6;
  }

  /deep/ .el-collapse-item__content {
    padding-bottom: 0
  }

  /deep/ .el-collapse {
    border-top: none;
    border-bottom: none;
  }

  /deep/ .is-active {
    border-bottom: none;
  }

  /deep/ .el-collapse-item {
    margin: 10px 0;
    border-bottom: none;

    border-bottom: none;
  }

  /deep/ .el-collapse-item__wrap {
    border-bottom: none;
  }

  .testInfo .content {
    height: 200px;
    border: 1px solid #e6e6e6;
  }

  .testInfo p {
    font-weight: bold;
    line-height: 0;
  }

  /deep/ .el-col-19 {
    height: 700px;
    overflow: scroll;
  }

</style>
