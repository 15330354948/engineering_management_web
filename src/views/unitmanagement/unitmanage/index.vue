<template>
  <div class="unitmanagement-container">
    <div class="left">
      <div class="left-title">
        {{ leftTitle }}
      </div>
      <div class="search-panel">
        <el-input
          placeholder="请输入单位类别名称"
          suffix-icon="el-icon-search"
          v-model="searchValue"
        >
        </el-input>
      </div>
      <div class="data-list">
        <div
          @click="selectUnit(item, index)"
          :class="['data-item', currentIndex === index ? 'activatedItem' : '']"
          v-for="(item, index) in dataList"
          :key="index"
        >
          {{ item.deptName }}
        </div>
      </div>
    </div>
    <div class="right">
      <!-- 弹窗组件 -->
      <!-- <Popups @dosave="saveInfo" @dclose="handleDialogClose" ref="popups" :dialogTitle="dialogInfo.dialogTitle" :dialogShow="dialogInfo.dialogShow" :dialogWidth="dialogInfo.dialogWidth">     
      </Popups> -->
      <!-- 顶部搜索 -->
      <div class="mtemplate-header-container">
        <div class="search-panel">
          <el-form
            :model="searchForm"
            status-icon
            label-width="200px"
            class="searchForm"
          >
            <el-form-item prop="name">
              <el-input
                type="text"
                placeholder="请输入姓名"
                v-model="searchForm.name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 使用该组件获取点击通知 -->
        <TableSearch :pageSign="pageSign"></TableSearch>
      </div>
      <!-- 表格 -->
      <div class="table-panel">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="
            width: calc(100% - 25px);
            height: 650px;
            left: 0;
            right: 10px;
            position: absolute;
            margin: 12.5px;
            margin-top: 0;
            overflow: auto;
          "
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="deptName" label="单位名称" width="170">
          </el-table-column>
          <el-table-column prop="deptTypeName" label="类别" width="170">
          </el-table-column>
          <el-table-column prop="addresss" label="地址" width="170">
          </el-table-column>
          <el-table-column label="资质" width="170">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-upload"
                @click="handleUpload(scope.row)"
                type="text"
                >上传</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="leader" label="人员" width="170">
          </el-table-column>
          <el-table-column prop="remake" label="备注" width="170">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row)"
                type="text"
                icon="el-icon-edit"
                >修改</el-button
              >
              <el-button
                @click="handleDelete(scope.row)"
                type="text"
                icon="el-icon-delete"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
      </div>

      <!-- 底部分页 -->
      <div class="bottom-pagination">
        <Pagination
          @pagination="handlePagination"
          :total="page.total"
          :limit="page.limit"
        ></Pagination>
      </div>

      <!-- 弹窗 -->
      <el-dialog
        :title="dialogInfo.dialogTitle"
        :visible.sync="slotStatus.creUnit"
        :width="dialogInfo.dialogWidth"
        :fullscreen="fullScreen"
      >
        <div slot="title" style="" class="header-title">
          {{ dialogInfo.dialogTitle }}
          <div
            @click="() => (fullScreen = !fullScreen)"
            class="fullscreen"
          ></div>
        </div>

        <!-- 内容 -->
        <div class="content-panel">
          <div class="left-form">
            <el-form
              :model="creAnOrganizationForm"
              :rules="rules"
              ref="creAnOrganizationForm"
              label-width="100px"
              class="demo-creAnOrganizationForm"
            >
              <div class="each-line">
                <el-form-item label="单位名称" prop="coNm">
                  <el-input v-model="creAnOrganizationForm.coNm"></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="catg">
                  <el-select
                    v-model="creAnOrganizationForm.currentlyCreatedCatg"
                    placeholder="请选择类别"
                  >
                    <el-option v-for="(item,index) in creAnOrganizationForm.catg" :key="index" :label="item.deptName" :value="item.deptId"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="each-line">
                <el-form-item label="地址" prop="addr">
                <el-input @blur="setPosition" v-model="creAnOrganizationForm.addr"></el-input>
              </el-form-item>
              <el-form-item label="定位" prop="name">
                <el-input disabled v-model="creAnOrganizationForm.name"></el-input>
                <el-button @click="handlePos" style="position:absolute;right: 0">定位</el-button>
              </el-form-item>
              </div>
              <div class="each-line"> 
                <el-form-item label="负责人" prop="principal">
                <el-input v-model="creAnOrganizationForm.principal"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="ctctInfo">
                <el-input v-model="creAnOrganizationForm.ctctInfo"></el-input>
              </el-form-item>
              </div>
              <el-form-item label="备注" prop="desc">
                <el-input
                  type="textarea"
                  v-model="creAnOrganizationForm.desc"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="right-pic">
            <el-upload
              action="/"
              class="avatar-uploader"
              :on-change="changeUpload"
              :http-request="uploadImg"
              :show-file-list="false"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>

        <div class="slot-container">
          <slot></slot>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="slotStatus = {}">取 消</el-button>
          <el-button type="primary" @click="feedback">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 修改弹窗 -->
      <el-dialog
        :title="'单位修改'"
        :visible.sync="editDialog"
        :width="'60%'"
        :fullscreen="fullScreen"
      >
        <div slot="title" style="" class="header-title">
          单位修改
          <div
            @click="() => (fullScreen = !fullScreen)"
            class="fullscreen"
          ></div>
        </div>

        <!-- 内容 -->
        <div class="content-panel">
          <div class="left-form">
            <el-form
              :model="unitModification"
              :rules="rules2"
              ref="unitModification"
              label-width="100px"
              class="demo-creAnOrganizationForm"
            >
              <div class="each-line">
                <el-form-item label="单位名称" prop="deptName">
                  <el-input v-model="unitModification.deptName"></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="parentId">
                  <el-select
                    v-model="unitModification.parentId"
                    placeholder="请选择类别"
                  >
                    <el-option v-for="(item,index) in unitModification.catg" :key="index" :label="item.deptName" :value="item.deptId"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="each-line">
                <el-form-item label="地址" prop="address">
                <el-input @blur="setPosition2" v-model="unitModification.address"></el-input>
              </el-form-item>
              <el-form-item label="定位" prop="position">
                <el-input disabled v-model="unitModification.position"></el-input>
                <el-button @click="handlePosEdit" style="position:absolute;right: 0">定位</el-button>
              </el-form-item>
              </div>
              <div class="each-line"> 
                <el-form-item label="负责人" prop="leader">
                <el-input v-model="unitModification.leader"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="unitModification.phone"></el-input>
              </el-form-item>
              </div>
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  v-model="unitModification.remark"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="right-pic">
            <el-upload
              action="/"
              class="avatar-uploader"
              :on-change="changeUpload2"
              :http-request="uploadImg"
              :show-file-list="false"
            >
              <img v-if="imageUrlEdit" :src="imageUrlEdit" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>

        <div class="slot-container">
          <slot></slot>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="slotStatus = {}">取 消</el-button>
          <el-button type="primary" @click="feedbackEdit">保 存</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="'定位'"
        :visible.sync="gps"
        :width="'50%'"
        :fullscreen="fullScreen"
      >
        <div slot="title" style="height: 43px;background: #f8f8f8;margin-left: -20px;position:absolute;z-index:20;padding-left:10px;" class="header-title">
          定位
          <div
            @click="() => (fullScreen = !fullScreen)"
            class="fullscreen"
          ></div>
        </div>
        <div class="baseMap" style="overflow: hidden;">
          <div style="display: flex; margin-left: 40px;position:absolute;z-index:20">
            <el-input
            placeholder="经度"
            v-model="insidelontitude"
            clearable
            style="margin-right:10px;">
          </el-input>
          <el-input
            placeholder="纬度"
            v-model="insidelatitude"
            clearable
            style="margin-right:10px;">
          </el-input>
          <el-button @click="locationMap">定位</el-button>
          </div>

          <div style="width: 200px;overflow: hidden">
            <gpsMap></gpsMap>
          </div>
        </div>
        <div class="slot-container">
          <slot></slot>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="lonAndLatPreservation">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 资质上传 -->
      <el-dialog
        :title="'更换资质'"
        :visible.sync="qualificationUpload"
        :width="'35%'"
        :fullscreen="fullScreen"
      >
        <div class="qualification-panel">
          <div class="manage-head">
            <span>资质管理：</span>
            <el-button @click="addQualification">添加</el-button>
          </div>
          <div class="tableset">
             <el-table
              :data="qualificationFormData"
              border
              style="width: 100%; height:300px; overflow: auto">
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="fileName"
                label="资质文件"
                width="180">
              </el-table-column>
              <el-table-column
                prop="gradecn"
                label="资质等级">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="downloadFile(scope.row)"
                    type="text"
                    icon="el-icon-bottom"
                    ></el-button
                  >
                  <el-button
                    @click="deleteFile(scope.row)"
                    type="text"
                    icon="el-icon-delete"
                    ></el-button
                  >
              </template>
            </el-table-column>
            </el-table>
          </div>
          <div></div>
        </div>
        <div slot="title" style="background: #f8f8f8;margin-left: -20px;position:absolute;z-index:20;padding-left:10px;border-radius: 20px;" class="header-title">
          更换资质
          <div
            @click="() => (fullScreen = !fullScreen)"
            class="fullscreen"
          ></div>
        </div>
        <div class="slot-container">
          <slot></slot>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="lonAndLatPreservation">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 资质文件上传 -->
      <el-dialog
        :title="'添加资质'"
        :visible.sync="qualificationDialog"
        :width="'35%'"
        :fullscreen="fullScreen"
      >
        <div class="addQualification-panel">
          <div class="qualificationLvl">
            <span>资质等级：</span>
            <el-select v-model="assetClasSelection" placeholder="请选择">
              <el-option
                v-for="item in assetClas"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="uploadAttachment">
            <span style="margin-top: 10px">上传附件：</span>
            <el-upload
              class="upload-demo"
              action="/"
              :on-change="changeFiles"
              :http-request="updatingFiles"
              :show-file-list="isSHow">
              <el-button>添加附件</el-button>
            </el-upload>
          </div>
        <div></div>
        </div>
        <div slot="title" style="background: #f8f8f8;margin-left: -20px;position:absolute;z-index:20;padding-left:10px;border-radius: 20px;" class="header-title">
          添加资质
          <div
            @click="() => (fullScreen = !fullScreen)"
            class="fullscreen"
          ></div>
        </div>
        <div class="slot-container">
          <slot></slot>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveQualification">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import gpsMap from "@/maps/gpsMap/index"
