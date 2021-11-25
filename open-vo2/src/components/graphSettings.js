//Graph Settings File
export default {
  CO2GraphOptions: {
    chart: {
      id: "CO2-Chart",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: TextTrackCue,
        easing: "linear",
        speed: 1,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: false,
          speed: 350,
        },
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1,
      dashArray: 0,
    },
    xaxis: {
      labels: {
        show: false,
        showAlways: false,
      },
      axisTicks: {
        show: false,
        borderType: "solid",
        color: "#78909C",
        width: 6,
        offsetX: 0,
        offsetY: 0,
      },
      axisBorder: {
        show: false,
        color: "#78909C",
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      min: 0,
      max: 6,
      labels: {
        formatter: (value) => {
          return value.toFixed(0);
        },
      },
    },
  },
  VO2GraphOptions: {
    chart: {
      id: "CO2-Chart",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: TextTrackCue,
        easing: "linear",
        speed: 1,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: false,
          speed: 350,
        },
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1,
      dashArray: 0,
    },
    xaxis: {
      labels: {
        show: false,
        showAlways: false,
      },
      axisTicks: {
        show: false,
        borderType: "solid",
        color: "#78909C",
        width: 6,
        offsetX: 0,
        offsetY: 0,
      },
      axisBorder: {
        show: false,
        color: "#78909C",
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        formatter: (value) => {
          return value.toFixed(0);
        },
      },
    },
  },
  oxygenChartOptions: {
    chart: {
      id: "vuechart-example",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: TextTrackCue,
        easing: "linear",
        speed: 1,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: false,
          speed: 350,
        },
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1,
      dashArray: 0,
    },

    xaxis: {
      labels: {
        show: false,
        showAlways: false,
      },
      axisTicks: {
        show: false,
        borderType: "solid",
        color: "#78909C",
        width: 6,
        offsetX: 0,
        offsetY: 0,
      },
      axisBorder: {
        show: false,
        color: "#78909C",
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      min: 15,
      max: 22,
      labels: {
        formatter: (value) => {
          return value.toFixed(0);
        },
      },
    },
  },
  flowCalChart: {
    chart: {
      id: "flowCalChart",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: TextTrackCue,
        easing: "linear",
        speed: 1,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: false,
          speed: 350,
        },
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1,
      dashArray: 0,
    },
    xaxis: {
      labels: {
        show: false,
        showAlways: false,
      },
      axisTicks: {
        show: false,
        borderType: "solid",
        color: "#78909C",
        width: 6,
        offsetX: 0,
        offsetY: 0,
      },
      axisBorder: {
        show: false,
        color: "#78909C",
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      min: -10,
      max: 10,
      labels: {
        formatter: (value) => {
          return value.toFixed(0);
        },
      },
    },
  },
};