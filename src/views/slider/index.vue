<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddSliderDialog"
      >添加</el-button
    >
    <el-table :data="sliderInfo" border style="width: 100%">
      <el-table-column prop="" label="序号" type="index" width="80">
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="{ row, $index }">
          <img :src="row.sliderImg" style="width: 120px; height: 120px" />
        </template>
      </el-table-column>
      <el-table-column prop="link" label="链接"> </el-table-column>
      <el-table-column prop="createTime" label="添加时间"> </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-edit"
            @click="showUpdateSliderDialog(row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteSlider(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getSliderInfo"
      style="text-align: center; margin-top: 20px"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :page-sizes="[1, 2, 4, 5, 10]"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 添加轮播图片 -->
    <!-- :on-preview="handlePreview" -->
    <el-dialog title="添加轮播图片" :visible.sync="dialogFormVisible">
      <el-form :model="sliderForm">
        <el-form-item label="">
          <el-upload
            class="upload-demo"
            action="/api/admin/uploadSlider"
            :before-upload="beforeSliderUpload"
            :on-success="handleSliderSuccess"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog> -->
        </el-form-item>
        <el-form-item label="链接">
          <el-input autocomplete="off" v-model="sliderForm.link"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateSlider">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "slider",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,

      page: 1,
      limit: 1,
      total: 0,
      sliderInfo: [],

      dialogFormVisible: false,

      sliderForm: {
        sliderImg: "",
        link: "",
      },
    };
  },
  mounted() {
    this.getSliderInfo();
  },
  methods: {
    async getSliderInfo(page = 1) {
      this.page = page;
      let result = await this.$API.getSliderInfo(this.page, this.limit);
      if (result.code === 200) {
        this.sliderInfo = result.data;
        console.log(this.sliderInfo);
        this.total = result.total;
      }
    },
    // 切换每页数量
    handleSizeChange(size) {
      this.limit = size;
      this.getSliderInfo();
    },

    beforeSliderUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传轮播图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传轮播图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleSliderSuccess(res, file) {
      this.sliderForm.sliderImg = res.data;
    },
    // handlePreview(file) {
    //   console.log(file);
    //   this.dialogImageUrl = file.response.data;
    //   this.dialogVisible = true;
    // },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    showAddSliderDialog() {
      this.dialogFormVisible = true;
      this.sliderForm = {
        sliderImg: "",
        link: "",
      };
    },
    showUpdateSliderDialog(row) {
      this.dialogFormVisible = true;
      this.sliderForm = { ...row };
    },
    async addOrUpdateSlider() {
      this.dialogFormVisible = false;
      let result = await this.$API.addOrUpdateSliderInfo(this.sliderForm);
      if (result.code === 200) {
        this.$message.success(result.message);
        this.getSliderInfo(this.sliderForm.id ? this.page : 1);
      }
    },
    deleteSlider(row) {
      this.$confirm("你确定要删除该图片吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let result = await this.$API.deleteSlider(row.id);
            if (result.code === 200) {
              this.$message.success("删除成功！");
              this.getSliderInfo(
                this.sliderInfo.length > 1 ? this.page : this.page - 1
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
  },
};
</script>

<style>
.el-button {
  margin: 10px 0;
}
</style>