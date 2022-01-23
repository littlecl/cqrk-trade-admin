<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
// import 'echarts/theme/macarons' // echarts theme
import resize from "./mixins/resize";

const animationDuration = 3000;

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      chart: null,
      zhiyuan: [],
      xiangyuan: [],
      huiyuan: [],
    };
  },
  async mounted() {
    await this.getBarChartInfo();
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    // 销毁实例，销毁后实例无法再被使用。
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    async getBarChartInfo() {
      let result = await this.$API.getBarChartInfo();
      if (result.code === 200) {
        this.zhiyuan = result.data.zhiyuan;
        this.xiangyuan = result.data.xiangyuan;
        this.huiyuan = result.data.huiyuan;
      }
    },
    initChart() {
      // 创建一个 ECharts 实例
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        title: {
          text: "商品发布园区",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: 50,
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: [
          {
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "智园",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: this.zhiyuan,
            animationDuration,
          },
          {
            name: "庠园",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: this.xiangyuan,
            animationDuration,
          },
          {
            name: "慧园",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: this.huiyuan,
            animationDuration,
          },
        ],
      });
    },
  },
};
</script>
