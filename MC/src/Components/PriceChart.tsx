import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PriceChartProps {
  itemName: string;
  priceHistory: number[];
  timeRange: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ itemName, priceHistory, timeRange }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let labels = [];
    let dataPoints = [];

    const now = new Date().getTime();
    const historyLength = priceHistory.length;

    if (timeRange === 'seconds') {
      labels = Array.from({ length: historyLength }, (_, i) => `${i * 5}s ago`);
      dataPoints = priceHistory.slice(-historyLength);
    } else if (timeRange === 'minutes') {
      labels = Array.from({ length: historyLength }, (_, i) => `${i}m ago`);
      dataPoints = priceHistory.slice(-historyLength);
    } else if (timeRange === 'hours') {
      labels = Array.from({ length: Math.ceil(historyLength / 12) }, (_, i) => `${i * 5}m ago`);
      dataPoints = priceHistory.filter((_, i) => i % 12 === 0);
    } else if (timeRange === 'days') {
      labels = Array.from({ length: Math.ceil(historyLength / 288) }, (_, i) => `${i * 5}h ago`);
      dataPoints = priceHistory.filter((_, i) => i % 288 === 0);
    }

    setData({
      labels,
      datasets: [
        {
          label: `${itemName} Price`,
          data: dataPoints,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.1,
        },
      ],
    });
  }, [priceHistory, timeRange, itemName]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${itemName} Price Fluctuation`,
      },
    },
  };

  if (!data) return <div>Loading...</div>;

  return <Line data={data} options={options} />;
};

export default PriceChart;
