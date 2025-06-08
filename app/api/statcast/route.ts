import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

interface StatcastRow {
  events: string;
  [key: string]: string;
}

type DataType = 'all' | 'atbat' | 'batted';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as DataType | null;

    // dataディレクトリからCSVファイルを読み込む
    const filePath = path.join(process.cwd(), 'data', 'statcast.csv');
    
    // CSVファイルを読み込む
    const csvText = fs.readFileSync(filePath, 'utf-8');
    
    // CSVをパース
    const results = Papa.parse<StatcastRow>(csvText, {
      header: true,
      skipEmptyLines: true
    });

    // データタイプに応じてフィルタリング
    let filteredData = results.data;
    if (type === 'atbat') {
      // 打席結果のみを返す
      filteredData = results.data.filter(row => row.events && row.events.trim() !== '');
    } else if (type === 'batted') {
      // 打球データのみを返す（打球距離、打球速度、打球角度が全て存在するデータ）
      filteredData = results.data.filter(row => 
        row.hit_distance_sc && row.hit_distance_sc.trim() !== '' &&
        row.launch_speed && row.launch_speed.trim() !== '' &&
        row.launch_angle && row.launch_angle.trim() !== ''
      );
    }

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('CSVの読み込み中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: 'CSVファイルの読み込み中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 
