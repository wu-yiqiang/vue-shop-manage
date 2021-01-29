<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/user.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form  ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>



<!--Js-->
<script>
export default {
  data(){
    return {
      loginForm:{
        username:"admin",
        password:"123456"
      },
      //表单的验证规则
      loginFormRules:{
        username:[
          {required:true,message:"请输入用户名",trigger:"blur"},
          {min:3,max:10,message: "用户名长度在3到10个字符之间",trigger: "blur"},
        ],
        password:[
          {required:true,message:"请输入密码",trigger:"blur"},
          {min:6,max:16,message: "密码长度设置在8到16个字符之间",trigger: "blur"}
        ]
      },

    }
  },
  methods:{
    //重置登陆表单
    resetLoginForm(){
     this.$refs.loginFormRef.resetFields()
    },
    //登录按键预校验功能
    login(){
       this.$refs.loginFormRef.validate(async valid=>{
         if(!valid) return
         const {data:res}=await this.$http.post("login",this.loginForm)
         if(res.meta.status!==200) return this.$message.error(res.meta.msg)
         this.$message.success(res.meta.msg,500,true)

         //存储服务器返回的token，并且存储token到localstorage
         sessionStorage.setItem("vuetoken",res.data.token)
         //对页面进行跳转
         //延迟跳转
         this.$router.push("/home")
       })
    }
  }
}
</script>






<!--Css-->
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
.avatar_box{
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
}
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>