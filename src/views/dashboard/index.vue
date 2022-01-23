<template>
  <div class="dashboard-editor-container">
    <PanelGroup @handleSetLineChartData="handleSetLineChartData" />

    <div class="chart-line">
      <line-chart :chart-data="lineChartData" :yTitle="yTitle" />
    </div>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
          <bar-chart />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
          <pie-chart />
        </el-card>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card>
          <line-chart2 />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card>
          <bar-chart2 />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card>
          <pie-chart2 />
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";

import LineChart2 from "./components/LineChart2";
import BarChart2 from "./components/BarChart2";
import PieChart2 from "./components/PieChart2";

const lineChartDatas = {
  release: {
    expectedData: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
    actualData: [],
  },
  collect: {
    expectedData: [5, 10, 15, 20, 30, 35, 40, 50, 60, 70, 80, 95],
    actualData: [],
  },
  newUsers: {
    expectedData: [5, 10, 15, 25, 30, 40, 46, 60, 68, 75, 88, 100],
    actualData: [],
  },
  // messages: {
  //   expectedData: [200, 192, 120, 144, 160, 130, 140],
  //   actualData: [180, 160, 151, 106, 145, 150, 130],
  // },
};

const yTitles = {
  release: "发布数量(条)",
  collect: "收藏数量(条)",
  newUsers: "用户数量(人)",
  // messages: "消息数量(条)",
};

export default {
  name: "DashBoard",

  data() {
    return {
      lineChartDatas: [],
      // lineChartData: lineChartDatas.release,
      lineChartData: {},
      yTitle: yTitles.release,
      m: null,
    };
  },

  mounted() {
    setTimeout(() => {
      this.lineChartDatas = lineChartDatas;
      this.lineChartData = lineChartDatas.release;
    }, 1000);

    this.getLineChartInfo();
  },

  methods: {
    handleSetLineChartData(type) {
      this.yTitle = yTitles[type];
      this.lineChartData = lineChartDatas[type];
    },

    async getLineChartInfo() {
      let result = await this.$API.getLineChartInfo();
      if (result.code === 200) {
        lineChartDatas.release.actualData = result.data.releaseCount;
        lineChartDatas.collect.actualData = result.data.alreadyCount;
        lineChartDatas.newUsers.actualData = result.data.wxuserCount;
      }
    },
  },

  components: {
    PanelGroup,
    LineChart,
    BarChart,
    PieChart,
    LineChart2,
    BarChart2,
    PieChart2,
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-line {
    background: #fff;
    padding: 16px 0 0 16px;
    margin-bottom: 32px;
  }
  .chart-row {
    margin-bottom: 32px;
  }
}
</style>
