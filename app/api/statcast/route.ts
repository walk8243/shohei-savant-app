import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

interface StatcastRow {
  events: string;
  [key: string]: string;
}

type DataType = 'all' | 'atbat' | 'batted';

// グローバル変数としてパース済みのデータを保持
let parsedData: StatcastRow[] | null = null;

// データを読み込む関数
function loadData() {
  if (parsedData === null) {
    const filePath = path.join(process.cwd(), 'data', 'statcast.csv');
    const csvText = fs.readFileSync(filePath, 'utf-8');
    const results = Papa.parse<StatcastRow>(csvText, {
      header: true,
      skipEmptyLines: true
    });
    parsedData = results.data;
  }
  return parsedData;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as DataType | null;

    // パース済みのデータを取得
    const data = loadData();

    // データタイプに応じてフィルタリング
    let filteredData = data;
    if (type === 'atbat') {
      // 打席結果のみを返す
      filteredData = data.filter(row => row.events && row.events.trim() !== '');
    } else if (type === 'batted') {
      // 打球データのみを返す（打球距離、打球速度、打球角度が全て存在するデータ）
      filteredData = data.filter(row => 
        row.hit_distance_sc && row.hit_distance_sc.trim() !== '' &&
        row.launch_speed && row.launch_speed.trim() !== '' &&
        row.launch_angle && row.launch_angle.trim() !== ''
      );
    }

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('データの処理中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: 'データの処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 
