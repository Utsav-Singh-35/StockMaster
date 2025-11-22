import { Plus, Warehouse, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { warehousesAPI } from '../lib/api';

export default function Settings() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await warehousesAPI.getAll();
      if (response.success && response.data) {
        setWarehouses(response.data as any[]);
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-1">Manage warehouses and system configuration</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg">
            <Plus size={20} />
            Add Warehouse
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Warehouse Management</h2>
          {loading ? (
            <div className="text-center py-8 text-slate-600">Loading warehouses...</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warehouses.map((wh) => (
              <div key={wh.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Warehouse className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{wh.name}</h3>
                    <p className="text-xs text-slate-600">{wh.id}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} />
                    <span>{wh.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Capacity:</span>
                    <span className="font-medium">{wh.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {wh.status}
                    </span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium">
                  Edit Warehouse
                </button>
              </div>
            ))}
          </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-4">System Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Low Stock Alerts</p>
                <p className="text-sm text-slate-600">Get notified when products reach reorder level</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Auto-validate Receipts</p>
                <p className="text-sm text-slate-600">Automatically validate receipts on creation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
