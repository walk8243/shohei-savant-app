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
  Legend,
  ScatterController,
  TooltipItem
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
);

interface StatcastData {
  game_date: string;
  launch_speed: number;
  launch_angle: number;
  events: string;
}

interface CsvRow {
  game_date: string;
  launch_speed: string;
  launch_angle: string;
  events: string;
}

export default function StatcastChart() {
  const [data, setData] = useState<StatcastData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/statcast?type=atbat');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json() as CsvRow[];
        
        const parsedData = jsonData.map(row => ({
          game_date: row.game_date,
          launch_speed: isNaN(parseFloat(row.launch_speed)) ? 0 : parseFloat(row.launch_speed),
          launch_angle: isNaN(parseFloat(row.launch_angle)) ? 0 : parseFloat(row.launch_angle),
          events: row.events
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
    datasets: [
      {
        label: '打球データ',
        data: data.map(d => ({
          x: d.launch_speed,
          y: d.launch_angle
        })),
        backgroundColor: data.map(d => d.events === 'home_run' ? 'rgb(255, 215, 0)' : 'rgba(75, 192, 192, 0.5)'),
        pointRadius: data.map(d => d.events === 'home_run' ? 6 : 3),
        pointHoverRadius: data.map(d => d.events === 'home_run' ? 8 : 5)
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
        text: '打球速度と角度の散布図',
        color: 'white',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'scatter'>) {
            const dataPoint = data[context.dataIndex];
            return [
              `打球速度: ${dataPoint.launch_speed} mph`,
              `打球角度: ${dataPoint.launch_angle}°`,
              `結果: ${dataPoint.events || '不明'}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: '打球速度 (mph)',
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: '打球角度 (度)',
          color: 'white'
        },
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
      <Scatter options={options} data={chartData} />
    </div>
  );
} 
