import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // dataディレクトリからCSVファイルを読み込む
    const filePath = path.join(process.cwd(), 'data', 'statcast.csv');
    
    // CSVファイルを読み込む
    const csvText = fs.readFileSync(filePath, 'utf-8');
    
    // CSVをパース
    const results = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    return NextResponse.json(results.data);
  } catch (error) {
    console.error('CSVの読み込み中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: 'CSVファイルの読み込み中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 
