<template>
  <div>
    <el-table :data="wxUserInfo" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="nickName" label="用户名"> </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="{ row, $index }">
          <img
            style="width: 100px; height: 100px"
            :src="row.avatarUrl"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column prop="createUserTime" label="创建时间">
      </el-table-column>
      <el-table-column prop="openId" label="openId"> </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getWxUserInfo"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :page-sizes="[1, 2, 5, 10]"
      layout="  prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "wxuser",
  data() {
    return {
      page: 1,
      limit: 1,
      total: 0,
      wxUserInfo: [],
    };
  },
  mounted() {
    this.getWxUserInfo();
  },
  methods: {
    // 微信用户信息
    async getWxUserInfo(page = 1) {
      this.page = page;
      let result = await this.$API.getWxUserInfo(this.page, this.limit);
      if (result.code === 200) {
        this.wxUserInfo = result.data;
        this.total = result.total;
      }
    },
    // 切换每页数量
    handleSizeChange(size) {
      this.limit = size;
      this.getWxUserInfo();
    },
  },
};
</script>

<style>
</style>