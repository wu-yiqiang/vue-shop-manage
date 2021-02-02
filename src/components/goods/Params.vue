<template>
    <div>
          <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
              <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning" :closable="false"
                show-icon>
            </el-alert>
            <el-row class="cat_opt"> 
                <el-col>
                    <span>选择商品分类: </span>
                    <!-- 级联选择框 -->
                    <el-cascader :options="catelist" :props="cateProps" v-model="selectedCateKeys" @change="handleChange" checkStrictly:false></el-cascader>
                </el-col>
            </el-row>
            <!-- tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="first">用户管理</el-tab-pane>
                <el-tab-pane label="静态属性" name="second">配置管理</el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>



<script>
export default {
    data(){
        return {
            catelist:[],
            cateProps:{
                value:"cat_id",
                label:"cat_name",
                children:"",
            },
            //选中项
            selectedCateKeys:[],
            //选项卡
            activeName:"frist",
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const {data:res}=await this.$http.get("categories")

            if(res.meta.status!==200) return this.$message.console.error(res.meta.msg);
            this.catelist=res.data
        },
         // 级联选择框选中项变化会触发
        handleChange() {
            this.getParamsData()
        },
        // Tab 页签点击时触发
        handleTabClick() {
            this.getParamsData()
        },
        handleChange(){
            //级联选择框变化触发
            if(this.selectedCateKeys.length!==3){
                this.selectedCateKeys=[]
                return false
            }
        },
        handleClick(){
            //tab选项卡切换
        }
    }
}
</script>


<style scoped>
.cat_opt{
    margin-top: 20px;
   
}

</style>