<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="规范名称" prop="standardName">
        <el-input v-model="form.standardName" placeholder="请输入规范名称" />
      </el-form-item>
      <el-form-item label="关联设备类型" prop="equipmentType">
        <el-select v-model="form.equipmentType" placeholder="请选择关联设备类型" clearable>
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属工序">
        <el-button size="medium" type="text" @click="handleAddOperation(1)">新增</el-button>
        <el-table :data="cqndtProcedureList">
          <el-table-column align="center">
            <template slot="header">
              <span style="color:red">*  </span>
              <span>工序模板</span>
            </template>
            <template slot-scope="scope">
              <el-select v-model="cqndtProcedureList[scope.$index].procedureId" @change="handleOperation(scope.$index,$event)" placeholder="请选择工序模板" clearable>
                <el-option
                  v-for="dict in procedureList"
                  :key="dict.procedureId"
                  :label="dict.procedureName"
                  :value="dict.procedureId"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color:red">*  </span>
              <span>工序</span>
            </template>
            <template slot-scope="scope">
              <el-select :disabled="cqndtProcedureList[scope.$index].procedureId ? false : true" v-model="cqndtProcedureList[scope.$index].subProcedureId" placeholder="请选择工序" clearable>
                <el-option
                  v-for="dict in cqndtProcedureList[scope.$index].subProcedureList"
                  :key="dict.subProcedureId"
                  :label="dict.procedureName"
                  :value="dict.subProcedureId"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDeleteOperation(scope.$index,scope.row,1)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="步骤">
        <el-button size="medium" type="text" @click="handleAddOperation(2)">添加步骤</el-button>
        <el-table :data="cqndtSubStandardList">
          <el-table-column align="center">
            <template slot="header">
              <span style="color:red">*  </span>
              <span>序号</span>
            </template>
            <template slot-scope="scope">
              <el-input type="number" v-model="cqndtSubStandardList[scope.$index].number" placeholder="请输入序号" />
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color:red">*  </span>
              <span>步骤名称</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="cqndtSubStandardList[scope.$index].subStandardName" placeholder="请输入步骤名称" />
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <span style="color:red">*  </span>
              <span>规范要求</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="cqndtSubStandardList[scope.$index].standardRequirement" placeholder="请输入规范要求" />
            </template>
          </el-table-column>
          <el-table-column label="示例图片" align="center">
            <template slot-scope="scope">
              <el-upload
              class="avatar-uploader"
              :headers="upload.headers"
              :action="upload.url"
              :show-file-list="false"
              :on-success="function(res,file){return handleAvatarSuccess(res,file,scope.$index)}"
              :before-upload="beforeAvatarUpload">
              <img v-if="cqndtSubStandardList[scope.$index].url" :src="cqndtSubStandardList[scope.$index].url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDeleteOperation(scope.$index,scope.row,2)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import { addStandard, updateStandard,getProcedure,getStandard } from "@/api/projects/procedure";
import { getFile } from "@/api/common";
import { getToken } from "@/utils/auth";
export default {
  props:{
    procedureList:{
      type:Array
    },
    standardId:{
      type:Number
    }
  },
  data(){
    return{
      // 设备类型数据字典
      typeOptions: [],
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
      fileList:[],
      // 表单参数
      form: {
        cqndtProcedureList:[],//所属工序
        cqndtSubStandardList:[],//步骤
      },
      // 表单校验
      rules: {
        standardName: [
          { required: true, message: "规范名称不能为空", trigger: "blur" }
        ],
        equipmentType: [
          { required: true, message: "请选择关联设备类型不能为空", trigger: "change" }
        ]
      },
      subProcedureList:[],//子工序列表
      cqndtProcedureList:[],//所属工序
      cqndtSubStandardList:[],//步骤
      isCopy:false,
    }
  },
  created(){
    this.getDicts("cqndt_equipment_type").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods:{
    // 取消按钮
    cancel() {
      this.$emit("closeDialog");
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        standardId : undefined,
        standardName: undefined,
        equipmentType:undefined,
        cqndtProcedureList:[],
        cqndtSubStandardList:[]
      }
      this.resetForm("form");
    },
    getStandard(){//查询规范
      getStandard(this.standardId).then(response => {
        this.form = response.data;
        if(this.isCopy){
          this.form.standardId=undefined;
          this.form.standardName=this.form.standardName+ '_副本';
        }
        this.cqndtProcedureList=this.form.cqndtProcedureList;
        this.cqndtSubStandardList=this.form.cqndtSubStandardList;
        this.form.equipmentType=this.form.equipmentType.toString();
        this.form.cqndtSubStandardList.forEach((item,index)=>{
          if(item.fileId){
            getFile(item.fileId).then(res=>{
              item.url=res.data.url;
              console.log(res.data,'getFile')
            })
          }
        })
        this.cqndtProcedureList.forEach(item=>{
          getProcedure(item.procedureId).then(res=>{
            this.$set(item, 'subProcedureList', res.data.cqndtSubProcedureList)
          })
        })
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.cqndtProcedureList=this.cqndtProcedureList;
          this.form.cqndtSubStandardList=this.cqndtSubStandardList;
          if (this.form.standardId  != undefined) {
            updateStandard(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.$emit('getList')
              this.$emit("closeDialog");
            });
          } else {
            addStandard(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.$emit('getList')
              this.$emit("closeDialog");
            });
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
      this.reset();
      this.processOpen=true;
    },
    handleAddOperation(i){//i=1表示所属工序；i=2步骤
      if(i==1){
        let obj={procedureId:undefined,subProcedureId:undefined,subProcedureList:[]}
        this.cqndtProcedureList.push(obj);
        this.form.cqndtProcedureList=this.cqndtProcedureList
      }else{
        let obj={number:this.form.cqndtSubStandardList.length+1,subStandardName:'',standardRequirement:'',url:'',fileId:undefined}
        this.cqndtSubStandardList.push(obj)
        this.form.cqndtSubStandardList=this.cqndtSubStandardList
      }
    },
    // 新增规范-所属工序&&步骤 删除按钮
    handleDeleteOperation(index,row,i){//i=1表示所属工序；i=2步骤
      if(i==1){
        this.cqndtProcedureList.splice(index,1);
      }else{
        this.cqndtSubStandardList.splice(index,1)
      }
    },
    // 新增规范-所属工序-工序模板切换
    handleOperation(i,e){
      this.cqndtProcedureList[i].subProcedureId=undefined;
      getProcedure(e).then(res=>{
        this.cqndtProcedureList[i].subProcedureList=res.data.cqndtSubProcedureList
        this.$forceUpdate()
      })
    },
    // 上传图片
    handleAvatarSuccess(res, file,index) {
      this.$set(this.cqndtSubStandardList[index], 'url', res.data.url)
      this.$set(this.cqndtSubStandardList[index], 'fileId', res.data.fileId)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return  isLt2M;
    },
  }
}
</script>
<style lang="scss" scoped>
.el-form-item .el-form-item{
  margin-bottom: 22px;
}
.el-select{
  width: 100%;
}
/deep/.avatar-uploader .el-upload {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>