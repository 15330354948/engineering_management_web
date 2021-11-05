<template>
    <div>
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item prop="projectName">
            <el-input
                v-model="queryParams.projectName"
                placeholder="请输入项目编号/名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item prop="projectAddress">
            <el-cascader
                placeholder="请选择区域"
                v-model="projectAddress"
                :options="areaList"
                :props="{value: 'id'}"
                clearable>
            </el-cascader>
            </el-form-item>
            <el-form-item prop="period">
            <el-select v-model="queryParams.period" placeholder="请选择创建期次" clearable size="small">
                <el-option
                v-for="dict in periodOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
                />
            </el-select>
            </el-form-item>
            <el-form-item prop="bidSection">
            <el-select v-model="queryParams.bidSection" placeholder="请选择所属标段" clearable size="small">
                <el-option
                v-for="dict in bidSectionOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
                />
            </el-select>
            </el-form-item>
            <el-form-item prop="projectType">
            <el-select v-model="queryParams.projectType" placeholder="请选择项目状态" clearable size="small">
                <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
                />
            </el-select>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button  @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
            <el-button
                type="primary"
                :disabled="multiple"
                @click="handleRelations(null,0)"
                v-hasPermi="['project:Project:add']"
            >选中关联</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getProjectList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" border :data="projectList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="项目编号" align="center" prop="projectName" />
            <el-table-column label="项目名称" align="center" prop="projectName" />
            <el-table-column label="项目地址" align="center" prop="projectAddress" />
            <el-table-column label="建设期次" align="center" prop="period" :formatter="periodFormat" />
            <el-table-column label="所属标段" align="center" prop="bidSection" :formatter="bidSectionFormat" />
            <el-table-column label="项目状态" align="center" prop="projectType" :formatter="statusFormat" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button v-if="scope.row.watermartType==1"
                size="mini"
                type="text"
                icon="el-icon-link"
                @click="handleRelations(scope.row,0)"
                v-hasPermi="['project:Project:edit']"
                >关联</el-button>
                <el-button v-else
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleRelations(scope.row,1)"
                v-hasPermi="['project:Project:remove']"
                >取消关联</el-button>
            </template>
            </el-table-column>
        </el-table>
        
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getProjectList"
        />
    </div>
</template>
<script>
import { relation } from "@/api/projects/watermark";
import { listProject } from "@/api/projects/project";
export default {
    props:{
        areaList:{//区域列表
            type:Array
        },
        watermarkId:{
            type:Number
        }
    },
    data(){
        return{
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 项目状态数据字典
            statusOptions: [],
            // 创建期次数据字典
            bidSectionOptions:[],
            // 所属标段数据字典
            periodOptions:[],
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                watermarkId:undefined,
                projectName:undefined,
                provinceCode:undefined,
                cityCode:undefined,
                countyCode:undefined,
                period: undefined,
                bidSection: undefined,
                projectType: undefined
            },
            projectList:[],//关联项目 
            projectAddress:[],
        }
    },
    created(){
        this.getProjectList();
        this.getDicts("cqndt_bid_section").then(response => {//所属标段字典
            this.bidSectionOptions = response.data;
        });
        this.getDicts("cqndt_period").then(response => {//创建期次字典
            this.periodOptions = response.data;
        });
        this.getDicts("cqndt_project_type").then(response => {//项目状态字典
            this.statusOptions = response.data;
        });
    },
    methods:{
        // 查询关联项目列表
        getProjectList() {
            this.loading = true;
            this.queryParams.watermarkId=this.watermarkId;
            if(this.projectAddress){
                this.queryParams.provinceCode=this.projectAddress[0]
                this.queryParams.cityCode=this.projectAddress[1]
                this.queryParams.countyCode=this.projectAddress[2]
            }
            listProject(this.queryParams).then(response => {
                this.projectList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 项目状态字典翻译
        statusFormat(row, column) {
            return this.selectDictLabel(this.statusOptions, row.projectType);
        },
        // 创建期次字典翻译
        periodFormat(row, column) {
            return this.selectDictLabel(this.periodOptions, row.period);
        },
        // 所属标段字典翻译
        bidSectionFormat(row, column) {
            return this.selectDictLabel(this.bidSectionOptions, row.bidSection);
        },
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getProjectList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.projectAddress=undefined;
            this.queryParams.provinceCode=undefined,
            this.queryParams.cityCode=undefined,
            this.queryParams.countyCode=undefined,
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.projectId)
            this.single = selection.length!=1
            this.multiple = !selection.length
        },
        // 关联操作
        handleRelations(row,i){//i=0表示关联；i=1取消关联
            let projectIds;
            if(row){
                projectIds=row.projectId
            }else{
                projectIds=this.ids
            }
            relation({projectId:projectIds,waterMartType:i}).then(res=>{
                if(i==0){
                    this.msgSuccess("关联成功");
                }else{
                    this.msgSuccess("取消成功");
                }
                this.getProjectList()
            })
        },
    }
}
</script>
<style lang="scss" scoped>

</style>