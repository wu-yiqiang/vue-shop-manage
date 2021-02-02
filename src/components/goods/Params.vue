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
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon> </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 级联选择框 -->
          <el-cascader :options="catelist" :props="cateProps" v-model="selectedCateKeys" @change="handleChange" checkStrictly:false></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDataInfo()">
            添加参数
          </el-button>

          <!-- 折叠表格 -->
          <el-table :data="goodsParams"  style="width: 100%" border >
            <el-table-column type="expand">
              <template slot-scope="scope">
               <el-tag :key="tag" v-for="tag in scope.row.attr_vals.split(' ')" closable :disable-transitions="false" >
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" > </el-table-column>
            <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作" >
              <el-button type="primary" size="mini">
                编辑
              </el-button>
              <el-button type="danger" size="mini">
                删除
              </el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">
            添加属性
          </el-button>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数对话框 -->
      <el-dialog title="添加参数"  :visible.sync="addDataInfoDialogVisible"  width="30%"  >
        <el-form :model="addParamsRuleForm" :rules="addParamsRuleFormRules" ref="addParamsRuleFormRef" label-width="100px" >
          <el-form-item label="动态参数" prop="params">
            <el-input  v-model="addParamsRuleForm.params"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="addParamSubmitForm()">提交</el-button>
            <el-button @click="addParamSresetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {

      /*  */
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      /* 分页数据 */
      selectedCateKeys: [],     //选中项
      activeName: 'many',       //选项卡
      goodsParams:[       //返回的动态参数
        
      ],   


      /* 添加参数对话框数据 */
      addParamsRuleForm:{        //添加参数对话框数据
        params:"",
      } ,
      addDataInfoDialogVisible:false,       //添加参数对话框显示
      addParamsRuleFormRules:{        //输入数据校验
          params:[
            {required:true,message:"请输入数据",toggler:"blur"}
          ]
      }

      /*  */
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) return this.$message.console.error(res.meta.msg)
      this.catelist = res.data
    },
    // 级联选择框选中项变化会触发
    handleChange() {
      this.getParamsData()
    },
    // Tab 页签点击时触发
    handleTabClick() {
      this.getParamsData()
    },
    async handleChange() {
      //级联选择框变化触发
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return false
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)

      //请求参数数据并将数据渲染到页面
      console.log(res)  
      this.goodsParams=res.data
      //添加描述标签
    },
    handleClick() {
      //tab选项卡切换
    },
    async addDataInfo(){
      //添加动态参数或者静态属性对话框显示
      this.addDataInfoDialogVisible=true
    },
    addParamSresetForm() {
      //添加参数对话框内容清除
      this.addParamsRuleForm.params=""
    },
    async addParamSubmitForm(){
      //确定添加参数或者属性
      if(this.addParamsRuleForm.params.trim().length===0) return this.$message.error("请输入值!!!")

      // const {data:res}=await this.$http.post("categories/${}/attributes",{attr_name:this.addParamsRuleForm.params.trim(),attr_sel:,attr_vals:})

      // if(res.meta.status!==201) return this.$message.error(res.meta.msg)

      // this.getCateList()


    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>









<style scoped>
.cat_opt {
  margin-top: 20px;
}
.el-tag{
  margin-right:20px;
}
</style>
