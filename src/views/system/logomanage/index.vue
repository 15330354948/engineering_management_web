<template>
  <div class="logomanage-container">
    <div class="pcLogo">
      <div class="logo-title">PC端</div>
      <div class="logo-set">
        <el-form ref="pcform" :model="pcform" :rules="pcrules" label-width="80px">
          <el-form-item label="登录Logo">
            <el-upload
              :class="!disableEdit?'show':'hide'"
              :on-change="uploadImage"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture"
              :file-list="fileList">
              <div class="el-upload__text" v-if="!disableEdit">更改图片</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="系统名称" prop="systemName">
            <el-input :disabled="disableEdit" v-model="pcform.systemName"></el-input>
          </el-form-item>
          <el-form-item label="登录Logo">
            <el-upload
              :class="!disableEdit?'show':'hide'"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture"
              :file-list="fileList">
              <div class="el-upload__text" v-if="!disableEdit">更改图片</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="管理平台名称" prop="mplatFormName">
            <el-input :disabled="disableEdit" v-model="pcform.mplatFormName"></el-input>
          </el-form-item>
          <el-form-item label="登录Logo">
            <el-upload
              :class="!disableEdit?'show':'hide'"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture"
              :file-list="fileList">
              <div class="el-upload__text" v-if="!disableEdit">更改图片</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="监管平台名称" prop="regulatoryPlatformNm">
            <el-input :disabled="disableEdit" v-model="pcform.regulatoryPlatformNm"></el-input>
          </el-form-item>
          <el-form-item v-if="disableEdit">
            <el-button type="primary" @click="onEdit">编辑</el-button>
          </el-form-item>
          <el-form-item v-else>
            <el-button type="primary" @click="onSave">保存</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="appLogo">
      <div class="logo-title">APP</div>
      <div class="logo-set">
        <el-form ref="appform" :model="appform" :rules="apprules" label-width="80px">
          <el-form-item label="登录Logo">
            <el-upload
              :class="!disableEdit?'show':'hide'"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture"
              :file-list="fileList">
              <div class="el-upload__text" v-if="!disableEdit">更改图片</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="系统名称" prop="systemName">
            <el-input :disabled="disableEdit" v-model="appform.systemName"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="noneLogo"></div>
  </div>
</template>

<script>
export default {
  name: "logoManage",
  data() {
    return {
      pcform: {
        
      },
      appform: {

      },
      // 禁用编辑
      disableEdit: true,
      fileList: [{name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      // pcrule
      pcrules: {
        systemName: [
          { required: true, message: '请填写PC系统名称', trigger: 'change' }
        ],
        mplatFormName: [
          { required: true, message: '请填写管理平台名称', trigger: 'change' }
        ],
        regulatoryPlatformNm: [
          { required: true, message: '请填写监管平台名称', trigger: 'change' }
        ]
      },
      apprules: {
        systemName: [
          { required: true, message: '请填写App系统名称', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    onEdit() {
      this.disableEdit = false
    },
    onSave() {
      this.disableEdit = true
    },
    onCancel() {
      this.disableEdit = true
    },
    uploadImage(response, file, fileList) {
      console.log(response, file, fileList)
    }
  },
};
</script>

<style lang="scss" scoped>
.logomanage-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  .noneLogo {
    flex: 1;
  }
  .pcLogo {
    flex: 2;
    box-sizing: border-box;
    .logo-title {
      margin-left: 20px;
      margin-top: 40px;
      font-weight: bold;
    }
    .logo-set {
      padding: 50px 20px;
      ::v-deep .el-form-item  {
        display: flex;
        justify-content: center;
      }
      ::v-deep .el-form-item__label {
        flex: 1;
      }
      ::v-deep .el-form-item__content {
        flex: 5;
        margin-left: 10px !important;
        .el-button:nth-child(1) {
          margin-top: 50px;
          margin-left: 100px;
        }
      }
      ::v-deep .is-ready {
        display: none;
      }
      ::v-deep .is-uploading {
        transition: none !important;
        display: none;
      } 
      ::v-deep .el-upload {
        width: 100%;
        height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        font-size: 35px;
        z-index: 2;
      }
      ::v-deep .el-upload-list {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
      ::v-deep .el-upload-list__item {
        margin: 0 !important;
      }
      .el-upload__text {
        position: absolute;
        bottom: 0px;
        font-size: 16px;
        color: #1890ff;
      }
      .hide {
        ::v-deep .el-upload {
          z-index: 0 !important;
        }
        ::v-deep .el-upload-list__item-status-label {
          display: none;
        }
        ::v-deep .el-icon-close {
          display: none;
        }
      }
      .show {
        ::v-deep .el-upload-list__item-status-label {
          display: none;
        }
        ::v-deep .el-icon-close {
          display: none;
        }
      }
    }
  }
  .appLogo {
    flex: 2;
    box-sizing: border-box;
    .logo-title {
      margin-left: 20px;
      margin-top: 40px;
      font-weight: bold;
    }
    .logo-set {
      padding: 50px 20px;
      ::v-deep .el-form-item  {
        display: flex;
        justify-content: center;
      }
      ::v-deep .el-form-item__label {
        flex: 1;
      }
      ::v-deep .el-form-item__content {
        flex: 5;
        margin-left: 10px !important;
      }
      ::v-deep .el-upload {
        width: 100%;
        height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        font-size: 35px;
        z-index: 2;
      }
      ::v-deep .el-upload-list {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
      ::v-deep .el-upload-list__item {
        margin: 0 !important;
      }
      .el-upload__text {
        position: absolute;
        bottom: 0px;
        font-size: 16px;
        color: #1890ff;
      }
      .hide {
        ::v-deep .el-upload {
          z-index: 0 !important;
        }
        ::v-deep .el-upload-list__item-status-label {
          display: none;
        }
        ::v-deep .el-icon-close {
          display: none;
        }
      }
      .show {
        ::v-deep .el-upload-list__item-status-label {
          display: none;
        }
        ::v-deep .el-icon-close {
          display: none;
        }
      }
    }
  }
}
</style>