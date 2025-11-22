import { Plus, ArrowLeftRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { transfersAPI } from '../lib/api';

export default function Transfers() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const response = await transfersAPI.getAll();
      if (response.success && response.data) {
        setTransfers(response.data as any[]);
      }
    } catch (error) {
      console.error('Failed to fetch transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Internal Transfers</h1>
            <p className="text-slate-600 mt-1">Move stock between warehouses and locations</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 shadow-lg">
            <Plus size={20} />
            Create Transfer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Transfers</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{transfers.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ArrowLeftRight className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-lg text-slate-600">Loading transfers...</div>
          </div>
        ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Transfer ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">From</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">To</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium">{transfer.id}</td>
                  <td className="px-6 py-4 text-sm">{transfer.product}</td>
                  <td className="px-6 py-4 text-sm">{transfer.quantity}</td>
                  <td className="px-6 py-4 text-sm">{transfer.from}</td>
                  <td className="px-6 py-4 text-sm">{transfer.to}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transfer.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{transfer.date}</td>
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
