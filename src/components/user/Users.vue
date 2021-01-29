<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card >
      <!--搜索框-->
      <el-row :gutter="20">
        <el-col :span="8">
          <div >
            <el-input placeholder="请输入内容"  class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">主要按钮</el-button>
        </el-col>
      </el-row>


      <!--表格-->
      <el-table  stripe border style="width: 100%" :data="userlist" >
        <el-table-column type="index" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column
            prop="username"
            label="姓名"
            width="180" align="center">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱" align="center">
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="电话" align="center">
        </el-table-column>
        <el-table-column
            prop="role_name"
            label="角色" align="center">
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scop">
            <el-switch :v-model="scop.row.mg_state" >

            </el-switch>

          </template>
        </el-table-column>
        <el-table-column
            prop="Operation"
            label="操作" align="center">
          <template >
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              Edit
            </el-button>
            <el-button size="mini" type="primaryr" @click="handleDelete(scope.$index, scope.row)">
              Delete
            </el-button>
            <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export  default {
    //数据
    data(){
      return {
       queryData:{
         query:"",
         pagenum:1,
         pagesize:10,
       },
        totalpage:0,
        userlist:[],
      }
    },
    created(){
      //发送请求
      this.getUsersData()
    },
    methods:{
      //发送请求方法
      getUsersData:async  function () {
        const {data:res}=await this.$http.get("users",{params:this.queryData})
        this.userlist=res.data.users
        console.log(this.userlist)
      }
    }
  }

</script>


<style lang="less" scoped>

</style>