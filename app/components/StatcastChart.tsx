'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatcastData {
  game_date: string;
  launch_speed: number;
  launch_angle: number;
}

export default function StatcastChart({ csvPath }: { csvPath: string }) {
  const [data, setData] = useState<StatcastData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(csvPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvText => {
        const rows = csvText.split('\n').filter(row => row.trim() !== '');

        const parsedData = rows.slice(1).map(row => {
          const values = row.split(',');
          const launch_speed = parseFloat(values[53]); // 54番目の列
          const launch_angle = parseFloat(values[54]); // 55番目の列
          
          return {
            game_date: values[0], // 日付は最初の列と仮定
            launch_speed: isNaN(launch_speed) ? 0 : launch_speed,
            launch_angle: isNaN(launch_angle) ? 0 : launch_angle
          };
        });

        setData(parsedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
      });
  }, [csvPath]);

  if (error) {
    return <div className="text-red-500">エラーが発生しました: {error}</div>;
  }

  if (data.length === 0) {
    return <div className="text-white">データを読み込み中...</div>;
  }

  const chartData = {
    labels: data.map(d => d.game_date),
    datasets: [
      {
        label: '打球速度 (mph)',
        data: data.map(d => d.launch_speed),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: true
      },
      {
        label: '打球角度 (度)',
        data: data.map(d => d.launch_angle),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: 'Statcastデータの推移',
        color: 'white',
        font: {
          size: 16
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-gray-800 p-4 rounded-lg">
      <Line options={options} data={chartData} />
    </div>
  );
} 
