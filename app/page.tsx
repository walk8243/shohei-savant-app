import CsvViewer from './components/CsvViewer';
import StatcastChart from './components/StatcastChart';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Statcastデータ</h1>
      <div className="mb-8">
        <StatcastChart csvPath="/data/statcast.csv" />
      </div>
      <CsvViewer csvPath="/data/statcast.csv" />
    </main>
  );
}
