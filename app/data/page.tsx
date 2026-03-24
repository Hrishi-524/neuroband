"use client";

import { useEffect, useState } from "react";

export default function DataPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:3000/api/data");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl mb-4">📡 Live Neuro Data</h1>

      {!data ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Latest */}
          <div className="mb-6 p-4 border border-gray-700 rounded">
            <h2 className="text-lg mb-2">Latest</h2>
            <pre className="text-green-400">
              {JSON.stringify(data.latest, null, 2)}
            </pre>
          </div>

          {/* History */}
          <div className="p-4 border border-gray-700 rounded">
            <h2 className="text-lg mb-2">History</h2>
            <div className="max-h-[400px] overflow-y-auto">
              {data.history.map((item: any, i: number) => (
                <pre key={i} className="text-blue-400 text-sm mb-2">
                  {JSON.stringify(item, null, 2)}
                </pre>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}