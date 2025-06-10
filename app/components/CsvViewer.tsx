'use client';

import { useEffect, useState } from 'react';

interface CsvRow {
  [key: string]: string;
}

const DISPLAY_COLUMNS = [
  'game_date',
  'at_bat_number',
  'pitch_number',
  'description',
  'events',
  'hit_distance_sc',
  'launch_speed',
  'launch_angle'
];

const COLUMN_NAMES: { [key: string]: string } = {
  game_date: '日付',
  at_bat_number: '打席番号',
  pitch_number: '投球数',
  description: '説明',
  events: 'イベント',
  hit_distance_sc: '飛距離 (ft)',
  launch_speed: '打球速度 (mph)',
  launch_angle: '打球角度 (度)'
};

export default function CsvViewer() {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const response = await fetch('/api/statcast?type=all');
        if (!response.ok) {
          throw new Error('CSVデータの取得に失敗しました');
        }
        const data = await response.json();
        
        if (data.length > 0) {
          setHeaders(DISPLAY_COLUMNS);
          setCsvData(data);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'CSVファイルの読み込み中にエラーが発生しました');
      }
    };

    fetchCsv();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (csvData.length === 0) {
    return <div className="p-4">読み込み中...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {COLUMN_NAMES[header]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {csvData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
