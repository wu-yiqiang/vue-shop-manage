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
        <el-dialog title="添加商品" :visible.sync="addGoodsDialogVisible" width="30%" >
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cate_name">
                    <el-input v-model="addCateForm.cate_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" >
                     <el-cascader  :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable></el-cascader>
                </el-form-item>
               
            </el-form>
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
            addGoodsDialogVisible:false,
            //添加用户表单
            addCateForm:{
                //分类名称
                cate_name:"",
                // 父级分类id
                cate_pid:0,
                //等级
                cate_level:0,
            },
            //校验规则
            addCateFormRules:{
                cate_name:[
                    {required:true,message:"请输入分类名称！！！",trigger:"blur"}
                ],     
            },
             // 父级分类列表
            parentCateList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover',
                checkStrictly: true
            },
            // 选中的父级分类的 ID 数组
            selectedKeys: [],

          
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
            //添加商品分类
            this.getParentCateList()
            this.addGoodsDialogVisible=true
        },
         // 获取父级分类的列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: {
                type: 2 // 获取前两级的所有分类
                }
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类数据失败')
            }
            // 存一下
            this.parentCateList = res.data
            },
        },
          // 选择项发生变化会触发的函数
    parentCateChanged() {
      // 如果 selectedKeys 数组的 length 大于 0，证明选中了父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的 ID
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate() {
      console.log(this.addCateForm)
      // this.addCateDialogVisible = false
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      // 选择到的父分类 ID
      this.selectedKeys = []
      // 准备提交到后台的分类等级和分类 ID
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
}
</script>


<style lanf="less" scoped>
.treetable{
    margin-top:20px;
}
</style>