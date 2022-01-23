<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddSliderDialog"
      >添加</el-button
    >
    <el-table :data="sliderInfo" border style="width: 100%">
      <el-table-column label="序号" type="index" width="80"> </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="{ row, $index }">
          <img :src="row.sliderImg" style="width: 120px; height: 120px" />
        </template>
      </el-table-column>
      <el-table-column prop="link" label="链接"> </el-table-column>
      <el-table-column prop="createTime" label="添加时间" width="180">
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template slot-scope="{ row, $index }">
          {{ row.status ? "未使用" : "使用中" }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-edit"
            @click="showUpdateSliderDialog(row)"
            >修改</el-button
          >

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
                  <el-radio :label="0">使用</el-radio>
                  <el-radio :label="1">不使用</el-radio>
                </el-radio-group>
              </el-form-item>
              <div style="text-align: right; margin: -10px 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="cancelChangeStatus($index)"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="changeStatus(row, $index)"
                  >确定</el-button
                >
              </div>
            </el-form>

            <el-button
              style="margin-left: 5px"
              size="mini"
              type="success"
              icon="el-icon-question"
              slot="reference"
              @click="getStatus(row)"
              >状态</el-button
            >
          </el-popover>

          <el-button
            style="margin-left: 5px"
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
      :page-sizes="[2, 3, 5, 10]"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 添加轮播图片 -->
    <!-- :on-preview="handlePreview" -->
    <el-dialog
      :title="sliderForm.id ? '修改轮播图片' : '添加轮播图片'"
      :visible.sync="dialogFormVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        :model="sliderForm"
        :rules="rules"
        ref="sliderForm"
        style="width: 80%"
      >
        <el-form-item label="" prop="sliderImg">
          <el-upload
            ref="uploadSlider"
            class="upload-demo"
            action="/api/admin/uploadSlider"
            :before-upload="beforeSliderUpload"
            :on-success="handleSliderSuccess"
            :on-remove="handleRemove"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary" plain>{{
              sliderForm.id ? "新的上传" : "点击上传"
            }}</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog> -->
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input autocomplete="off" v-model="sliderForm.link"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddSlider">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateSlider">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 状态弹出框 -->
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
      limit: 2,
      total: 0,
      sliderInfo: [],

      dialogFormVisible: false,
      // visible: false,

      sliderForm: {
        sliderImg: "",
        link: "",
      },
      rules: {
        sliderImg: [
          { required: true, message: "请上传一张轮播图片", trigger: "blur" },
        ],
        link: [
          {
            min: 5,
            max: 40,
            message: "链接长度必须为 5 - 40 之间",
            trigger: "change",
          },
        ],
      },
      statusForm: {
        status: "",
      },
    };
  },
  mounted() {
    this.getSliderInfo();
  },
  methods: {
    // 获取轮播图信息
    async getSliderInfo(page = 1) {
      this.page = page;
      let result = await this.$API.getSliderInfo(this.page, this.limit);
      if (result.code === 200) {
        this.sliderInfo = result.data;
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
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传轮播图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传轮播图片大小不能超过 2MB!");
      }
      return (isJPG || isPNG) && isLt2M;
    },
    // 图片上传成功
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
    handleRemove(file, fileList) {
      console.log(file);
      console.log("111");
    },
    // 添加图片Dialog
    showAddSliderDialog() {
      this.dialogFormVisible = true;
      this.sliderForm = {
        sliderImg: "",
        link: "",
      };
    },
    // 关闭添加图片Dialog
    handleClose(done) {
      this.$refs.uploadSlider.clearFiles();
      done();
    },
    // 取消添加图片
    cancelAddSlider() {
      this.$refs.uploadSlider.clearFiles();
      this.dialogFormVisible = false;
    },
    // 修改图片Dialog
    showUpdateSliderDialog(row) {
      this.dialogFormVisible = true;
      this.sliderForm = { ...row };
    },
    // 增加或修改轮播图片
    addOrUpdateSlider() {
      this.$refs.sliderForm.validate(async (valid) => {
        if (valid) {
          // 清掉上传后的图片
          this.$refs.uploadSlider.clearFiles();
          this.dialogFormVisible = false;
          let result = await this.$API.addOrUpdateSliderInfo(this.sliderForm);
          if (result.code === 200) {
            this.$message.success(result.message);
            this.getSliderInfo(this.sliderForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除轮播图片
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
    // 获取图片的状态
    getStatus(row) {
      this.statusForm.status = row.status;
    },
    // 取消修改图片状态
    cancelChangeStatus(index) {
      this.$refs[`${index}`].doClose();
    },
    // 修改图片状态
    async changeStatus(row, index) {
      this.$refs[`${index}`].doClose();
      let result = await this.$API.updateSliderStatus(
        row.id,
        this.statusForm.status
      );
      if (result.code === 200) {
        this.$message.success("修改状态成功！");
        this.getSliderInfo(this.page);
      }
    },
  },
};
</script>

<style>
.el-button {
  margin: 10px 0;
}
</style>