<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--添加角色-->
      <el-button type="primary" @click="addRoles">添加角色</el-button>
      <!--添加表格-->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              二级菜单
            </el-form>
          </template>
        
        </el-table-column>
        <el-table-column type="index" label="#" align="center">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row.id)">分配权限</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分配权限-->
    <el-dialog title="权限分配" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-tree  :data="rightsList" :props="treeProps" default-expand-all   show-checkbox node-key="id"  :default-checked-keys="defKeys" >
      </el-tree>
    <el-button @click="dialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible=false">确 定</el-button>
    </el-dialog>


  </div>
</template>


<script>
export  default  {
  data(){
    return {
      tableData: [],
      dialogVisible:false,
      rightsList: [],
      treeProps:{
        label:"authName",
        children:"children",
      },
      defKeys:[]
    }
  },
  created() {
    //获取角色列表
    this.getRolleListInfo()
  },
  methods:{
    async getRolleListInfo(){
      const {data:res}=await this.$http.get("/roles")
      if(res.meta.status!=200) return this.$message.error(res.meta.msg)
      this.tableData=res.data
    },
    addRoles(){
      //添加角色
      console.log("sad")
    },
    async deleteRoles(id){
      //删除角色
      const {data:res}=await this.$http.delete("roles/"+id)
      if(res.meta.status!=200) return this.$message.error(res.meta.msg)
      //重新获取数据
      this.getRolleListInfo()
    },
    editRoles(){
      //编辑角色
    },
    async showSetRightDialog(role){
      //为角色分配权限
      const {data:res}=await this.$http.get("rights/tree")
      if(res.meta.status!=200) return this.$message.error(res.meta.msg)

      console.log(res)

      this.dialogVisible=true
      this.rightsList = res.data
      // 递归存储三级节点的 ID
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的 ID，并保存到 defKeys 中
    getLeafKeys(node, arr) {
      if (!node.children) {
        // 没有 children 证明这儿就是三级节点
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    cancelDialogVisible(){
      //取消分配权限
    },
    handleClose (){
      //推出前操作
    },
    handleCheckChange(){
      //修改id
    }
  }
}
</script>

<style>
  
</style>