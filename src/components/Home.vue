<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/logos.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout()">退出登录</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
        <!--侧边栏菜单效果-->
        <el-menu   background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>一级菜单</span>
            </template>
            <!--二级菜单-->
            <el-submenu index="1-1">
              <template slot="title"><i class="el-icon-menu"></i><span slot="title">二级菜单</span></template>
            </el-submenu>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!--右边主体区域-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  methods:{
    //退出
    logout(){
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
  }
}
</script>


<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373d41;
    padding-left: 20px;
    color: #fff;
    font-size: 20px;
  > div {
    display: flex;
    align-items: center;
      span {
      margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
</style>