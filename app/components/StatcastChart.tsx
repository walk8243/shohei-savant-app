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

interface CsvRow {
  game_date: string;
  launch_speed: string;
  launch_angle: string;
}

export default function StatcastChart() {
  const [data, setData] = useState<StatcastData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json() as CsvRow[];
        
        const parsedData = jsonData.map(row => ({
          game_date: row.game_date,
          launch_speed: isNaN(parseFloat(row.launch_speed)) ? 0 : parseFloat(row.launch_speed),
          launch_angle: isNaN(parseFloat(row.launch_angle)) ? 0 : parseFloat(row.launch_angle)
        }));

        setData(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'データの取得中にエラーが発生しました');
      }
    };

    fetchData();
  }, []);

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
