<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addGoodsInfo">添加分类</el-button>
                </el-col>
            </el-row> 

            <!-- 表格 -->
            <tree-table class="treetable"  :data="catelist" :columns="columns" :selection-type="false" :expand-type="false"   show-index index-text="#" border>
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                        <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen;"></i>
                        <i class="el-icon-error" v-else style="color:red;"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit">
                        编辑
                    </el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">
                        删除
                    </el-button>
                </template>
                
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 分类对话框 -->
        <el-dialog title="添加商品" :visible.sync="addGoodsDialogVisible" width="30%" :before-close="handleClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
export default {
    data(){
        return {
            //商品分类数据列表
            catelist:[],
            //总数据条数
            total:0,
            //定义列
            columns:[
                {label:"分类名称",prop:"cat_name"},
                {label:"是否有效",type:"template",template:"isok"},
                {label:"排序",type:"template",template:"order"},
                {label:"操作",type:"template",template:"opt"},
            ],
            //查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5,
            },
            //增加用户对话框
            addGoodsDialogVisible:false
          
        }
    },
    created(){
    
        this.getCateList()
    },
    methods:{
        async getCateList(){
            //获取商品分类数据
            const {data:res}=await this.$http.get("categories",{
                params:this.queryInfo
            })
            console.log(res)
            if(res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.catelist=res.data.result
            this.total=res.data.total
            
        },
        handleSizeChange(newSize){
            //监听pageSize值改变
            this.queryInfo.pagesize=newSize
            this.getCateList()
        },
        handleCurrentChange(newPage){
            //监听pageNum值改变
            this.queryInfo.pagenum=newPage
            this.getCateList()
        },
        addGoodsInfo(){
            //添加用户

            this.addGoodsDialogVisible=true
        }
    }
}
</script>


<style lanf="less" scoped>
.treetable{
    margin-top:20px;
}
</style>