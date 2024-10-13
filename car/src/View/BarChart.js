import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, Tooltip } from 'chart.js';

// Chart.js의 Tooltip 플러그인 등록
Chart.register(Tooltip);

const BarChart = () => {
  const rawData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'], // X축 레이블
    datasets: [
      {
        label: '업무용',
        data: [20000, 30000, 50000, 20000, 25000, 10000, 40000, 20000, 30000, 30000, 20000, 30000], // 10,000 단위 데이터
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // 빨강
        borderColor: 'rgba(255, 99, 132, 1)', // 빨강 경계선
        borderWidth: 1,
      },
      {
        label: '출퇴근용',
        data: [10000, 15000, 10000, 15000, 5000, 5000, 10000, 15000, 10000, 15000, 10000, 10000],
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // 파랑
        borderColor: 'rgba(54, 162, 235, 1)', // 파랑 경계선
        borderWidth: 1,
      },
      {
        label: '비업무용',
        data: [10000, 5000, 10000, 5000, 20000, 35000, 10000, 15000, 10000, 10000, 10000, 10000],
        backgroundColor: 'rgba(255, 206, 86, 0.2)', // 노랑
        borderColor: 'rgba(255, 206, 86, 1)', // 노랑 경계선
        borderWidth: 1,
      },
    ],
  };

  // 라벨별 데이터의 총합을 기준으로 각 값을 백분율로 변환하는 함수
  const calculatePercentage = () => {
    const totalPerLabel = rawData.labels.map((_, index) => {
      const total = rawData.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0); // 각 라벨의 합계 계산
      return total;
    });

    const percentageData = rawData.datasets.map((dataset) => ({
      ...dataset,
      percentages: dataset.data.map((value, index) => ((value / totalPerLabel[index]) * 100).toFixed(2)), // 각 값의 백분율 계산
    }));

    return percentageData;
  };

  const percentageData = calculatePercentage();

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true, // x축 스택 쌓기
      },
      y: {
        beginAtZero: true,
        stacked: true, // y축 스택 쌓기
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
          // 툴팁에 실제 값과 퍼센트 값을 함께 표시
          label: function (tooltipItem) {
            const dataset = percentageData[tooltipItem.datasetIndex];
            const value = rawData.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex]; // 실제 값
            const percentage = dataset.percentages[tooltipItem.dataIndex]; // 백분율 값
            return `${dataset.label}: ${value} ( ${percentage}% )`; // 실제 값과 퍼센트 모두 표시
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
