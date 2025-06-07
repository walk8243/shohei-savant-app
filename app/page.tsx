import CsvViewer from './components/CsvViewer';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Statcastデータ</h1>
      <CsvViewer csvPath="/data/statcast.csv" />
    </main>
  );
}
