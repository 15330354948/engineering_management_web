<template>
  <div class="popups-container">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @closed="handleBeforeClose"
      :width="dialogWidth"
      :fullscreen="fullScreen"
      >
      <div slot="title" style="" class="header-title">
        {{dialogTitle}}
        <div @click="()=>fullScreen = !fullScreen" class="fullscreen"></div>
      </div>

      <div class="slot-container">
        <slot></slot>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="feedback">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Popups',
    props: {
      // dialog 标题
      dialogTitle: String,
      // dialog 宽度
      dialogWidth: String,
      // dialog 显示隐藏
      dialogShow: Boolean
    },
    data() {
      return {
        // dialog 显示隐藏
        dialogVisible: false,
        // 是否全屏
        fullScreen: false
      }
    },
    watch: {
      dialogShow: {
        handler(val) {
          this.dialogVisible = val
        }
      }
    },
    methods: {
      // 通知父组件关闭情况
      handleBeforeClose() {
        this.$emit('dclose')
      },
      // 通知父组件保存情况
      feedback() {
        this.$bus.$emit('dosave')
        this.$emit('dosave')
      }
    }
  }
</script>

<style lang="scss" scoped>
.popups-container {
  ::v-deep .el-dialog {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    .header-title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .fullscreen {
        width: 14px;
        height: 14px;
        border: 1px solid #606266;
        margin-right: 10px;
        cursor: pointer;
        &:hover {
          border-color: #409eff;
        }
      }
    }
  }
  ::v-deep .el-dialog__body {
    max-height: 600px;
    overflow: auto;
    margin-bottom: 20px;
    &::-webkit-scrollbar-thumb {
      background-color: #d9e1e6 !important;
    }
    .slot-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
  ::v-deep .el-dialog__header {
    background: #f8f8f8;
    padding: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 20px;
    border-radius: 6px;
  }
  ::v-deep .el-dialog__title {
    font-size: 15px;
    font-weight: 700;
    color: #606266;
  }
  ::v-deep .el-dialog__footer {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  ::v-deep .el-dialog__headerbtn {
    position: inherit;
    color: #606266;
  }
}
</style>