<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

</template>



<script>
export default {
  data(){
    return {
      //权限列表
      rightslist:[]
    }
  },
  created(){
    this.getRigtsList()
  },
  methods:{
    async getRigtsList(){
      const {data:res}=await this.$http.get("rights/:type",{params:{type:list}})
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)

    }
  }
}

</script>


<style>

</style>