# Shohei Savant App

## アプリケーション概要

Shohei Savant Appは、大谷翔平選手の活躍を追跡・分析するためのWebアプリケーションです。

### 主な機能

- **成績トラッキング**: 打撃成績、投手成績のリアルタイム更新
- **統計分析**: 詳細な打撃・投手データの可視化
- **ニュースフィード**: 大谷選手に関する最新ニュースの集約
- **インタラクティブなデータ表示**: グラフやチャートによる直感的なデータ表示

### 目的

- 大谷選手の活躍を包括的に追跡
- ファンがデータに基づいて大谷選手のパフォーマンスを理解するためのツール提供
- 野球ファン同士の情報共有プラットフォームとしての機能

## 技術スタック

- **フレームワーク**: Next.js 14
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **フォント**: Geist (Vercel)
- **パッケージマネージャー**: npm

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone [repository-url]
cd shohei-savant-app
```

2. 依存関係のインストール
```bash
npm install
```

3. 開発サーバーの起動
```bash
npm run dev
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で起動します。

## プロジェクト構造

```
shohei-savant-app/
├── app/                    # Next.js アプリケーションのメインディレクトリ
│   ├── api/               # APIルート
│   ├── components/        # アプリケーションコンポーネント
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # メインページ
├── data/                  # データファイル
├── public/                # 静的ファイル
├── .next/                 # Next.jsのビルド出力
├── node_modules/          # 依存関係
├── package.json           # プロジェクト設定
├── tsconfig.json          # TypeScript設定
├── next.config.ts         # Next.js設定
├── postcss.config.mjs     # PostCSS設定
└── eslint.config.mjs      # ESLint設定
```

## 開発ガイドライン

1. **コードスタイル**
   - ESLintとPrettierを使用
   - TypeScriptの厳格な型チェックを有効化

## 環境変数

以下の環境変数を設定する必要があります：

```env
NEXT_PUBLIC_API_URL=your_api_url
```

## トラブルシューティング

一般的な問題と解決方法：

1. **依存関係のエラー**
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **ビルドエラー**
   ```bash
   npm run build
   ```
   で詳細なエラー情報を確認

## ライセンス

MIT License
