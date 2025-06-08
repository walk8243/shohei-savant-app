import CsvViewer from './components/CsvViewer';
import StatcastChart from './components/StatcastChart';
import StatcastSpeedChart from './components/StatcastSpeedChart';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Statcast Data Visualization</h1>
        <div className="space-y-8">
          <StatcastChart />
          <StatcastSpeedChart />
        </div>
      </div>
      <CsvViewer />
    </main>
  );
}
