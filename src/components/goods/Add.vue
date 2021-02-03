<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    
   
    
    <!-- 卡片区域 -->
    <el-card class="box-card">
       <!-- 警告框 -->
      <el-alert title="添加商品信息" type="info" show-icon center>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps  :active="activeIndex-1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧tab栏 -->
      <el-form :model="addInfoForm" status-icon :rules="addInfoFormRules" ref="addInfoFormRef" >
        <el-tabs tab-position="left"  v-model="activeIndex">
          <el-tab-pane label="基本信息" name="1">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input  v-model="addInfoForm.goods_name" ></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_prices">
                <el-input  v-model="addInfoForm.goods_prices" ></el-input>
              </el-form-item>
              <el-form-item  label="商品重量" prop="goods_weights">
                <el-input  v-model="addInfoForm.goods_weights" ></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_amounts">
                <el-input  v-model="addInfoForm.goods_amounts" ></el-input>
              </el-form-item>


              <el-form-item label="商品分类">
                <el-cascader :options="getGoodsOptions" :value="getGoodsOptions.cat_name" v-model="selectCat_name" @change="getGoodsOptionsData()"></el-cascader>
              </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">配置管理</el-tab-pane>
          <el-tab-pane label="商品属性" name="3">角色管理</el-tab-pane>
          <el-tab-pane label="商品图片" name="4">定时任务补偿</el-tab-pane>
          <el-tab-pane label="商品内容" name="5">角色管理</el-tab-pane>
            <el-tab-pane label="完成" name="6">角色管理</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>


<script>
export default {
  data(){
    return {
      activeIndex:"1",    //上下联动控制位
      addInfoForm:{
          goods_name:"",  
          goods_prices:0,
          goods_weights:0,
          goods_amounts:0 ,
      },
      addInfoFormRules:{         //校验规则
        goods_name:[{required:true,message:"请输入商品名称！",toggler:"blur"}],
        goods_prices:[{required:true,message:"请输入商品价格！",toggler:"blur"},{ type: 'number', message: "重量必须为数字值！"}],
        goods_weights:[{required:true,message:"请输入商品重量！",toggler:"blur"}, { type: 'number', message: "重量必须为数字值！"}],
      } ,


      getGoodsOptions:[], //级联选择框数据
      selectCat_name:[],  //级联选择框选中的数据
    }
  },
  created(){
    this.getGoodsInfos()
  },
  methods:{
    async getGoodsInfos() {
      //获取当前所有的商品列表
      const {data:res}=await this.$http.get("categories")
      if(res.meta.status!=200) return this.$message.err(res.meta.msg)
      this.getGoodsOptions=res.data
      console.log(res.data);
    },
    getGoodsOptionsData(){
      //获取级联选择框里面的数据，并对数据做校验
      if(this.selectCat_name.length!==3) {
        //清空数据
        this.selectCat_name=[]
        return 
      }
    }
  }
}
</script>


<style lang="less" scoped>

</style>