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
            <el-input placeholder="请输入内容" type="text" clearable v-model="findDate">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserInfo()">添加用户</el-button>
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
          <template slot-scope="scop" >
            <el-switch v-model="scop.row.mg_state"  @change="changeUserStatus(scop.row)">

            </el-switch>

          </template>
        </el-table-column>
        <el-table-column prop="Operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)" class="el-icon-edit">
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)" class="el-icon-delete">
            </el-button>
            <el-tooltip content="角色权限" placement="top" :enterable="false">
              <el-button size="mini" type="primary"  class="el-icon-setting">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.pagenum" :page-sizes="[1, 2, 3, 5]"
          :page-size="queryData.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

      <!--弹出框-->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" >
        <el-form  label-width="20%" :rules="rules" ref="inputInfoRef" :model="inputInfoRef">
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
           <el-input type="text" v-model="inputInfoRef.username" ></el-input>
          </el-form-item>
          <!--邮箱-->
          <el-form-item label="邮箱" prop="email">
            <el-input  type="text" v-model="inputInfoRef.email" ></el-input>
          </el-form-item>
          <!--电话-->
          <el-form-item label="电话" prop="phonenum">
            <el-input  type="text" v-model="inputInfoRef.phonenum" ></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item label="密码" prop="password">
            <el-input  type="password" v-model="inputInfoRef.password" ></el-input>
          </el-form-item>

          <!--确认密码-->
          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input  type="password" v-model="inputInfoRef.repassword"></el-input>
          </el-form-item>
        </el-form>
        <!--确认框-->
        <!--重置表单-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!--用户信息编辑框-->
      <el-dialog title="编辑用户信息" :visible.sync="editdialogVisible" width="30%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
  export  default {
    //数据
    data(){
      /*自定义校验规则*/
      const check_email =  ( rule,value,callback) => {
          //校验邮箱的合法性
          const reg_email=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          const flag=reg_email.test(value)
          if(!flag) return  callback(new Error('输入的邮箱不符合规范！'))

         return  callback()

      };
      const check_password =  (rule,value,callback) => {
          //校验密码的合法性
        const reg_password=	/^[a-z0-9&*%$#@!^_-]{6,18}$/
        const flag=reg_password.test(value)
        if(!flag) return callback(new Error('输入的密码强度不符合规范！'))
        return  callback()
      };
      const check_phone= (rule,value,callback) => {
        //电话号码验证

        const reg_phone=/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
        let flags=reg_phone.test(value)
        if(!flags) return callback(new Error('输入的电话号码不符合规范！'))
        return  callback()
      };
      const  check_repassword = (rule,value,callback) => {
        //校验两次输入的密码正确性
        console.log(value)
        if(this.inputInfoRef.password!==value) return  callback(new Error("两次输入的密码不一致！"))

        return callback()

      }
      return {
       queryData:{
         query:"",
         pagenum:1,
         pagesize:1,
       },
        total:0,
        userlist:[],
        findDate:"",
        //添加信息对话框
        dialogVisible: false,
        //用户信息编辑对话框
        editdialogVisible:false,
        /*新增用户信息的校验规则*/
       inputInfoRef:{
         username:"",
         email:"",
         phonenum: "",
         password:"",
         repassword:"",
       },
        rules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: check_email, trigger:'blur' },
          ],
          phonenum:[
            { required: true, message: '请输入电话号码', trigger: 'blur' },
            { validator: check_phone, trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: check_password, trigger: 'blur' }
          ],
          confirmpassword:[
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: check_repassword, trigger: 'blur' }
          ],

        },

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
        this.total=res.data.total
        this.currentpage=res.data.pagenum
        //console.log(this.userlist)
      },
      handleSizeChange(val){
        //改变每页的用户数量
        this.queryData.pagenum=1
        this.queryData.pagesize=val
        this.getUsersData()

      },
      handleCurrentChange(val){
        /*获取当前页数*/
        this.queryData.pagenum=val
        this.getUsersData()
      },
      async handleDelete(val1){
        //根据id删除用户
        const {data:res}=await this.$http.delete(`users/${val1}`)
        if(res.meta.status!=200) return this.$message.error(res.meta.msg)
        this.getUsersData()
      },
      async handleEdit(id){
        //编辑用户信息
        this.editdialogVisible=true
        //通过id修改用户数据

      },

      /*切换用户状态*/
      async changeUserStatus(userinfo){
        //发送put请求改变该用户的状态
        const {data:res}=await this.$http.put("users/:uId/state/:type",{uID:userinfo.id, type:userinfo.mg_state})
        //console.log(res)
        if (res.meta.status!=200) {
          //更新状态信息失败
          return this.$message.error(res.meta.msg)
        }
        //后台上传用户状态成功
        this.$message.success("更新"+userinfo.username+"状态信息成功")
        },
      //弹出对话提示框
      addUserInfo(){
        this.dialogVisible=true
      },
    }
  }

</script>


<style lang="less" scoped>

</style>