<template>
  <div class="isdetail-container">
    <div class="each-item special-item">
      <div class="each-item-item">
        <div class="item-label">巡检项目：</div>
        <div class="item-context">演示项目001</div>
      </div>
      <div class="each-item-item">
        <div class="item-label">巡检子项目：</div>
        <div class="item-context">演示项目001子项001</div>
      </div>
    </div>
    <div class="each-item special-item">
      <div class="each-item-item">
        <div class="item-label">巡检人：</div>
        <div class="item-context">演示02</div>
      </div>
      <div class="each-item-item">
        <div class="item-label">巡检时间：</div>
        <div class="item-context">2021-03-26 15:44:33</div>
      </div>
    </div>
    <div class="each-item special-item">
      <div class="each-item-item">
        <div class="item-label">巡检模板：</div>
        <div class="item-context">测试巡检</div>
      </div>
      <div class="each-item-item">
        <div class="item-label">施工记录：</div>
        <el-button type="text" @click="viewRecords">查看记录</el-button>
      </div>
    </div>
    <div class="each-item special-item">
      <div class="each-item-item">
        <div class="item-label">备注：</div>
        <div class="item-context">测试1</div>
      </div>
    </div>
    <div class="each-item">
      <div class="item-label">巡检内容：</div>
      <div class="table-view">
        <el-table
          :data="tableData"
          border
          style="width: 100%; height: 100%;">
          <el-table-column
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="date"
            label="巡检项"
            width="250">
          </el-table-column>
          <el-table-column
            prop="name"
            label="巡检要求"
            width="250">
          </el-table-column>
          <el-table-column
            prop="address"
            label="巡检结果">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="each-item">
      <div class="item-label">巡检照片：</div>
        <viewer
          :images="images"
          @inited="inited"
          class="inspectionPhotos-viewer"
          ref="viewer"
        >
          <template #default="scope">
            <img v-for="src in scope.images" :src="src" :key="src" />
            {{ scope.options }}
          </template>
        </viewer>
    </div>
  </div>
</template>
<script>
import "viewerjs/dist/viewer.css";
import { component as Viewer } from "v-viewer";
export default {
  name: "isDetail",
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
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
    };
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    },
    show() {
      this.$viewer.show();
    },
    viewRecords() {
      this.$emit('showrecords')
    }
  },
};
</script>
<style lang="scss" scoped>
.isdetail-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  .each-item {
    width: 100%;
    display: flex;
    margin-bottom: 30px;
    &.special-item {
      justify-content: space-between;
    }
    .each-item-item {
      display: flex;
      ::v-deep .el-button {
        padding: 0;
      }
    }
    .item-label {
      min-width: 70px;
      font-weight: bold;
    }
    .table-view {
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      border: 1px solid #cccccc;
      overflow: auto;
      height: 360px;
    }
    .inspectionPhotos-viewer {
      img {
        margin: 0 10px;
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>