"use client";

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
  TimeScale,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface CsvRow {
  game_date: string;
  launch_speed: string;
  launch_angle: string;
  events: string;
  at_bat_number: string;
}

interface StatcastData {
  game_date: string;
  launch_speed: number;
  launch_angle: number;
  events: string;
  at_bat_number: string;
}

export default function StatcastSpeedChart() {
  const [data, setData] = useState<StatcastData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/statcast?type=batted');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json() as CsvRow[];
        
        const parsedData = jsonData.map(row => ({
          game_date: row.game_date,
          launch_speed: isNaN(parseFloat(row.launch_speed)) ? 0 : parseFloat(row.launch_speed),
          launch_angle: isNaN(parseFloat(row.launch_angle)) ? 0 : parseFloat(row.launch_angle),
          events: row.events,
          at_bat_number: row.at_bat_number
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

  // 日付でソート
  const sortedData = [...data].sort((a, b) => 
    new Date(a.game_date).getTime() - new Date(b.game_date).getTime()
  );

  const lineData = {
    datasets: [{
      label: '打球速度',
      data: sortedData.map(d => ({
        x: new Date(d.game_date).getTime(),
        y: d.launch_speed
      })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: sortedData.map(d => 
        d.events === 'home_run' ? 'rgb(255, 215, 0)' : 'rgba(255, 99, 132, 0.5)'
      ),
      tension: 0.1,
      pointRadius: sortedData.map(d => 
        d.events === 'home_run' ? 6 : 3
      ),
      pointHoverRadius: sortedData.map(d => 
        d.events === 'home_run' ? 8 : 5
      ),
    }]
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
        text: '日付ごとの打球速度',
        color: 'white',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            const dataPoint = sortedData[context.dataIndex];
            return [
              `日付: ${dataPoint.game_date}`,
              `打席数: ${dataPoint.at_bat_number}`,
              `打球速度: ${dataPoint.launch_speed} mph`,
              `結果: ${dataPoint.events === 'home_run' ? 'ホームラン' : dataPoint.events}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'yyyy/MM/dd'
          }
        },
        title: {
          display: true,
          text: '日付',
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
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-gray-800 p-4 rounded-lg">
      <Line data={lineData} options={options} />
    </div>
  );
} 
