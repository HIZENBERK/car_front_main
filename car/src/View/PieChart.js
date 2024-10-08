// PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // 데이터 라벨 플러그인 임포트
import { Chart, Tooltip } from 'chart.js';

// Chart.js의 Tooltip 플러그인 등록
Chart.register(Tooltip);

const PieChart = () => {
  const data = {
    labels: ['업무용', '출/퇴근용', '비업무'],
    datasets: [
      {
        label: '운행 비율',
        data: [300, 50, 100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '운행 비율',
      },
      datalabels: {
        color: 'black', // 라벨 색상 설정
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1); // 비율 계산
          return `${percentage}%`; // 비율 문자열 반환
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const value = dataset.data[tooltipItem.dataIndex]; // 원래 데이터 값
            const label = data.labels[tooltipItem.dataIndex]; // 레이블
            return `${label}: ${value}`; // 툴팁에서 원래 데이터 값 표시
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '180px', height: '180px', marginTop: '10px', marginLeft: '45px' }}> {/* 원하는 크기로 조정 */}
      <Pie data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default PieChart;
