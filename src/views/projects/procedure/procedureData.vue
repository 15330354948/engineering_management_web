<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="工序管理名称" prop="procedureName">
        <el-input v-model="form.procedureName" placeholder="请输入工序管理名称" />
      </el-form-item>
      <el-form-item label="工序">
        <el-row>
          <el-col :span="8" style="padding-right:5px">
            <div class="left-content">
              <div class="title">工序名称
                <i class="el-icon-plus" @click="handleAddProcess"></i>
              </div>
              <div class="container">
                <div class="item" @click="handleItem(index,item)" v-for="(item,index) in nameList" :key="index" :class="nameIndex==index?'activeItem':''">
                  <span>{{item}}</span>
                  <div class="item-operation">
                    <i class="el-icon-edit-outline" @click.stop="handleUpdateProcess(index)"></i>
                    <i class="el-icon-delete-solid" @click.stop="handleDelteProcess(index)"></i>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="16" style="padding-left:5px">
            <div class="right-content" v-if="nameIndex>=0">
              <div class="title" style="margin-bottom:15px">配置</div>
              <el-form-item class="is-required" label="工序名称">
                <el-input v-model="form.cqndtSubProcedureList[nameIndex].procedureName" disabled placeholder="请选择左侧名称" />
              </el-form-item>
              <el-form-item class="is-required" label="工序类型">
                <el-select @change="handleChange" v-model="form.cqndtSubProcedureList[nameIndex].type" placeholder="请选择工序类型类型" clearable>
                  <el-option
                    v-for="dict in typeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="is-required" label="参与审核权限">
                <el-select @change="handleChange" v-model="form.cqndtSubProcedureList[nameIndex].auditAuthority" placeholder="请选择参与审核权限" :multiple="true" clearable>
                  <el-option
                    v-for="dict in auditAuthorityOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="is-required" label="施工限制范围">
                以设计经纬度半径<el-input @change="handleChange" style="width:120px;margin:0 5px" v-model="form.cqndtSubProcedureList[nameIndex].buildLimit" placeholder="请输入范围" />米，范围内
              </el-form-item>
              <el-form-item label="操作指南">
                <el-col :span="4">
                  <el-switch @click="handleChange" v-model="form.cqndtSubProcedureList[nameIndex].operationGuide"></el-switch>
                </el-col>
                <el-col :span="20" v-if="form.cqndtSubProcedureList[nameIndex].operationGuide">
                  <el-upload
                  ref="upload"
                  class="upload-demo"
                  :headers="upload.headers"
                  :action="upload.url"
                  :on-preview="handlePreview"
                  :on-remove="function(file,fileList){return handleRemove(file,fileList,1)}"
                  :before-remove="beforeRemove"
                  :on-progress="handleFileUploadProgress"
                  :on-success="function(res,file){return handleFileSuccess(res,file,1)}"
                  multiple
                  :file-list="form.cqndtSubProcedureList[nameIndex].authorityFiles">
                  <el-button size="small" type="text">上传附件</el-button>
                </el-upload>
                </el-col>
              </el-form-item>
              <el-form-item label="安全规范">
                <el-col :span="4">
                  <el-switch @change="handleChange" v-model="form.cqndtSubProcedureList[nameIndex].safetySpecification"></el-switch>
                </el-col>
                <el-col :span="20" v-if="form.cqndtSubProcedureList[nameIndex].safetySpecification">
                  <el-upload
                  ref="upload"
                  class="upload-demo"
                  :headers="upload.headers"
                  :action="upload.url"
                  :on-preview="handlePreview"
                  :on-remove="function(file,fileList){return handleRemove(file,fileList,2)}"
                  :before-remove="beforeRemove"
                  :on-progress="handleFileUploadProgress"
                  :on-success="function(res,file){return handleFileSuccess(res,file,2)}"
                  multiple
                  :file-list="form.cqndtSubProcedureList[nameIndex].guideFiles">
                  <el-button size="small" type="text">上传附件</el-button>
                </el-upload>
                </el-col>
              </el-form-item>
              <el-form-item label="物料清单">
                <el-col :span="4">
                  <el-switch @change="handleChange" v-model="form.cqndtSubProcedureList[nameIndex].materials"></el-switch>
                </el-col>
                <el-col :span="20" v-if="form.cqndtSubProcedureList[nameIndex].materials">
                  <el-upload
                  ref="upload"
                  class="upload-demo"
                  :headers="upload.headers"
                  :action="upload.url"
                  :on-preview="handlePreview"
                  :on-remove="function(file,fileList){return handleRemove(file,fileList,3)}"
                  :before-remove="beforeRemove"
                  :on-progress="handleFileUploadProgress"
                  :on-success="function(res,file){return handleFileSuccess(res,file,3)}"
                  multiple
                  :file-list="form.cqndtSubProcedureList[nameIndex].specificationFiles">
                  <el-button size="small" type="text">上传附件</el-button>
                </el-upload>
                </el-col>
              </el-form-item>
            </div>
            <div  class="right-content" v-else>
              <div class="title" style="margin-bottom:15px">配置</div>
              <el-form-item class="is-required" label="工序名称">
                <el-input v-model="test.name" disabled placeholder="请选择左侧名称" />
              </el-form-item>
              <el-form-item class="is-required" label="工序类型">
                <el-select v-model="test.type" disabled placeholder="请选择工序类型类型" clearable>
                  <el-option
                    v-for="dict in typeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="is-required" label="参与审核权限">
                <el-select v-model="test.audit" disabled placeholder="请选择参与审核权限" clearable>
                  <el-option
                    v-for="dict in auditAuthorityOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="is-required" label="施工限制范围">
                以设计经纬度半径<el-input disabled style="width:120px;margin:0 5px" v-model="test.fw" placeholder="请输入范围" />米，范围内
              </el-form-item>
              <el-form-item label="操作指南">
                <el-col :span="4">
                  <el-switch disabled v-model="test.zn"></el-switch>
                </el-col>
              </el-form-item>
              <el-form-item label="安全规范">
                <el-col :span="4">
                  <el-switch disabled v-model="test.gf"></el-switch>
                </el-col>
              </el-form-item>
              <el-form-item label="物料清单">
                <el-col :span="4">
                  <el-switch disabled v-model="test.wl"></el-switch>
                </el-col>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
    <!-- 工序名称弹窗 -->
    <el-dialog title="工序名称" :visible.sync="processOpen" width="400px" append-to-body>
      <el-form ref="processForm" :model="processForm" :rules="processRules" label-width="90px">
        <el-form-item label="工序名称" prop="procedureName">
          <el-input v-model="processForm.procedureName" placeholder="请输入工序名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitProcessForm">确 定</el-button>
        <el-button @click="cancelProcess">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addProcedure, updateProcedure,getProcedure } from "@/api/projects/procedure";
