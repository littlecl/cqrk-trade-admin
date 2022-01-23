<template>
  <div :class="className" :style="{ height, width }" />
</template>

<script>
import echarts from "echarts";
// require('echarts/theme/macarons') // echarts theme
import resize from "./mixins/resize";

export default {
  name: "PieChart",
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
      sortItem: [],
      sortInfo: [],
    };
  },
  async mounted() {
    await this.getPieChartInfo();
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    async getPieChartInfo() {
      let result = await this.$API.getPieChartInfo();
      if (result.code === 200) {
        this.sortItem = result.data.sortItem;
        this.sortInfo = result.data.sortInfo;
      }
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      const option = {
        title: {
          text: "商品发布",
          subtext: "类型统计",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: this.sortItem,
        },
        series: [
          {
            name: "分类",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.sortInfo,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
};
</script>
