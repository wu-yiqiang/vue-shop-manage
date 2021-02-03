<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card >
      <!-- 输入框 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @click="clearInput()">
            <el-button slot="append" icon="el-icon-search" @click="searchInput()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
            <el-button type="primary" @click="goAddpage()">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodSListTableData" stripe  style="width: 100%" border >
        <el-table-column  type=index label="#" width="80" align="center">

        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" align="center">

        </el-table-column>
        <el-table-column prop="goods_price"  label="商品价格(元)" width="150" align="center">

        </el-table-column>
        <el-table-column prop="goods_weight"  label="重量" width="100" align="center">

        </el-table-column>  
        <el-table-column  prop="upd_time " label="创建时间" width="200" align="center">
            <template slot-scope="scop">
             {{ scop.row.upd_time | dateFormat }}
            </template>
        </el-table-column>
        <el-table-column   label="操作" width="200" align="center">
          <template >
            <el-button type="primary" size="mini"  icon="el-icon-edit" >编辑</el-button>
            <el-button type="danger" size="mini"  icon="el-icon-delete" >删除</el-button>
          </template>
        </el-table-column>  
      </el-table>
      
      <!-- 分页区域 -->
      <el-pagination @size-change="goodsListsHandleSizeChange" @current-change="goodsListsHandleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[50, 100, 500, 1000]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalcount" background>

      </el-pagination>

    </el-card>  
  </div>
</template>



<script>
export default {
  data(){
    return {
      queryInfo:{     //查询参数
        query:"",
        pagenum:1,
        pagesize:50,
      },
      goodSListTableData:[],  //表格数据

      totalcount:0,  //总数据条数


    }
  },
  created(){
    this.getGoodsInfo()
  },
  methods:{
    async getGoodsInfo(){
      const {data:res}=await this.$http.get("goods",{params:
        this.queryInfo
      })

      if(res.meta.status!=200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.goodSListTableData=res.data.goods
      this.totalcount=res.data.total
    },
    goodsListsHandleCurrentChange(currentPage){
      //改变分页数量
      this.queryInfo.pagenum=currentPage
      this.getGoodsInfo()
    },  
    goodsListsHandleSizeChange(sizeVal){
      //改变每页的数量
      this.queryInfo.pagesize=sizeVal
      this.getGoodsInfo()
    },
    clearInput() {
      //清除搜索内容
      this.queryInfo.query=""
      this.getGoodsInfo()
    },
    searchInput() { 
      this.getGoodsInfo()
    },
    goAddpage(){
      //跳转到添加商品
      this.$router.push("/goods/add")
    }
  },

}
</script>

<style lang="less" scoped>

</style>