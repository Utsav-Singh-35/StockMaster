import { Plus, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { adjustmentsAPI } from '../lib/api';

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    setLoading(true);
    try {
      const response = await adjustmentsAPI.getAll();
      if (response.success && response.data) {
        setAdjustments(response.data as any[]);
      }
    } catch (error) {
      console.error('Failed to fetch adjustments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Stock Adjustments</h1>
            <p className="text-slate-600 mt-1">Fix discrepancies between recorded and physical stock</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg">
            <Plus size={20} />
            Create Adjustment
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-xl">
            <AlertCircle size={24} />
            <p className="text-sm">Stock adjustments directly affect inventory levels. Always verify physical counts before adjusting.</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-lg text-slate-600">Loading adjustments...</div>
          </div>
        ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Adjustment ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Recorded</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Counted</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Difference</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Reason</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {adjustments.map((adj) => (
                <tr key={adj.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium">{adj.id}</td>
                  <td className="px-6 py-4 text-sm">{adj.product}</td>
                  <td className="px-6 py-4 text-sm">{adj.recorded}</td>
                  <td className="px-6 py-4 text-sm font-bold">{adj.counted}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${adj.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {adj.difference > 0 ? '+' : ''}{adj.difference}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{adj.reason}</td>
                  <td className="px-6 py-4 text-sm">{adj.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </DashboardLayout>
  );
}
