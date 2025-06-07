'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface CsvViewerProps {
  csvPath: string;
}

export default function CsvViewer({ csvPath }: CsvViewerProps) {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const response = await fetch(csvPath);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          complete: (results) => {
            const headers = results.data[0] as string[];
            const rows = results.data.slice(1) as string[][];
            setCsvData({ headers, rows });
          },
          header: false,
          error: (error: Error) => {
            setError(`CSVの解析中にエラーが発生しました: ${error.message}`);
          }
        });
      } catch {
        setError('CSVファイルの読み込み中にエラーが発生しました');
      }
    };

    fetchCsv();
  }, [csvPath]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!csvData) {
    return <div className="p-4">読み込み中...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {csvData.headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {csvData.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
