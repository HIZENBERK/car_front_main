import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, Tooltip } from 'chart.js';

// Chart.js의 Tooltip 플러그인 등록
Chart.register(Tooltip);

const BarChart = ({ data }) => {
  // 데이터가 없을 경우 기본값 설정
  const defaultData = {
    labels: [],
    datasets: [],
  };

  const rawData = data || defaultData; // props로 전달된 data를 사용

  // 라벨별 데이터의 총합을 기준으로 각 값을 백분율로 변환하는 함수
  const calculatePercentage = () => {
    const totalPerLabel = rawData.labels.map((_, index) => {
      const total = rawData.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0);
      return total;
    });

    const percentageData = rawData.datasets.map((dataset) => ({
      ...dataset,
      percentages: dataset.data.map((value, index) =>
        ((value / totalPerLabel[index]) * 100).toFixed(2)
      ),
    }));

    return percentageData;
  };

  const percentageData = calculatePercentage();

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '월간 운행비율',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = percentageData[tooltipItem.datasetIndex];
            const value = rawData.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
            const percentage = dataset.percentages[tooltipItem.dataIndex];
            return `${dataset.label}: ${value} ( ${percentage}% )`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '400px', height: '400px', marginTop: '10px', marginRight: '10px' }}>
      <Bar data={rawData} options={options} />
    </div>
  );
};

export default BarChart;