import TableSearch from "@/components/TableSearch";
import PG from '@/maps/gpsMap/pgearthBaseMap.js'
import Popups from "@/views/maintenance/components/popups/index.vue";
import { queryUnitCatg,qualificationDownload,qualificationDelete,qualificationUpload,qualificationUploadLstQuery,multChoiceDeleteUnit,deleteUnit,EditUnit,getAvatar,getCatg,newUnit,uploadFile,uploadImg,queryLatAndLon, queryUnitList } from "@/api/unitmanage/index.js";
export default {
  name: "unitmanage",
  components: {
    TableSearch,
    Popups,
    gpsMap
  },
  data() {
    return {
      // 上一次点击的名字
      lastActivatedName: "",
      slotStatus: {},
      // 当前激活选项索引
      currentIndex: -1,
      assetClasSelection: '',
      // 页面标志
      pageSign: "addrbook",
      companyId: 0,
      // 标题
      leftTitle: "所属单位",
      // 搜索的值
      searchValue: "",
      insidelontitude: '',
      insidelatitude: '',
      assetClas: [
        {
          label: '甲级',
          value: '1'
        },
        {
          label: '乙级',
          value: '2'
        },
        {
          label: '丙级',
          value: '3'
        },
      ],
      // 左栏的数据列表
      dataList: [],
      isSHow: false,
      // 当前选择单位
      currentlySelectedUnit: "",
      // 基础对比库
      oldDataList: [],
      imageUrlEdit: "",
      page: {
        total: 0,
        limit: 10,
      },
      // 创建单位表单
      creAnOrganizationForm: {},
      fullScreen: false,
      // 表格当前选中项
      selectedItem: [],
      unitModification: {},
      qualificationUpload: false,
      // 弹窗相关
      dialogInfo: {
        // dialog 标题
        dialogTitle: "",
        // dialog 显示隐藏
        dialogShow: false,
        // dialog 宽度
        dialogWidth: "",
      },
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      editDialog: false,
      searchForm: {
        name: "",
      },
      gps: false,
      // 表格数据
      tableData: [],
      // 资质表格
      qualificationFormData:[],
      imageUrl: "",
      file: {},
      qualificationFile: {},
      rules: {
        coNm: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
        currentlyCreatedCatg: [
          { required: true, message: "请选择类别", trigger: "change" },
        ],
        addr: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
      rules2: {
        deptName: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
        parentId: [
          { required: true, message: "请选择类别", trigger: "change" },
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
      qualificationDialog: false,
    };
  },
  methods: {
    // 资质保存
    async saveQualification() {
      let saveFileId = []
      let fileNmMapping = {}
      let companyQualifications = []
      for(let item of this.qualificationFile) {
        var formData = new FormData();
        formData.append("file",item.raw)
        const result = await uploadFile(formData)
        companyQualifications.push({
          companyId: this.companyId,
          fileId: result.data.fileId,
          fileName: result.data.original,
          grade: this.assetClasSelection
        })
        // img_id = fileId
        // saveFileId.push(fileId)
      }
      
      console.log(companyQualifications)
      // console.log("公司id", this.companyId)
      // console.log("文件",saveFileId.join(','))
      // console.log("保存的资质等级是", this.assetClasSelection)

      await qualificationUpload(
        companyQualifications
     )
      const result = await qualificationUploadLstQuery(this.companyId)
      this.qualificationFormData = result.data.map((item) => {
        if (item.grade === '1') {
          item.gradecn = '甲级'
        } else if (item.grade === '2') {
          item.gradecn = '乙级'
        } else {
          item.gradecn = '丙级'
        }
        return item
      })
      this.qualificationFormData = result.data
      this.qualificationDialog = false
    },
    // 文件选中
    changeFiles(file, fileList){
      this.qualificationFile = fileList
      this.isSHow = true
    },
    // 文件上传
    updatingFiles() {

    },
    // 开启资质dialog
    addQualification() {
      this.qualificationDialog = true
      this.qualificationFile = []
      this.assetClasSelection = '1'
      this.isSHow = false
    },
    async handleEdit(row) {
      if(row.imgId) {
        const result = await getAvatar(row.imgId)
        console.log(result)
        this.imageUrlEdit = result.data.url
      } else {
        this.imageUrlEdit = ""
      }
      console.log(row)
      this.editDialog = true  
      this.unitModification = row
      this.unitModification.position = row.longitude + ',' + row.latitude
      const {data} = await getCatg()
      this.$set(this.unitModification, 'catg', data)
      this.insidelontitude = row.longitude
      this.insidelatitude = row.latitude
    },
    async setPosition2() {
      let query = {
        postStr: {
          searchWord: this.unitModification.address,
          searchType: 1
        },
        tk: '1d109683f4d84198e37a38c442d68311'
      }
      const result = await queryLatAndLon(query)
      let lontitude, latitude
      if(result.data) {
        // 经度
        lontitude = result.data[0].lnt
        // 纬度
        latitude = result.data[0].lat
      } else {
        lontitude = 116.4
        latitude = 39.9
      }
      let val = lontitude.toFixed(5) + ',' +latitude.toFixed(5) 
      console.log(val)
      
      this.$set(this.unitModification, 'position', val)
      this.insidelontitude = lontitude
      this.insidelatitude = latitude
    },
    feedbackEdit() {
      this.$refs.unitModification.validate(async (valid) => {
        if(valid) {
          let img_id = ''
          console.log(this.file)
          if(JSON.stringify(this.file) != '{}') {
            var formData = new FormData();
            formData.append("file",this.file)
            const {data: {fileId}} = await uploadImg(formData)
            img_id = fileId
          }
          let data = {}
          if(img_id !== '') {
            data.imgId = img_id
          }else {
            data.imgId = this.unitModification.imgId
          }
          data.address = this.unitModification.address
          data.parentId = this.unitModification.parentId
          data.deptName = this.unitModification.deptName
          data.leader=this.unitModification.leader
          data.phone=this.unitModification.phone
          data.remark=this.unitModification.remark
          data.longitude = this.unitModification.position.split(',')[0] * 1
          data.latitude =  this.unitModification.position.split(',')[1] * 1
          data.deptId = this.unitModification.deptId
          console.log("submit",data)
          const result = await EditUnit(data)
          this.editDialog=false
          this.getList()
        } else {
          return false
        }
      })
    },
    uploadImg() {
      console.log("提交");
    },
    lonAndLatPreservation() {
      let val = this.insidelontitude + ',' + this.insidelatitude
      this.$set(this.creAnOrganizationForm, 'name', val)
      this.$set(this.unitModification, 'position', val)
      this.gps = false
    },
    changeUpload(file, filelist) {
      console.log(file, filelist);
      this.file = filelist[0].raw;
      let fileName = file.name;
      console.log(fileName);
      let regex = /(.jpg|.jpeg)$/; //匹配图片类型
      /*toLowerCase()将字符串转化为小写，返回一个新的字符串，其中的大写全部转为小写*/
      if (regex.test(fileName.toLowerCase())) {
        //URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL
        //这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },
    changeUpload2(file, filelist) {
      console.log("helloworld");
      console.log(file, filelist);
      this.file = filelist[0].raw;
      let fileName = file.name;
      console.log(fileName);
      let regex = /(.jpg|.jpeg)$/; //匹配图片类型
      /*toLowerCase()将字符串转化为小写，返回一个新的字符串，其中的大写全部转为小写*/
      if (regex.test(fileName.toLowerCase())) {
        //URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL
        //这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
        
        this.imageUrlEdit = URL.createObjectURL(file.raw);
      }
    },
    async setPosition(){
      console.log(this.creAnOrganizationForm.addr)
      let query = {
        postStr: {
          searchWord: this.creAnOrganizationForm.addr,
          searchType: 1
        },
        tk: '1d109683f4d84198e37a38c442d68311'
      }
      const result = await queryLatAndLon(query)
      let lontitude, latitude
      if(result.data) {
        // 经度
        lontitude = result.data[0].lnt
        // 纬度
        latitude = result.data[0].lat
      } else {
        lontitude = 116.4
        latitude = 39.9
      }
      let val = lontitude.toFixed(5) + ',' +latitude.toFixed(5) 
      console.log(val)
      
      this.$set(this.creAnOrganizationForm, 'name', val)
      this.insidelontitude = lontitude
      this.insidelatitude = latitude
    },
    // 分页查询
    async getList(query) {
      const result = await queryUnitList(query);
      console.log(result)
      this.page.total = result.total;
      this.tableData = result.rows.map((item) => {
        item.remake = item.remark
        item.addresss = item.address
        return item
      })
     
    },
    // 分页处理
    async handlePagination(info) {
      // console.log("分页信息为", info);
      let { page, limit } = info;
      this.page.limit = limit;
      this.query.pageNum = page;
      this.query.pageSize = limit;
      this.getList(this.query);
      // 抽出来去请求一个整体的
    },
    // 资质上传
    async handleUpload(row) {
      this.companyId = row.deptId
      console.log("这一行的数据", row);
      const result = await qualificationUploadLstQuery(row.deptId)
      this.qualificationFormData = result.data.map((item) => {
        if (item.grade === '1') {
          item.gradecn = '甲级'
        } else if (item.grade === '2') {
          item.gradecn = '乙级'
        } else {
          item.gradecn = '丙级'
        }
        return item
      })
      this.qualificationUpload = true
    },
    // 通用删除
    handleGenerDelete(config = undefined, data) {
      let hint;
      if (config) {
        hint = `确认删除已选中的 ${config.selectedItem.length} 条数据?`;
      } else {
        hint = "确认删除当前这条数据?";
      }
      this.$confirm(hint, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 执行删除逻辑
            if (config) {
            console.log(config.selectedItem)
            let deptIds = config.selectedItem.map((item) => {
              return item.deptId;
            }).join(',');
            multChoiceDeleteUnit(deptIds);
          } else {
            // 执行单选删除逻辑
            deleteUnit(data.deptId);
          }
          // 新增和修改后刷新界面
          this.msgSuccess("删除成功");
          setTimeout(() => {
            this.getList();
          }, 100);
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    // 文件下载
    async downloadFile(row) {
     
      const {data} = await qualificationDownload(row.fileId)
      console.log('下载的文件的信息', data)
      if(row.fileName.split('.')[1] === 'txt') {
        // console.log('txt')
        // var element = document.createElement('a');
        // element.setAttribute('href', data.url);
        // element.setAttribute('download', data.original);
        // console.log(element)
        // element.style.display = 'none';
        // document.body.appendChild(element);
        // element.click();
        // document.body.removeChild(element);
        this.msgWarn('暂不支持txt文件下载')
      } else {
        let link = document.createElement("a");
        //  link.href = window.URL.createObjectURL(data.url);
        link.href = data.url;
        link.download = data.original;   
        link.click();
      }
     
    },
    // 文件删除
    async deleteFile(row) {
      console.log('删除的文件的信息', row)
      await qualificationDelete(row.qualificationsId)
      const result = await qualificationUploadLstQuery(this.companyId)
      this.qualificationFormData = result.data.map((item) => {
        if (item.grade === '1') {
          item.gradecn = '甲级'
        } else if (item.grade === '2') {
          item.gradecn = '乙级'
        } else {
          item.gradecn = '丙级'
        }
        return item
      })
      this.msgSuccess('删除成功')
    },
    // 删除
    handleDelete(row) {
      console.log("这一行的信息", row);
      this.handleGenerDelete(undefined, row);
    },
    // 单位选择
    selectUnit(item, index) {
      if (this.lastActivatedName === "") {
        this.currentIndex = index;
        this.lastActivatedName = item.deptName;
        // 待对接接口，刷新界面，根据name重新请求
        let query = Object.assign(this.query, { parentId: item.deptId });
        console.log(item)
        console.log("?????",query);
        this.getList(query);
        this.currentlySelectedUnit = item.deptId
      } else if (
        this.lastActivatedName !== "" &&
        this.lastActivatedName !== item.deptName
      ) {
        this.currentIndex = index;
        this.lastActivatedName = item.deptName;
        // 待对接接口，刷新界面，根据name重新请求
        let query = Object.assign(this.query, { parentId: item.deptId });
        console.log("?????",query);
        this.currentlySelectedUnit = item.deptId
        this.getList(query);
      } else {
        this.currentIndex = -1;
        this.lastActivatedName = "";
        // 待对接接口，刷新界面，请求所有数据
        delete this.query.parentId;
        this.currentlySelectedUnit = ""
        this.getList(this.query);
      }
    },
    // 多选处理
    handleSelectionChange(selection) {
      this.selectedItem = selection;
    },
    saveInfo() {
      // 对应的表单数据
      let whichOne = Object.entries(this.slotStatus)[0][0];
      let ref = this.$refs[whichOne];
      let formVal = this.$refs[whichOne][whichOne + "Form"];
      if (ref.formInvalid) {
        // 校验成功，执行保存逻辑, Task 必选的逻辑需要优化
        console.log("保存值为:", formVal);
        this.handleDialogClose();
      }
    },
    // 弹窗关闭处理
    handleDialogClose() {
      this.dialogInfo.dialogShow = false;
      this.slotStatus = {};
    },
    // 保存
    async feedback() {
      this.$refs.creAnOrganizationForm.validate(async (valid) => {
        if(valid) {
          let img_id = ''
          console.log(this.file)
          if(JSON.stringify(this.file) != '{}') {
            var formData = new FormData();
            formData.append("file",this.file)
            const {data: {fileId}} = await uploadImg(formData)
            img_id = fileId
          }
          let data = {}
          if(img_id !== '') {
            data.imgId = img_id
          }
          data.address = this.creAnOrganizationForm.addr
          data.parentId = this.creAnOrganizationForm.currentlyCreatedCatg
          data.deptName = this.creAnOrganizationForm.coNm
          data.leader=this.creAnOrganizationForm.principal
          data.phone=this.creAnOrganizationForm.ctctInfo
          data.remark=this.creAnOrganizationForm.desc
          console.log(data)
          setTimeout(async () => {
            data.longitude = this.creAnOrganizationForm.name.split(',')[0] * 1
          data.latitude =  this.creAnOrganizationForm.name.split(',')[1] * 1
            const result = await newUnit(data)
            this.slotStatus.creUnit=false
            this.getList({parentId: this.currentlySelectedUnit})
          }, 100);
        } else {
          return false
        }
      })
    },
    // 定位
    handlePos() {
       const addrStatus = this.$refs.creAnOrganizationForm.validateField('addr', addrError => {
        if (!addrError) {
          // 唤起地图
          this.gps = true
          
          setTimeout(() => {
            PG.fly({longitude: this.insidelontitude*1, latitude: this.insidelatitude*1})
            PG.leftClick((e) => {
              console.log("helo", e)
              this.insidelontitude = e.longitude.toFixed(5)
              this.insidelatitude = e.latitude.toFixed(5)
              PG.fly({longitude: this.insidelontitude*1, latitude: this.insidelatitude*1})
            })
            }, 100);
        } else {
          return false;
        }
      })
    },
    // 修改定位
    handlePosEdit() {
       const addrStatus = this.$refs.unitModification.validateField('address', addrError => {
        if (!addrError) {
          // 唤起地图
          this.gps = true
          
          setTimeout(() => {
            PG.fly({longitude: this.insidelontitude*1, latitude: this.insidelatitude*1})
            PG.leftClick((e) => {
              console.log("helo", e)
              this.insidelontitude = e.longitude.toFixed(5)
              this.insidelatitude = e.latitude.toFixed(5)
              PG.fly({longitude: this.insidelontitude*1, latitude: this.insidelatitude*1})
            })
            }, 100);
        } else {
          return false;
        }
      })
    },
    locationMap() {
    console.log( this.insidelontitude, this.insidelatitude)
      PG.fly({longitude: this.insidelontitude*1, latitude: this.insidelatitude*1})
    },
  },
  async created() {
    // const result = await queryUnitCatg({
    //   dictType: "cqndt_company_type",
    // });
    const result = await getCatg()
    console.log("单位类别数据为:", result);
    // mock
    // this.oldDataList = this.dataList = [
    //   {name: '测试数据1'},
    //   {name: '测试数据2'},
    //   {name: '测试数据3'},
    //   {name: '测试数据4'},
    //   {name: '测试数据5'},
    //   {name: '测试数据6'},
    //   {name: '测试数据7'}
    // ]
    this.oldDataList = this.dataList = result.data;
    this.getList(this.query);
    this.$bus
      .$off(`${this.pageSign}SearchClick`)
      .$on(`${this.pageSign}SearchClick`, () => {
        console.log("已监听到搜索");
        console.log(this.searchForm);
        let query = {};
        if(this.searchForm.name !== "") {
          query.deptName = this.searchForm.name;
        }
        query = Object.assign(this.query, query)
        this.getList(query);
      });
    this.$bus
      .$off(`${this.pageSign}ResetClick`)
      .$on(`${this.pageSign}ResetClick`, () => {
        console.log("已监听到重置");
        this.searchForm = {};
        delete this.query.deptName
        this.getList(this.query);
      });
    this.$bus
      .$off(`${this.pageSign}CreateClick`)
      .$on(`${this.pageSign}CreateClick`, async() => {
        console.log("已监听到创建");
        this.insidelontitude = -1
        this.insidelatitude = -1
        this.creAnOrganizationForm = {}
        if(this.currentlySelectedUnit!=='') {
          // 清除传入
          this.file = {};
          this.imageUrl = "";
          this.slotStatus = {
            creUnit: true,
          };
          const {data} = await getCatg()
          this.creAnOrganizationForm.catg = data
          this.creAnOrganizationForm.currentlyCreatedCatg = this.currentlySelectedUnit
          this.dialogInfo = {
            dialogShow: true,
            dialogTitle: "单位新增",
            dialogWidth: "60%",
          };
        } else {
          this.msgWarn("请先在左侧选择一项参与方")
        }
      });
    this.$bus
      .$off(`${this.pageSign}ImportClick`)
      .$on(`${this.pageSign}ImportClick`, () => {
        this.msgInfo("导入功能确定中");
      });
    this.$bus
      .$off(`${this.pageSign}ExportClick`)
      .$on(`${this.pageSign}ExportClick`, () => {
        this.msgInfo("导出功能确定中");
      });
    this.$bus
      .$off(`${this.pageSign}DeleteClick`)
      .$on(`${this.pageSign}DeleteClick`, () => {
        if (this.selectedItem.length > 0) {
          this.handleGenerDelete(
            { selectedItem: this.selectedItem },
            this.selectedItem
          );
        } else {
          this.$message({
            message: "请勾选数据",
            type: "warning",
          });
        }
      });
  },
  watch: {
    searchValue: {
      handler(val) {
        if (val.length > 0) {
          this.dataList = [];
          for (let item of this.oldDataList) {
            if (item.deptName.indexOf(val) != -1) {
              this.dataList.push(item);
            }
          }
        } else {
          this.dataList = this.oldDataList;
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.unitmanagement-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 10px;
  display: flex;
  .left {
    width: 336px;
    height: 100%;
    border: 1px solid #e4e4e4;
    .left-title {
      width: 100%;
      height: 40px;
      background: #f2f2f2;
      font-weight: 700;
      font-size: 15px;
      display: flex;
      align-items: center;
      padding-left: 12px;
    }
    .search-panel {
      width: 100%;
      height: 60px;
      padding: 10px;
    }
    .data-list {
      height: calc(100% - 100px);
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: none;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: none;
        background-color: #d9e1e6;
      }

      .data-item {
        width: 100%;
        height: 33px;
        padding: 10px;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;

        &:hover {
          background: #dce5fa;
        }

        &.activatedItem {
          background: #dce5fa;
        }
      }
    }
  }
  .right {
    flex: 1;
    height: 100%;
    margin-left: 20px;
    border: 1px solid #e4e4e4;
    position: relative;
    // 表格
    .table-panel {
      position: relative;
      width: 100%;
      height: 650px;
    }
    .mtemplate-header-container {
      display: flex;
      align-items: center;
      width: 100%;
      height: 50px;
      .search-panel {
        width: 200px;
        height: 50px;
        .searchForm {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          padding-left: 10px;
          ::v-deep .el-form-item {
            margin: 0;
          }
          ::v-deep .el-form-item__content {
            margin: 0 !important;
            margin-right: 10px !important;
          }
        }
      }
      // 底部分页
      .bottom-pagination {
        position: absolute;
        bottom: 0px;
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }
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
  .baseMap {
    width: 100%;
    height: 300px;
    margin-left: -20px;
  }
  .addQualification-panel {
    width: 100%;
    height: 100%;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    .qualificationLvl{
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .uploadAttachment {
      display: flex;
    }
  }
  .qualification-panel {
    width: 100%;
    height: 100%;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;

    .manage-head {
      display: flex;
      align-items: center;
    }

    .tableset {
      margin-top: 20px;
    }
  }
  .content-panel {
    width: 100%;
    height: 100%;
    margin-bottom: 20px;
    display: flex;

    .left-form {
      flex: 1;
      .each-line {
        display: flex;
        justify-content: space-between;
        ::v-deep .el-input {
          width: 300px; 
        }
      }
    }
    .right-pic {
      width: 200px;
      margin: 0 0 0 50px;
    }
  }
  ::v-deep .el-dialog__body {
    max-height: 1200px;
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
  .avatar-uploader ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>