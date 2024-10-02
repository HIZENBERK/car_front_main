// BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = () => {
  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], // X축 레이블
    datasets: [
      {
        label: '업무용',
        data: [12, 19, 3, 5, 2, 3, 15, 7, 11, 8, 6, 9], // 각 카테고리에 대한 데이터
        backgroundColor: 'rgba(255, 0, 0, 0.6)', // 빨강
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1,
      },
      {
        label: '출/퇴근용',
        data: [15, 10, 5, 7, 3, 2, 8, 11, 14, 9, 5, 6],
        backgroundColor: 'rgba(0, 0, 255, 0.6)', // 파랑
        borderColor: 'rgba(0, 0, 255, 1)',
        borderWidth: 1,
      },
      {
        label: '비업무용',
        data: [7, 8, 12, 6, 3, 9, 14, 10, 5, 4, 7, 11],
        backgroundColor: 'rgba(0, 128, 0, 0.6)', // 초록
        borderColor: 'rgba(0, 128, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              label += ': ' + context.parsed.y; // 레이블에 데이터 값 추가
            }
            return label;
          },
        },
      },
      title: {
        display: true,
        text: '월간 운행거리',
      },
    },
  };

  return (
    <div style={{ width: '400px', height: '400px', marginTop: '10px', marginRight: '5px' }}> {/* 차트 크기 조정 */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
