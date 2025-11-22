import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeftRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { transfersAPI } from '../lib/api';

export default function Transfers() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    productId: '',
    quantity: '',
    fromWarehouse: '',
    toWarehouse: '',
    reason: ''
  });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

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

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    try {
      const response = await transfersAPI.create({
        productId: createFormData.productId,
        quantity: parseFloat(createFormData.quantity),
        fromWarehouse: createFormData.fromWarehouse,
        toWarehouse: createFormData.toWarehouse,
        reason: createFormData.reason || undefined
      });

      if (response.success) {
        setShowCreateModal(false);
        setCreateFormData({
          productId: '',
          quantity: '',
          fromWarehouse: '',
          toWarehouse: '',
          reason: ''
        });
        fetchTransfers();
      } else {
        setCreateError(response.error?.message || 'Failed to create transfer');
      }
    } catch (error: any) {
      setCreateError(error.message || 'An error occurred');
    } finally {
      setCreateLoading(false);
    }
  };

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
            className="flex items-center gap-2 px-6 py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] shadow-lg"
          >
            <Plus size={20} />
            Create Transfer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Transfers</p>
                <p className="text-3xl font-bold text-white mt-1">{transfers.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-900/30 rounded-xl flex items-center justify-center">
                <ArrowLeftRight className="text-orange-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#252525] border border-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-lg text-gray-400">Loading transfers...</div>
          </div>
        ) : (
        <div className="bg-[#252525] border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1F1F1F]">
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
                <tr key={transfer.id} className="hover:bg-[#1F1F1F]">
                  <td className="px-6 py-4 text-sm font-medium text-white">{transfer.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{transfer.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{transfer.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{transfer.from}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{transfer.to}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transfer.status === 'Done' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'
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
                exit={{ scale: 0.9 }}
                className="bg-[#252525] border border-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create Transfer</h2>
                  <button 
                    onClick={() => setShowCreateModal(false)} 
                    className="p-2 hover:bg-[#2A2A2A] rounded-lg text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                {createError && (
                  <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-xl mb-4">
                    {createError}
                  </div>
                )}

                <form onSubmit={handleCreateTransfer} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Product</label>
                    <select
                      value={createFormData.productId}
                      onChange={(e) => setCreateFormData({ ...createFormData, productId: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white"
                    >
                      <option value="">Select Product</option>
                      <option value="1">Steel Rods</option>
                      <option value="2">Bolts M8</option>
                      <option value="3">Packaging Boxes</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Quantity</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={createFormData.quantity}
                      onChange={(e) => setCreateFormData({ ...createFormData, quantity: e.target.value })}
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">From Warehouse</label>
                      <select
                        value={createFormData.fromWarehouse}
                        onChange={(e) => setCreateFormData({ ...createFormData, fromWarehouse: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white"
                      >
                        <option value="">Select Warehouse</option>
                        <option value="1">Main Warehouse</option>
                        <option value="2">Warehouse 2</option>
                        <option value="3">Warehouse 3</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">To Warehouse</label>
                      <select
                        value={createFormData.toWarehouse}
                        onChange={(e) => setCreateFormData({ ...createFormData, toWarehouse: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white"
                      >
                        <option value="">Select Warehouse</option>
                        <option value="1">Main Warehouse</option>
                        <option value="2">Warehouse 2</option>
                        <option value="3">Warehouse 3</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Reason (Optional)</label>
                    <textarea
                      placeholder="Enter transfer reason..."
                      value={createFormData.reason}
                      onChange={(e) => setCreateFormData({ ...createFormData, reason: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      disabled={createLoading}
                      className="flex-1 px-6 py-3 border border-gray-800 rounded-xl hover:bg-[#2A2A2A] disabled:opacity-50 text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createLoading}
                      className="flex-1 px-6 py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createLoading ? 'Creating...' : 'Create Transfer'}
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
