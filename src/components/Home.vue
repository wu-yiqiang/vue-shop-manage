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

      <el-aside :width="isCollapse? '64px':'200px'">
        <!--侧边栏菜单效果-->
        <div class="toggle-button" @click="toggleCollapse()">
          |||
        </div>
        <el-menu   background-color="#333744" text-color="#fff" active-text-color="#409eff"  unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activepath">
          <el-submenu :index="item.id+''" :key="menulist.id" v-for="(item,index) in menulist" >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+subitem.path" :key="subitem.id" v-for="subitem in item.children" >
              <template slot="title" @click="saveNavState('/'+subitem.path)">
                <i class="el-icon-menu"></i>
                <span slot="title">{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu >
        </el-menu>
      </el-aside>
      <!--右边主体区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  data(){
    return {
      menulist:[],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activepath:"",
    }
  },
  created() {
    this.getMenuList()
    //获取是本地的path
    //设置本地
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods:{
    //退出
    logout(){
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    //获取得到的菜单列表
    async getMenuList(){
      const {data:res}=await this.$http.get("menus")
      if(res.meta.status!==200) return this.$message.error(res.meta.mag)
      this.menulist=res.data
      console.log(res)
    },
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    saveNavState(activePath){
        //获取本地的path
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
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
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;

  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>