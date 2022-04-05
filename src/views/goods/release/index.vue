<template>
  <div>
    <el-button
      class="allDelete"
      type="primary"
      size="small"
      :disabled="disable"
      @click="allDelete(), clickHandler($event)"
      >批量删除</el-button
    >
    <!-- 表格 -->
    <el-table
      :data="goodsInfo"
      style="width: 100%"
      @filter-change="filterHandlerChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column
        label="序号"
        width="60"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品 ID">
              <span>{{ props.row._id }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.goodsSort }}</span>
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ props.row.goodsTitle }}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{ props.row.price }}元</span>
            </el-form-item>
            <el-form-item label="商品图片">
              <span
                v-for="(goodsImg, index) in props.row.releaseImg.goodsImg"
                :key="goodsImg"
                ><el-image
                  style="width: 100px; height: 100px; margin-left: 15px"
                  :lazy="imgLazy"
                  fit="contain"
                  :src="goodsImg"
                  :preview-src-list="props.row.releaseImg.goodsImg"
                  alt=""
              /></span>
            </el-form-item>
            <el-form-item label="发布者">
              <span>{{ props.row.nickName }} </span>
            </el-form-item>
            <el-form-item label="头像">
              <span>
                <img
                  style="width: 50px; height: 50px"
                  :src="props.row.avatarUrl"
                  alt=""
                />
              </span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="发布时间">
              <span>{{ props.row.releaseTime }}</span>
            </el-form-item>
            <el-form-item label="联系方式 ">
              <span v-if="props.row.concatQQ" style="margin-right: 20px">
                QQ：{{ props.row.concatQQ }}
              </span>
              <span v-if="props.row.concatWeixin" style="margin-right: 20px"
                >微信：{{ props.row.concatWeixin }}</span
              >
              <span v-if="props.row.concatTel"
                >电话：{{ props.row.concatTel }}</span
              >
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.goodsDes }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="商品分类"
        prop="goodsSort"
        column-key="goodsSort"
        :filter-multiple="false"
        :filters="sortFilter"
      >
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="goodsTitle"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column label="商品价格">
        <template slot-scope="{ row, $index }"> {{ row.price }}元 </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="">
        <template slot-scope="{ row, $index }">
          <el-tag :type="row.status ? 'danger' : 'success'" size="small">{{
            row.status ? "未通过" : "通过"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="">
        <template slot-scope="{ row, $index }">
          <el-popover
            title="选择状态"
            placement="left"
            width="250"
            trigger="hover"
            :ref="`${$index}`"
            @show="getStatus(row)"
          >
            <el-form :model="statusForm">
              <el-form-item label="" style="margin-bottom: 10px" prop="status">
                <el-radio-group v-model="statusForm.status">
                  <el-radio :label="0">通过</el-radio>
                  <el-radio :label="1">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <div style="text-align: right; margin: -10px 0">
                <el-button size="mini" @click="cancelCheck($index)"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="changeCheckStatus(row, $index)"
                  >确定</el-button
                >
              </div>
            </el-form>
            <el-button
              size="mini"
              slot="reference"
              @click="clickHandler($event)"
              >审核</el-button
            >
          </el-popover>
          <el-button
            style="margin-left: 5px"
            size="mini"
            type="danger"
            @click="deleteGoodsInfo(row), clickHandler($event)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center; margin: 20px 0"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :page-sizes="[5, 8, 10]"
      layout="prev, pager, next, jumper, ->,sizes,total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "releaseGoods",
  data() {
    return {
      page: 1,
      limit: 8,
      total: 0,
      goodsInfo: [], //商品信息
      statusForm: {
        status: "",
      }, //审核状态，0代表审核通过，1代表审核不通过
      sortFilter: [
        //'','书籍','美妆','体育','服饰','食品','学习','数码','电器'
        { text: "书籍", value: "书籍" },
        { text: "美妆", value: "美妆" },
        { text: "体育", value: "体育" },
        { text: "服饰", value: "服饰" },
        { text: "食品", value: "食品" },
        { text: "学习", value: "学习" },
        { text: "数码", value: "数码" },
        { text: "电器", value: "电器" },
      ],
      filterGoodsSortInfo: {}, //分类筛选
      flag: false, //是否是分类筛选的标志，false代表不是，true代表是
      selectGoodsInfo: {
        goodsIdArr: [], //批量删除商品id
        goodsImgIdArr: [], //批量删除商品图片id
      },
      disable: true, //禁用批量删除按钮
      imgLazy: true,
    };
  },
  mounted() {
    this.getAllGoodsInfo();
  },
  methods: {
    async getAllGoodsInfo() {
      let result = await this.$API.getAllGoodsInfo(this.page, this.limit);
      if (result.code === 200) {
        this.goodsInfo = result.data;
        this.total = result.total;
      }
    },
    // 切换分页器页码
    handleCurrentChange(page) {
      this.page = page;
      if (!this.flag) {
        this.getAllGoodsInfo();
      }
      if (this.flag) {
        this.getFilterGoodsInfo();
      }
    },
    // 切换每页数量
    handleSizeChange(size) {
      this.limit = size;
      if (!this.flag) {
        this.getAllGoodsInfo();
      }
      if (this.flag) {
        this.getFilterGoodsInfo();
      }
    },
    // 删除商品
    deleteGoodsInfo(row) {
      this.$confirm("你确定要删除该条发布商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let result = await this.$API.deleteGoodsInfo(
              row._id,
              row.releaseImg._id
            );
            if (result.code === 200) {
              this.$message.success("删除商品成功！");
              // 正常删除那个数据回到的还是哪个数据所在的页面
              this.handleCurrentChange(
                this.goodsInfo.length > 1 ? this.page : this.page - 1
              );
            }
          } catch (error) {}
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 获取商品审核状态
    getStatus(row) {
      this.statusForm.status = row.status;
    },
    // 取消审核
    cancelCheck(index) {
      this.$refs[`${index}`].doClose();
    },
    // 修改审核状态
    async changeCheckStatus(row, index) {
      setTimeout(() => {
        this.cancelCheck(index);
      }, 1000);
      let result = await this.$API.updateCheckStatus(
        row.id,
        this.statusForm.status
      );
      if (result.code === 200) {
        this.$message.success("修改成功！");
        this.getAllGoodsInfo();
      }
    },
    //按钮点击后失焦
    clickHandler(e) {
      let target = e.target;
      if (target.nodeName == "SPAN") {
        target = e.target.parentNode;
      }
      target.blur();
    },
    // 分类筛选
    filterHandlerChange(filter) {
      // 获取分类筛选信息
      this.filterGoodsSortInfo = filter;
      if (this.filterGoodsSortInfo.goodsSort.length === 0) {
        this.flag = false;
        this.page = 1;
        this.getAllGoodsInfo();
        return false;
      }
      this.page = 1;
      this.getFilterGoodsInfo();
    },
    // 获取分类筛选信息
    async getFilterGoodsInfo() {
      let result = await this.$API.filterGoodsInfo(
        this.filterGoodsSortInfo,
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.flag = true;
        this.goodsInfo = result.data;
        this.total = result.total;
      }
    },
    // 多选
    handleSelectionChange(selection) {
      this.disable = false;
      this.selectGoodsInfo.goodsIdArr = [];
      this.selectGoodsInfo.goodsImgIdArr = [];
      for (let i = 0; i < selection.length; i++) {
        this.selectGoodsInfo.goodsIdArr.push(selection[i].id);
        this.selectGoodsInfo.goodsImgIdArr.push(selection[i].releaseImg._id);
      }
      // 多选为空时，按钮禁用
      if (this.selectGoodsInfo.goodsIdArr.length === 0) {
        this.disable = true;
      }
    },
    // 批量删除商品
    allDelete() {
      this.$confirm("你确定要批量删除选中的发布商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let result = await this.$API.batchDeleteGoodsInfo(
              this.selectGoodsInfo
            );
            if (result.code === 200) {
              this.$message.success("删除成功！");
              // 当前页数据全选删除时执行
              if (
                this.selectGoodsInfo.goodsIdArr.length === this.goodsInfo.length
              ) {
                if (this.page !== 1) {
                  this.handleCurrentChange(this.page - 1);
                } else {
                  this.handleCurrentChange(this.page);
                }
              } else {
                this.handleCurrentChange(
                  this.goodsInfo.length > 1 ? this.page : this.page - 1
                );
              }
            }
          } catch (error) {}
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
  },
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-bottom: 0;
  width: 70%;
}
.allDelete {
  margin: 20px 0 0 20px;
}
</style>