import { getFile } from "@/api/common";
import { getToken } from "@/utils/auth";
export default {
  props:{
    procedureId:{
      type:Number
    }
  },
  data(){
    return{
      // 工序类型数据字典
      typeOptions: [],
      // 参与审核权限数据字典
      auditAuthorityOptions: [],
      processOpen:false,//工序名称弹出层
      // 上传附件参数
      upload: {
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/upload"
      },
      fileList1:[],
      fileList2:[],
      fileList3:[],
      // 表单参数
      form: {cqndtSubProcedureList:[]},
      processForm:{},//工序名称表单
      // 表单校验
      rules: {
        procedureName: [
          { required: true, message: "工序管理名称不能为空", trigger: "blur" }
        ],
        procedureCode: [
          { required: true, message: "工序编码不能为空", trigger: "blur" }
        ],
        procedureSort: [
          { required: true, message: "工序顺序不能为空", trigger: "blur" }
        ]
      },
      // 工序名称表单校验
      processRules: {
        procedureName: [
          { required: true, message: "工序名称不能为空", trigger: "blur" }
        ],
      },
      nameList:[],//工序名称列表
      nameIndex:undefined,//编辑工序名称index
      isEditProcess:false,
      test:{
        fw:50,
      },
      isEdit:false,
      isCopy:false,
    }
  },
  created(){
    this.getDicts("cqndt_procedure_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("cqndt_company_type").then(response => {
      this.auditAuthorityOptions = response.data;
    });
  },
  methods:{
    // 取消按钮
    cancel() {
      this.$emit("closeDialog");
      this.reset();
      this.nameIndex=undefined;
    },
    // 表单重置
    reset() {
      this.form = {
        procedureId: undefined,
        procedureName: undefined,
        remark: undefined,
        cqndtSubProcedureList:[]
      };
      this.resetForm("form");
    },
    handleChange(){
      this.$forceUpdate()
    },
    getProcedure(){//查询工序
      getProcedure(this.procedureId).then(response => {
        this.nameIndex=0;
        this.form = response.data;
        this.nameList=this.form.cqndtSubProcedureList.map(item=>{return item.procedureName;})
        if(this.isCopy){
          this.form.procedureId=undefined;
          this.form.procedureName=this.form.procedureName+ '_副本';
        }
        this.form.cqndtSubProcedureList.forEach(item=>{
          item.type=item.type.toString()
          item.auditAuthority=item.auditAuthority.split(",");
          if(item.operationGuide==0){
            item.operationGuide=true
          }else{
            item.operationGuide=false
          }
          if(item.safetySpecification==0){
            item.safetySpecification=true
          }else{
            item.safetySpecification=false
          }
          if(item.materials==0){
            item.materials=true
          }else{
            item.materials=false
          }
          // 修改字段名
          if(item.authorityFiles){
            item.authorityFiles=JSON.parse(JSON.stringify(item.authorityFiles).replace(/fileName/g,"name"))
          }
          if(item.guideFiles){
            item.guideFiles=JSON.parse(JSON.stringify(item.guideFiles).replace(/fileName/g,"name"))
          }
          if(item.specificationFiles){
            item.specificationFiles=JSON.parse(JSON.stringify(item.specificationFiles).replace(/fileName/g,"name"))
          }
        })
        this.$forceUpdate()
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.nameList.length<=0){
            this.msgError("请添加工序");
          }else{
            let flag;
            this.form.cqndtSubProcedureList.forEach((item,index) => {
              if(!item.type || !item.procedureName || !item.auditAuthority || !item.buildLimit){
                flag=false;
                return this.msgError(`请完善${this.nameList[index]}的配置`);
              }else{
                flag=true;
              }
              item.auditAuthority=item.auditAuthority.toString()
              if(item.operationGuide){
                item.operationGuide=0;
                item.authorityId=item.authorityFiles.map(id=>id.fileId).toString();
              }else{
                item.operationGuide=1;
                item.authorityFiles=[];
                item.authorityId=undefined
              }
              if(item.safetySpecification){
                item.safetySpecification=0;
                item.guideId=item.guideFiles.map(id=>id.fileId).toString();
              }else{
                item.safetySpecification=1;
                item.guideFiles=[];
                item.guideId=undefined
              }
              if(item.materials){
                item.materials=0;
                item.specificationId=item.specificationFiles.map(id=>id.fileId).toString();
              }else{
                item.materials=1;
                item.specificationFiles=[];
                item.specificationId=undefined
              }
            });
            if(flag){
              if (this.form.procedureId != undefined) {
                updateProcedure(this.form).then(response => {
                  this.msgSuccess("修改成功");
                  this.$emit('getList')
                  this.$emit("closeDialog");
                });
              } else {
                addProcedure(this.form).then(response => {
                  this.msgSuccess("新增成功");
                  this.$emit('getList')
                  this.$emit("closeDialog");
                });
              }
            }
          }
        }
      });
    },
    // 取消按钮
    cancelProcess() {
      this.processOpen = false;
      this.reset();
    },
    // 新增工序名称
    handleAddProcess(){
      this.processForm={procedureName:undefined}
      this.resetForm("processForm");
      this.processOpen=true;
    },
    // 修改工序名称
    handleUpdateProcess(index){
      this.processForm={procedureName:undefined}
      this.resetForm("processForm");
      this.nameIndex=index;
      this.isEditProcess=true;
      this.processOpen=true;
      this.processForm.procedureName=this.nameList[index]
    },
    // 删除工序名称
    handleDelteProcess (index){
      if(index==this.nameIndex){
        this.nameIndex=undefined
      }
      this.nameList.splice(index,1);
      this.form.cqndtSubProcedureList.splice(index,1);
      this.$forceUpdate()
    },
    // 工序选择
    handleItem(index,item){
      this.nameIndex=index;
      this.form.cqndtSubProcedureList[index].procedureName=item;
      this.$forceUpdate()
    },
    // 工序名称提交
    submitProcessForm(){
      this.$refs["processForm"].validate(valid => {
        if (valid) {
          if(this.isEditProcess){
            this.nameList[this.nameIndex]=this.form.cqndtSubProcedureList[this.nameIndex].procedureName=this.processForm.procedureName;
          }else{
            let obj={
              procedureName:undefined,//子工序管理名称
              type:undefined,//子工序类型
              auditAuthority:[],//参与审核权限
              buildLimit:50,//施工范围
              authorityId:[],//操作指南文件id
              guideId:[],//安全规范文件id
              materials:undefined,//物料清单
              operationGuide:undefined,//操作指南
              procedureId:undefined,//工序管理id
              safetySpecification:undefined,//安全规范
              specificationId:[],//物料清单文件id
              authorityFiles:[],
              guideFiles:[],
              specificationFiles:[],
            }
            this.form.cqndtSubProcedureList.push(obj)
            this.nameList.push(this.processForm.procedureName);
            this.$forceUpdate()
          }
          this.processOpen=false;
          this.isEditProcess=false;
        }
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(res, file, i) {//i=1表示上传操作指南；i=2表示上传安全规范；i=3表示上传物料清单
      let data=JSON.parse(JSON.stringify(res.data).replace(/fileName/g,"name"))
      if(i==1){
        this.form.cqndtSubProcedureList[this.nameIndex].authorityFiles.push(data);
      }else if(i==2){
        this.form.cqndtSubProcedureList[this.nameIndex].guideFiles.push(data);
      }else if(i==3){
        this.form.cqndtSubProcedureList[this.nameIndex].specificationFiles.push(data);
      }
      this.upload.open = false;
      this.upload.isUploading = false;
      // this.$refs.upload.clearFiles();
    },
    handleRemove(file, fileList,i) {//i=1表示上传操作指南；i=2表示上传安全规范；i=3表示上传物料清单
      if(i==1){
        this.form.cqndtSubProcedureList[this.nameIndex].authorityFiles=fileList;
      }else if(i==2){
        this.form.cqndtSubProcedureList[this.nameIndex].guideFiles=fileList;
      }else if(i==3){
        this.form.cqndtSubProcedureList[this.nameIndex].specificationFiles=fileList;
      }
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
  }
}
</script>
<style lang="scss" scoped>
.left-content .title,.right-content .title{
  background: #f2f2f2;
  height: 40px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid #e4e4e4;
  i{
    font-weight: 700;
    cursor: pointer;
  }
}
.left-content,.right-content{
  border: 1px solid #e4e4e4;
  min-height: 440px;
}
.left-content{
  .container{
    height: 400px;
    overflow-y: auto;
    .item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      i{
        margin: 0 5px;
        display: none;
        cursor: pointer;
      }
    }
    .item:hover i{
      display: inline-block;
    }
    .activeItem,.item:hover{
      background: #f2f2f2;
    }
  }
}
.right-content{
  .config-form{
    padding: 10px 20px;
  }
}
.el-form-item .el-form-item{
  margin-bottom: 22px;
}
.el-select{
  width: 100%;
}
</style>