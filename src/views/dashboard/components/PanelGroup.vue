<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData('release')"
        :class="{ active: currentType === 'release' }"
      >
        <div class="card-panel-icon-wrapper icon-fabu">
          <svg-icon icon-class="fabu" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">发布数量</div>
          <count-to
            :start-val="0"
            :end-val="releaseCount"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData('collect')"
        :class="{ active: currentType === 'collect' }"
      >
        <div class="card-panel-icon-wrapper icon-shoucang">
          <svg-icon icon-class="shoucang" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">收藏数量</div>
          <count-to
            :start-val="0"
            :end-val="alreadyCount"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData('newUsers')"
        :class="{ active: currentType === 'newUsers' }"
      >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">用户数量</div>
          <count-to
            :start-val="0"
            :end-val="wxuserCount"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>

    <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData('messages')"
        :class="{ active: currentType === 'messages' }"
      >
        <div class="card-panel-icon-wrapper icon-messages">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">消息数量</div>
          <count-to
            :start-val="0"
            :end-val="alreadyCount"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col> -->
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";
export default {
  data() {
    return {
      currentType: "release",
      releaseCount: 0,
      alreadyCount: 0,
      wxuserCount: 0,
    };
  },
  mounted() {
    this.getHomeInfo(); //首页信息
  },

  components: {
    CountTo,
  },
  methods: {
    handleSetLineChartData(type) {
      this.currentType = type;
      this.$emit("handleSetLineChartData", type);
    },
    // 首页
    async getHomeInfo() {
      let result = await this.$API.getHomeInfo();
      if (result.code === 200) {
        this.releaseCount = result.data.releaseCount;
        this.alreadyCount = result.data.alreadyCount;
        this.wxuserCount = result.data.wxuserCount;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-messages {
        background: skyblue;
      }

      .icon-fabu {
        background: #d4237a;
      }

      .icon-shoucang {
        background: #ffbc46;
      }
    }
    &.active {
      background: #ddd;
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-messages {
      color: skyblue;
    }

    .icon-fabu {
      color: #d4237a;
    }

    .icon-shoucang {
      color: #ffbc46;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
