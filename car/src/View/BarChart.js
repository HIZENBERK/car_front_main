// BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = () => {
  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], // X축 레이블
    datasets: [
      {
        label: '업무용',
        data: [20, 30, 50, 20, 25, 10, 40, 20, 30, 30, 20, 30], // 데이터
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // 빨강
        borderColor: 'rgba(255, 99, 132, 1)', // 빨강 경계선
        borderWidth: 1,
      },
      {
        label: '출퇴근용',
        data: [10, 15, 10, 15, 5, 5, 10, 15, 10, 15, 10, 10],
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // 파랑
        borderColor: 'rgba(54, 162, 235, 1)', // 파랑 경계선
        borderWidth: 1,
      },
      {
        label: '비업무용',
        data: [10, 5, 10, 5, 20, 35, 10, 15, 10, 10, 10, 10],
        backgroundColor: 'rgba(255, 206, 86, 0.2)', // 초록
        borderColor: 'rgba(255, 206, 86, 1)', // 초록 경계선
        borderWidth: 1,
      },
    ],
  };

  const sortDataByValue = (data) => {
    const sortedDatasets = data.labels.map((_, index) => {
      const values = [
        { value: data.datasets[0].data[index], backgroundColor: data.datasets[0].backgroundColor, borderColor: data.datasets[0].borderColor, label: '업무용' },
        { value: data.datasets[1].data[index], backgroundColor: data.datasets[1].backgroundColor, borderColor: data.datasets[1].borderColor, label: '출퇴근용' },
        { value: data.datasets[2].data[index], backgroundColor: data.datasets[2].backgroundColor, borderColor: data.datasets[2].borderColor, label: '비업무용' },
      ];

      // 각 막대의 데이터를 값에 따라 오름차순으로 정렬
      return values.sort((a, b) => a.value - b.value);
    });

    return sortedDatasets;
  };

  const sortedData = sortDataByValue(data);

  const createStackedData = () => {
    const newDatasets = data.datasets.map((dataset, datasetIndex) => {
      return {
        ...dataset,
        data: sortedData.map((sorted) => sorted[datasetIndex].value), // 정렬된 데이터 순서대로 배치
        backgroundColor: sortedData.map((sorted) => sorted[datasetIndex].backgroundColor), // 고정된 배경색
        borderColor: sortedData.map((sorted) => sorted[datasetIndex].borderColor), // 고정된 경계선 색
      };
    });

    return {
      labels: data.labels,
      datasets: newDatasets,
    };
  };

  const stackedData = createStackedData();

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true, // x축 스택 쌓기
      },
      y: {
        beginAtZero: true,
        max: 100, // y축 최대값 100으로 설정 (퍼센트 기준)
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
    },
  };

  return (
    <div style={{ width: '400px', height: '400px', marginTop: '10px', marginRight: '5px' }}>
      <Bar data={stackedData} options={options} />
    </div>
  );
};

export default BarChart;
