<template>
    <div>
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item prop="ProjectCode">
            <el-input
                v-model="queryParams.ProjectCode"
                placeholder="请输入项目编号/名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
            />
            </el-form-item>
            <el-form-item prop="status">
            <el-cascader
                v-model="queryParams.area"
                :options="options"
                clearable>
            </el-cascader>
            </el-form-item>
            <el-form-item prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择创建期次" clearable size="small">
                <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
                />
            </el-select>
            </el-form-item>
            <el-form-item prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择所属标段" clearable size="small">
                <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
                />
            </el-select>
            </el-form-item>
            <el-form-item prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择项目状态" clearable size="small">
                <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
                />
            </el-select>
            </el-form-item>
            <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
            <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                :disabled="multiple"
                @click="handleRelations"
                v-hasPermi="['project:Project:add']"
            >选中关联</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getProjectList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="projectList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="项目编号" align="center" prop="ProjectId" />
            <el-table-column label="项目名称" align="center" prop="ProjectCode" />
            <el-table-column label="项目地址" align="center" prop="ProjectName" />
            <el-table-column label="建设期次" align="center" prop="ProjectSort" />
            <el-table-column label="所属标段" align="center" prop="ProjectSort" />
            <el-table-column label="项目状态" align="center" prop="status" :formatter="statusFormat" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                icon="el-icon-link"
                @click="handleRelations(scope.row)"
                v-hasPermi="['project:Project:edit']"
                >关联</el-button>
                <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDisassociate(scope.row)"
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
import { listWatermark } from "@/api/projects/watermark";
export default {
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
            // 状态数据字典
            statusOptions: [],
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                area:undefined,
                watermarkCode: undefined,
                watermarkName: undefined,
                status: undefined
            },
            projectList:[],//关联项目 
            options: [{
                value: 'zhinan',
                label: '指南',
                children: [{
                    value: 'shejiyuanze',
                    label: '设计原则',
                    children: [{
                    value: 'yizhi',
                    label: '一致'
                    }, {
                    value: 'fankui',
                    label: '反馈'
                    }, {
                    value: 'xiaolv',
                    label: '效率'
                    }, {
                    value: 'kekong',
                    label: '可控'
                    }]
                }, {
                    value: 'daohang',
                    label: '导航',
                    children: [{
                    value: 'cexiangdaohang',
                    label: '侧向导航'
                    }, {
                    value: 'dingbudaohang',
                    label: '顶部导航'
                    }]
                }]
                }, {
                value: 'zujian',
                label: '组件',
                children: [{
                    value: 'basic',
                    label: 'Basic',
                    children: [{
                    value: 'layout',
                    label: 'Layout 布局'
                    }, {
                    value: 'color',
                    label: 'Color 色彩'
                    }, {
                    value: 'typography',
                    label: 'Typography 字体'
                    }, {
                    value: 'icon',
                    label: 'Icon 图标'
                    }, {
                    value: 'button',
                    label: 'Button 按钮'
                    }]
                }, {
                    value: 'form',
                    label: 'Form',
                    children: [{
                    value: 'radio',
                    label: 'Radio 单选框'
                    }, {
                    value: 'checkbox',
                    label: 'Checkbox 多选框'
                    }, {
                    value: 'input',
                    label: 'Input 输入框'
                    }, {
                    value: 'input-number',
                    label: 'InputNumber 计数器'
                    }, {
                    value: 'select',
                    label: 'Select 选择器'
                    }, {
                    value: 'cascader',
                    label: 'Cascader 级联选择器'
                    }, {
                    value: 'switch',
                    label: 'Switch 开关'
                    }, {
                    value: 'slider',
                    label: 'Slider 滑块'
                    }, {
                    value: 'time-picker',
                    label: 'TimePicker 时间选择器'
                    }, {
                    value: 'date-picker',
                    label: 'DatePicker 日期选择器'
                    }, {
                    value: 'datetime-picker',
                    label: 'DateTimePicker 日期时间选择器'
                    }, {
                    value: 'upload',
                    label: 'Upload 上传'
                    }, {
                    value: 'rate',
                    label: 'Rate 评分'
                    }, {
                    value: 'form',
                    label: 'Form 表单'
                    }]
                }, {
                    value: 'data',
                    label: 'Data',
                    children: [{
                    value: 'table',
                    label: 'Table 表格'
                    }, {
                    value: 'tag',
                    label: 'Tag 标签'
                    }, {
                    value: 'progress',
                    label: 'Progress 进度条'
                    }, {
                    value: 'tree',
                    label: 'Tree 树形控件'
                    }, {
                    value: 'pagination',
                    label: 'Pagination 分页'
                    }, {
                    value: 'badge',
                    label: 'Badge 标记'
                    }]
                }, {
                    value: 'notice',
                    label: 'Notice',
                    children: [{
                    value: 'alert',
                    label: 'Alert 警告'
                    }, {
                    value: 'loading',
                    label: 'Loading 加载'
                    }, {
                    value: 'message',
                    label: 'Message 消息提示'
                    }, {
                    value: 'message-box',
                    label: 'MessageBox 弹框'
                    }, {
                    value: 'notification',
                    label: 'Notification 通知'
                    }]
                }, {
                    value: 'navigation',
                    label: 'Navigation',
                    children: [{
                    value: 'menu',
                    label: 'NavMenu 导航菜单'
                    }, {
                    value: 'tabs',
                    label: 'Tabs 标签页'
                    }, {
                    value: 'breadcrumb',
                    label: 'Breadcrumb 面包屑'
                    }, {
                    value: 'dropdown',
                    label: 'Dropdown 下拉菜单'
                    }, {
                    value: 'steps',
                    label: 'Steps 步骤条'
                    }]
                }, {
                    value: 'others',
                    label: 'Others',
                    children: [{
                    value: 'dialog',
                    label: 'Dialog 对话框'
                    }, {
                    value: 'tooltip',
                    label: 'Tooltip 文字提示'
                    }, {
                    value: 'popover',
                    label: 'Popover 弹出框'
                    }, {
                    value: 'card',
                    label: 'Card 卡片'
                    }, {
                    value: 'carousel',
                    label: 'Carousel 走马灯'
                    }, {
                    value: 'collapse',
                    label: 'Collapse 折叠面板'
                    }]
                }]
                }, {
                value: 'ziyuan',
                label: '资源',
                children: [{
                    value: 'axure',
                    label: 'Axure Components'
                }, {
                    value: 'sketch',
                    label: 'Sketch Templates'
                }, {
                    value: 'jiaohu',
                    label: '组件交互文档'
                }]
            }]
        }
    },
    created(){
        this.getProjectList();
        this.getDicts("sys_normal_disable").then(response => {
            this.statusOptions = response.data;
        });
    },
    methods:{
        // 查询关联项目列表
        getProjectList() {
            this.loading = true;
            listWatermark(this.queryParams).then(response => {
                this.projectList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 水印状态字典翻译
        statusFormat(row, column) {
            return this.selectDictLabel(this.statusOptions, row.status);
        },
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getProjectList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams.area=undefined;
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.watermarkId)
            this.single = selection.length!=1
            this.multiple = !selection.length
        },
        // 关联操作
        handleRelations(){
            this.msgSuccess("关联成功");
        },
        // 取消关联操作
        handleDisassociate(){
            this.msgSuccess("取消关联成功");
        }
    }
}
</script>
<style lang="scss" scoped>

</style>