<template>
  <div class="subProInfo">
    <el-row :gutter="24">
      <el-col :span="5">
        <div class="subList">
          <div class="header">
            <span>测点列表</span>
            <div class="rightBtn">
              <el-button type="text" :disabled="multiple" @click="delPoint">删除</el-button>
              <el-button type="text" @click="addPoint">添加测点</el-button>
            </div>
          </div>
          <div class="treeList">
            <el-input class="searchInput" placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
            <el-tree class="filter-tree" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
              show-checkbox default-expand-all highlight-current :filter-node-method="filterNode" ref="tree"
              node-key="spotId" @check-change="handleCheckChange" :render-content="renderContent">
            </el-tree>
          </div>
        </div>
      </el-col>

      <el-col :span="19">
        <el-form :model="infoForm" ref="infoForm" :rules="rules" :inline="true" label-width="100px">
          <el-form-item label="测点名称" prop="spotName">
            <el-input v-model="infoForm.spotName" placeholder="请输入测点名称" clearable size="small" :disabled="isDisabled" />
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="infoForm.longitude" placeholder="请输入经度" clearable size="small" :disabled="isDisabled">
              <el-button style="padding-right:10px" slot="suffix" type="text" v-if="isDisabled==false"
                @click="getLocation">定位</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="infoForm.latitude" placeholder="请输入纬度" clearable size="small" :disabled="isDisabled">
              <el-button style="padding-right:10px" slot="suffix" type="text" v-if="isDisabled==false"
                @click="getLocation">定位</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="equipmentType">
            <el-select v-model="infoForm.equipmentType" placeholder="请选择设备类型" clearable size="small"
              :disabled="isDisabled">
              <el-option v-for="dict in devTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备ID" prop="equipmentId" v-if="isDisabled==true">
            <el-input v-model="infoForm.equipmentId" size="small" disabled />
          </el-form-item>
          <el-form-item label="手机卡类型" prop="phoneType">
            <el-select v-model="infoForm.phoneType" placeholder="请选择手机卡类型" clearable size="small"
              :disabled="isDisabled">
              <el-option v-for="dict in devTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="卡号" prop="cardId">
            <el-input v-model="infoForm.cardId" size="small" placeholder="请输入手机卡号" :disabled="isDisabled" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer" v-if="isDisabled==false">
          <el-button type="primary" @click="infoSubmitForm">确 定</el-button>
          <el-button @click="infoCancel">取 消</el-button>
        </div>

        <div class="testInfo" v-if="isDisabled == true  && contnentShow == true">
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
              <div class="content">
                <div class="photo">
                  <viewer :images="images" @inited="inited" class="inspectionPhotos-viewer" ref="viewer">
                    <template>
                      <span class="border" v-for="(item,ind) in (imageList[index] ? imageList[index].fileList : '')"
                        :key="ind">
                        <img class="viewer_image" :src="item.url" />
                        <div class="fileName">{{item.fileName}}</div>
                      </span>

                      <!-- {{ scope.options }} -->
                    </template>
                  </viewer>
                </div>
              </div>
              <p>备注：</p>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="dialog-footer" v-if="isDisabled">
          <el-button type="primary">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-col>

    </el-row>

    <el-dialog title="定位" :visible.sync="lonLatOpen" v-if="lonLatOpen" width="1000px" append-to-body>
      <lon-lat></lon-lat>
    </el-dialog>
  </div>
</template>

