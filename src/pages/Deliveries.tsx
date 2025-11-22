import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Send, X, Package, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { deliveriesAPI } from '../lib/api';

interface Delivery {
  id: string;
  customer: string;
  products: { name: string; quantity: number; unit: string }[];
  status: 'Draft' | 'Picking' | 'Packing' | 'Ready' | 'Shipped';
  date: string;
  warehouse: string;
}

export default function Deliveries() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, [filterStatus]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await deliveriesAPI.getAll(filterStatus !== 'All' ? filterStatus : undefined);
      if (response.success && response.data) {
        setDeliveries(response.data as Delivery[]);
      }
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Picking: 'bg-blue-100 text-blue-700',
      Packing: 'bg-yellow-100 text-yellow-700',
      Ready: 'bg-purple-100 text-purple-700',
      Shipped: 'bg-green-100 text-green-700',
    };
    return colors[status as keyof typeof colors];
  };

  const filteredDeliveries = deliveries.filter(
    d => filterStatus === 'All' || d.status === filterStatus
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Delivery Orders (Outgoing Stock)</h1>
            <p className="text-slate-600 mt-1">Manage outgoing shipments to customers</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg transition-all"
          >
            <Plus size={20} />
            Create Delivery
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Deliveries</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{deliveries.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Send className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {deliveries.filter(d => d.status === 'Picking' || d.status === 'Packing').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Ready to Ship</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {deliveries.filter(d => d.status === 'Ready').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Shipped</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {deliveries.filter(d => d.status === 'Shipped').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Send className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search deliveries..."
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Draft', 'Picking', 'Packing', 'Ready', 'Shipped'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-purple-600 text-white'
                      : 'border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-lg text-slate-600">Loading deliveries...</div>
          </div>
        ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Delivery ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Warehouse</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{delivery.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{delivery.customer}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{delivery.products.length} item(s)</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{delivery.warehouse}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{delivery.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Create Delivery Order</h2>
                  <button onClick={() => setShowCreateModal(false)}>
                    <X size={24} />
                  </button>
                </div>

                <form className="space-y-6">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    className="w-full px-4 py-3 border rounded-xl focus:border-purple-600 focus:outline-none"
                  />
                  <select className="w-full px-4 py-3 border rounded-xl">
                    <option>Main Warehouse</option>
                    <option>Warehouse 2</option>
                  </select>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-6 py-3 border rounded-xl">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl">
                      Create
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
