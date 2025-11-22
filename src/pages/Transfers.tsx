import { Plus, ArrowLeftRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { transfersAPI } from '../lib/api';

export default function Transfers() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    fromWarehouse: '',
    toWarehouse: '',
    notes: ''
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await transfersAPI.create(formData);
      if (response.success) {
        setShowCreateModal(false);
        setFormData({ product: '', quantity: '', fromWarehouse: '', toWarehouse: '', notes: '' });
        fetchTransfers();
      }
    } catch (error) {
      console.error('Failed to create transfer:', error);
    }
  };

  const warehouses = ['Main Warehouse', 'Production Floor', 'Warehouse A', 'Warehouse B', 'Storage Room'];
  const products = ['Steel Rods', 'Aluminum Sheets', 'Copper Wire', 'Plastic Components', 'Electronic Parts'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Internal Transfers</h1>
            <p className="text-gray-400 mt-1">Move stock between warehouses and locations</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Create Transfer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Transfers</p>
                <p className="text-3xl font-bold text-white mt-1">{transfers.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <ArrowLeftRight className="text-orange-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-lg text-gray-300">Loading transfers...</div>
          </div>
        ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Transfer ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">From</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">To</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-medium text-white">{transfer.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{transfer.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{transfer.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{transfer.from}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{transfer.to}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transfer.status === 'Done' ? 'bg-green-900/50 text-green-300' : 'bg-blue-900/50 text-blue-300'
                    }`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{transfer.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Create Transfer Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Create Transfer</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Product</label>
                    <select
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product} value={product}>{product}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      min="1"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">From Warehouse</label>
                    <select
                      value={formData.fromWarehouse}
                      onChange={(e) => setFormData({ ...formData, fromWarehouse: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                    >
                      <option value="">Select Source</option>
                      {warehouses.map(warehouse => (
                        <option key={warehouse} value={warehouse}>{warehouse}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">To Warehouse</label>
                    <select
                      value={formData.toWarehouse}
                      onChange={(e) => setFormData({ ...formData, toWarehouse: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                    >
                      <option value="">Select Destination</option>
                      {warehouses.filter(w => w !== formData.fromWarehouse).map(warehouse => (
                        <option key={warehouse} value={warehouse}>{warehouse}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white resize-none"
                      placeholder="Add any notes about this transfer..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Create Transfer
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