<script>
  import TreeRender from '@/components/TreeRender'
  import LonLat from "@/components/Location";
  import {
    addSpot,
    listSpot,
    deleteSpot,
    infoSpot
  } from "@/api/projects/project";
  import "viewerjs/dist/viewer.css";
  import {
    component as Viewer
  } from "v-viewer";
  export default {
    components: {
      Viewer,
      LonLat
    },
    props: ["subProjectId"],
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      treeData: {
        immediate: true,
        handler(val) {
          if (val.length > 0) {
            this.$nextTick(() => {
              // console.log(this.$refs.tree);
              console.log(this.$refs.tree);
              this.$refs.tree.setCurrentKey(val[0].spotId)
            })
            infoSpot(val[0].spotId).then(res => {
              res.data.equipmentType += ""
              this.infoForm = res.data;
            })
            this.contnentShow = true
          } else {
            this.contnentShow = false
          }
        },
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
      this.getDicts("cqndt_equipment_type").then(response => {
        this.devTypeOptions = response.data;
      });
      this.getList();
      this.$nextTick(() => {
        // treeBox 元素的ref   value 绑定的node-key
        this.$refs.tree.setCurrentKey(1);
      });

      this.$bus.$off("getPoints");
      this.$bus.$on("getPoints", (points) => {
        if (points.longitude && points.latitude) {
          console.log(points);
          this.infoForm.longitude = points.longitude
          this.infoForm.latitude = points.latitude
          this.lonLatOpen = false
        }
      })
    },
    data() {
      return {
        imageList: [],
        images: [
          "https://picsum.photos/200/200",
          "https://picsum.photos/300/200",
          "https://picsum.photos/250/200",
        ],
        //   手风琴默认展开
        activeName: ['1', '2', '3', '4'],
        icon: 'el-icon-delete',
        filterText: '',
        // 子项详情
        infoForm: {},
        isDisabled: true,
        contnentShow: false,
        // 设备类型
        devTypeOptions: [],
        lonLatOpen: false,
        data: [{
            id: 0,
            name: '基础定位',
            state: '审核中'
          },
          {
            id: 1,
            name: '基础建设',
            state: '审核中'
          },
          {
            id: 2,
            name: '设备安装',
            state: '审核中'
          },
          {
            id: 3,
            name: '设备调试',
            state: '审核中'
          },
        ],
        // 非多个禁用
        multiple: true,
        // 树形
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'spotName'
        },
        rules: {
          spotName: [{
            required: true,
            message: "测点名称不能为空",
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
          equipmentType: [{
            required: true,
            message: "设备类型不能为空",
            trigger: "blur"
          }],
          phoneType: [{
            required: true,
            message: "手机卡类型不能为空",
            trigger: "blur"
          }],
          cardId: [{
            required: true,
            message: "卡号不能为空",
            trigger: "blur"
          }],
        },
        selectArr: [],
        treeIndex: false
      }
    },
    methods: {
      inited(viewer) {
        this.$viewer = viewer;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.spotName.indexOf(value) !== -1;
      },
      //   添加测点
      addPoint() {
        this.isDisabled = false
        this.infoForm = {}
      },
      delPoint() {
        var _this = this;
        this.$confirm('是否确认删除项目编号为"' + _this.selectArr + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return deleteSpot(_this.selectArr);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      getList() {
        listSpot({
          subProjectId: this.subProjectId
        }).then(res => {
          if (res.rows.length > 0) {
            this.imageList = res.rows[this.treeIndex || 0].list
            this.treeData = res.rows
            this.treeData.forEach(item => {
              this.$set(item, 'loading', false)
            })
          }

          this.multiple = true
        })
      },
      infoSubmitForm() {
        this.$refs["infoForm"].validate(valid => {
          if (valid) {
            addSpot(Object.assign({
              subProjectId: this.subProjectId
            }, this.infoForm)).then(res => {
              this.msgSuccess("新增成功");
              this.isDisabled = true;
              this.getList();
            })
          }
        })
      },
      infoCancel() {
        this.resetForm("infoForm");
        this.getList();
        this.isDisabled = true;
      },
      cancel() {
        this.$emit("closeDialog");
      },
      handelDel(event) {
        event.stopPropagation();
        this.$confirm('您确定要删除该数据?', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {

        }).then(() => {
          this.msgSuccess("删除成功");
        })
      },
      renderContent(h, {
        node,
        data,
        store
      }) {
        let that = this; //指向vue
        return h(TreeRender, {
          props: {
            DATA: data, //节点数据
            NODE: node, //节点内容
            STORE: store, //完整树形内容
            ICON: this.icon
          },
          on: { //绑定方法
            nodeDel: ((s, d, n) => that.handleDelete(s, d, n))
          }
        });
      },
      getLocation() {
        this.lonLatOpen = true;
      },
      // 树形点击 
      handleNodeClick(data) {
        this.isDisabled = true;
        this.treeData.forEach(item => {
          item.loading = false
        })
        data.loading = true
        this.imageList = data.list
        infoSpot(data.spotId).then(res => {
          data.loading = false
          res.data.equipmentType += ""
          this.infoForm = res.data;
        })

      },
      handleCheckChange(data, checked, indeterminate) {
        var arr = this.$refs.tree.getCheckedNodes(true, false)
        // 赋值
        this.selectArr = []
        arr && arr.length && arr.forEach(item => {
          this.selectArr.push(item.spotId)
        })
        this.multiple = !this.selectArr.length
      },
      handleDelete(s, d, n) { //删除节点
        console.log(s, d, n);
        this.$confirm("是否删除此节点？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return deleteSpot(d.spotId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      }
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

  ::v-deep .el-tree-node__content>label.el-checkbox {
    margin-left: 5px;
  }

  ::v-deep .el-tree-node__expand-icon.is-leaf {
    display: none;
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

  .photo {
    width: 100%;
    padding: 10px;
  }

  .photo .inspectionPhotos-viewer {
    display: flex;
  }

  .photo .border {
    display: inline-block;
    height: 100%;
    border: 1px solid #dfe6ec;
    margin: 5px 5px 0 5px;
    position: relative;
  }

  .photo .viewer_image {
    height: 120px;
    padding: 5px 5px 0 5px;
  }

  .photo .fileName {
    width: 100%;
    height: 30px;
    background-color: rgba(0, 0, 0, .3);
    position: absolute;
    left: 0;
    bottom: 0;
    color: #fff;
    line-height: 30px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

</style>
