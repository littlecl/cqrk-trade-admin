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
    <el-table
      :data="messages"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="头像" width="130">
        <template slot-scope="{ row, $index }">
          <el-image style="width: 50px" :src="row.avatar"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="留言人" width="200">
      </el-table-column>
      <el-table-column prop="message" label="内容"> </el-table-column>
      <el-table-column
        prop="messageTime"
        label="留言时间"
        width="190"
      ></el-table-column>
      <el-table-column
        prop="reply.length"
        label="回复数"
        align="center"
        width="160"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-message"
            @click="clickHandler($event), showReply(row)"
            >查看回复</el-button
          >
          <el-button
            style="margin-left: 5px"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteMessage(row), clickHandler($event)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getMessages"
      style="text-align: center; margin-top: 20px"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :page-sizes="[8, 10, 20]"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 回复内容 -->
    <el-drawer
      :title="nameMessage + '的回复信息'"
      :visible.sync="flag"
      direction="rtl"
      size="60%"
    >
      <el-button
        class="allDelete"
        type="primary"
        size="mini"
        :disabled="disable"
        @click="allDeleteReply(), clickHandler($event)"
        >批量删除</el-button
      >
      <el-table :data="replys" @selection-change="handleSelectionChangeReply">
        <el-table-column
          type="selection"
          label="序号"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column property="" label="回复者头像" width="100">
          <template slot-scope="{ row, $index }">
            <el-image style="width: 40px" :src="row.avatar"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          property="nickName"
          label="回复者昵称"
          width="200"
        ></el-table-column>
        <el-table-column property="message" label="回复内容"></el-table-column>
        <el-table-column
          property="messageTime"
          label="回复时间"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button
              style="margin-left: 5px"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteReply(row), clickHandler($event)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "message",
  data() {
    return {
      page: 1,
      limit: 8,
      total: 0,
      messages: [], //回复信息
      messagesIdArr: [], //留言id数组
      disable: true, //禁用批量删除按钮
      replys: [], //留言回复
      flag: false,
      nameMessage: "", //留言人昵称
      replyId: "", //回复信息的id
      replysIdArr: [], //回复id数组
    };
  },
  mounted() {
    this.getMessages();
  },
  methods: {
    // 获取留言
    async getMessages(page = 1) {
      this.page = page;
      let result = await this.$API.getMessages(this.page, this.limit);
      if (result.code === 200) {
        this.messages = result.data;
        this.total = result.total;
      }
    },
    // 切换每页数量
    handleSizeChange(size) {
      this.limit = size;
      this.getMessages();
    },
    // 删除留言
    deleteMessage(row) {
      this.$confirm("你确定要删除该条留言吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let result = await this.$API.deleteMessage(row.id);
            if (result.code === 200) {
              this.$message.success("删除该条成功！");
              // 正常删除那个数据回到的还是哪个数据所在的页面
              this.getMessages(
                this.messages.length > 1 ? this.page : this.page - 1
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
    //按钮点击后失焦
    clickHandler(e) {
      let target = e.target;
      if (target.nodeName == "SPAN") {
        target = e.target.parentNode;
      }
      target.blur();
    },
    // 多选
    handleSelectionChange(selection) {
      this.disable = false;
      this.messagesIdArr = [];
      for (let i = 0; i < selection.length; i++) {
        this.messagesIdArr.push(selection[i].id);
      }
      // 多选为空时，按钮禁用
      if (this.messagesIdArr.length === 0) {
        this.disable = true;
      }
    },
    // 批量删除留言
    allDelete() {
      this.$confirm("你确定要批量删除选中的留言吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let result = await this.$API.batchDeleteMessage(this.messagesIdArr);
            if (result.code === 200) {
              this.$message.success("删除成功！");
              // 当前页数据全选删除时执行
              if (this.messagesIdArr.length === this.messages.length) {
                if (this.page !== 1) {
                  this.getMessages(this.page - 1);
                } else {
                  this.getMessages(this.page);
                }
              } else {
                this.getMessages(
                  this.messages.length > 1 ? this.page : this.page - 1
                );
              }
            }
          } catch (error) {}
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 展示回复
    showReply(row) {
      this.flag = true;
      this.replys = row.reply;
      this.nameMessage = row.nickName;
      this.replyId = row.id;
    },
    // 重新获取回复信息
    async getReplyInfo(id) {
      let result = await this.$API.getReplyInfo(id);
      if (result.code === 200) {
        this.replys = result.data;
      }
    },
    // 删除回复
    deleteReply(row) {
      this.$confirm("你确定要删除该条留言吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let result = await this.$API.deleteReply(row._id);
            if (result.code === 200) {
              this.$message.success("删除该条成功！");
              this.getReplyInfo(this.replyId);
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
    // 多选删除回复
    handleSelectionChangeReply(selection) {
      this.disable = false;
      this.replysIdArr = [];
      for (let i = 0; i < selection.length; i++) {
        this.replysIdArr.push(selection[i].id);
      }
      // 多选为空时，按钮禁用
      if (this.replysIdArr.length === 0) {
        this.disable = true;
      }
    },
    // 批量删除回复
    allDeleteReply() {
      this.$confirm("你确定要批量删除选中的回复信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let result = await this.$API.batchDeleteReply(this.replysIdArr);
            if (result.code === 200) {
              this.$message.success("删除成功！");
              this.getReplyInfo(this.replyId);
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

<style scoped>
.allDelete {
  margin: 20px 0 0 20px;
}
/deep/ .el-drawer.rtl {
  overflow-y: auto;
}
</style>
