import React from "react";
import ReactApexChart from "react-apexcharts";
import { format } from "date-fns";
import ruLocale from "date-fns/locale/ru";

const XLabel = "Время";

const createChartOptions = (dataX, XLabel, YLabel) => ({
  chart: {
    type: "area",
    stacked: false,
    height: 350,
    zoom: {
      type: "x",
      enabled: true,
      autoScaleYaxis: true,
    },
    toolbar: {
      autoSelected: "zoom",
      tools: {
        download: false,
        selection: false,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: false,
        reset: false,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  title: {
    text: `Параметр ${YLabel}`,
    align: "center",
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.5,
    },
  },
  yaxis: {
    title: {
      text: YLabel,
    },
  },
  xaxis: {
    tickAmount: 4,
    categories: dataX,
    title: {
      text: XLabel,
    },
    labels: {
      rotate: 0,
      style: {
        fontSize: "10px",
        marginBottom: "50px",
      },
    },
  },
});

export const MultiChartComponent = ({ data }) => {
  const YLabel = "Значение";
  const noParameterData = data.map(({ no }) => no);
  const pm10ParameterData = data.map(({ pm10 }) => pm10);

  const xaxisData = data.map(({ datetime }) =>
    format(new Date(datetime), "dd.MM.yy hh:mm", { locale: ruLocale })
  );

  const chartOptions = createChartOptions(xaxisData, XLabel, YLabel);

  const series = [
    {
      name: "Параметр no",
      data: noParameterData,
    },
    {
      name: "Параметр pm10",
      data: pm10ParameterData,
    },
  ];

  return (
    <ReactApexChart
      options={chartOptions}
      series={series}
      type="area"
      height={310}
    />
  );
};
