<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >
    <el-table :data="adminInfo" border style="width: 100%">
      <el-table-column type="index" prop="" label="序号" width="180">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="" label="用户头像">
        <template slot-scope="{ row, $index }">
          <img style="width: 100px; height: 100px" :src="row.avatar" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-edit"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteAdmin(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getAdminInfo"
      style="text-align: center; margin-top: 20px"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :page-sizes="[1, 2, 5, 10, 15]"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 点击添加管理员 -->
    <el-dialog
      :title="tmForm.id ? '修改管理员信息' : '添加管理员'"
      top="11vh"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm">
        <el-form-item label="用户名" label-width="100px">
          <el-input autocomplete="off" v-model="tmForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="100px">
          <el-input autocomplete="off" v-model="tmForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input autocomplete="off" v-model="tmForm.password"></el-input>
        </el-form-item>

        <el-form-item label="头像" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/uploadAvatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.avatar" :src="tmForm.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "admin",
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      adminInfo: [], //管理员信息

      dialogFormVisible: false, //决定dialog是否显示

      // 管理员信息
      tmForm: {
        username: "",
        nickName: "",
        password: "",
        avatar: "",
      }, //用来收集数据
    };
  },
  mounted() {
    this.getAdminInfo();
  },
  methods: {
    //  管理员信息
    async getAdminInfo(page = 1) {
      this.page = page;
      if (this.page === 0) return false;
      let result = await this.$API.getAdminInfo(this.page, this.limit);
      if (result.code === 200) {
        this.adminInfo = result.data;
        this.total = result.total;
      }
    },
    // 切换每页数量
    handleSizeChange(size) {
      this.limit = size;
      this.getAdminInfo();
    },
    // 删除管理用户
    deleteAdmin(row) {
      this.$confirm("你确定要删除该管理员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let result = await this.$API.deleteUser(row._id);
            if (result.code === 200) {
              this.$message.success("删除成功！");
              this.getAdminInfo(
                this.adminInfo.length > 1 ? this.page : this.page - 1
              );
            } else {
              this.$message.warning("该管理员不能删除！");
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

    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.tmForm.avatar = res.data;
    },
    // 图片上传前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      //   const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      //   if (!isPNG) {
      //     this.$message.error("上传头像图片只能是 PNG 格式!");
      //   }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 点击添加按钮显示添加管理员dialog页面
    showAddDialog() {
      this.dialogFormVisible = true;
      this.tmForm = {
        username: "",
        nickName: "",
        password: "",
        avatar: "",
      };
    },
    // 点击修改按钮显示修改管理员信息dialog页面
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      //   this.tmForm = row;
      this.tmForm = { ...row }; //浅拷贝
    },
    // 添加管理员
    async addAdmin() {
      this.dialogFormVisible = false;
      let userInfo = this.tmForm;
      let result = await this.$API.addOrUpdate(userInfo);
      if (result.code === 200) {
        this.$message.success(result.message);
        this.getAdminInfo(userInfo.id ? this.page : 1);
      }
    },
  },
};
</script>

<style >
.el-button {
  margin: 10px 0;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>