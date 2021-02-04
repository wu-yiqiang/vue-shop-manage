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
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧tab栏 -->
      <el-form :model="addInfoForm" status-icon :rules="addInfoFormRules" ref="addInfoFormRef">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="toggleTable">
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addInfoForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_prices">
              <el-input v-model.number="addInfoForm.goods_prices"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weights">
              <el-input v-model.number="addInfoForm.goods_weights"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_amounts">
              <el-input v-model.number="addInfoForm.goods_amounts"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="">
              <el-cascader :options="getGoodsOptions" v-model="addInfoForm.selectCat_name" @change="getCheckedNodes" clearable :props="goodsClassConfig"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <!-- <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="年龄" prop="age" >
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="复选框 A"></el-checkbox>
                  <el-checkbox label="复选框 B"></el-checkbox>
                  <el-checkbox label="复选框 C"></el-checkbox>
                  <el-checkbox label="禁用" disabled></el-checkbox>
                  <el-checkbox label="选中且禁用" disabled></el-checkbox>
                </el-checkbox-group> 
              </el-form-item>
              
            </el-form> -->
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <!--  -->
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <el-upload class="upload-demo" :action="uploadsUrl" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headersObj">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addInfoForm.goods_introduce"> </quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="marginTop20">添加商品文本</el-button>
          </el-tab-pane>
          <el-tab-pane label="完成" name="6">角色管理</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览区域 -->
    <el-dialog title="图片预览" :visible.sync="picturePreviewDialogVisible" width="50%" :before-close="handleClose">
      <img :src="preview" alt="" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1', //上下联动控制位
      addInfoForm: {
        goods_name: '',
        goods_prices: 0,
        goods_weights: 0,
        goods_amounts: 0,
        selectCat_name: [], //级联选择框选中的数据
        selectCate_id: '', //选中商品的id
        pics: [], // 商品的详情描述
        goods_introduce: ''
      },
      addInfoFormRules: {
        //校验规则
        goods_name: [{ required: true, message: '请输入商品名称！' }],
        goods_prices: [
          { required: true, message: '请输入商品价格！' },
          { type: 'number', message: '重量必须为数字值！' }
        ],
        goods_weights: [
          { required: true, message: '请输入商品重量！' },
          { type: 'number', message: '重量必须为数字值！' }
        ]
      },

      getGoodsOptions: [], //级联选择框数据

      goodsClassConfig: {
        //级联选择器配置项
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      uploadsUrl: 'http://127.0.0.1:8888/api/private/v1/upload', //上传图片地址
      headersObj: {
        //设置请求头
        Authorization: window.sessionStorage.getItem('vuetoken')
      },
      picturePreviewDialogVisible: false, //图片预览区域的显示控制位
      preview: '' //图片预览数据
    }
  },
  created() {
    this.getGoodsInfos()
  },
  methods: {
    async getGoodsInfos() {
      //获取当前所有的商品列表
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) return this.$message.err(res.meta.msg)
      this.getGoodsOptions = res.data
      //console.log(res.data);
    },
    getCheckedNodes(node) {
      //获取级联选择框里面的数据，并对数据做校验

      if (node.length !== 3) {
        //清空数据
        this.addInfoForm.selectCat_name = []
        return
      }
      //将数组最后的值存储起来
      this.addInfoForm.selectCate_id = node[node.length - 1]
    },
    toggleTable(activeName, oldActiveName) {
      //鼠标切换跳转
      if (oldActiveName == 1 && this.addInfoForm.selectCat_name.length == 0) {
        this.$message.error('请选择商品分类！！！')
        return false
      }

      //请求商品参数数据
      if (oldActiveName == 2) {
        //通过id向后台传值
      }

      //请求数据商品属性数据
      if (oldActiveName == 3) {
        //通过id向后台传值
        const { data: res } = this.$http.get(`goods/${this.addInfoForm.selectCate_id}`)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
      }
    },
    handlePreview(file) {
      //处理图片预览效果
      this.preview = file.response.data.url
      this.picturePreviewDialogVisible = true
    },
    handleRemove() {
      //移除图片操作
    }
  }
}
</script>

<style lang="less" scoped></style>
