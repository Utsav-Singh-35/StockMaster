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
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [createFormData, setCreateFormData] = useState({
    customerName: '',
    warehouseId: '',
    deliveryDate: '',
    lines: [] as { productId: string; quantity: string; unit: string }[]
  });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

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

  const handleCreateDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    try {
      const response = await deliveriesAPI.create({
        customerName: createFormData.customerName,
        warehouseId: createFormData.warehouseId,
        deliveryDate: createFormData.deliveryDate,
        lines: createFormData.lines.map(line => ({
          productId: line.productId,
          quantity: parseFloat(line.quantity),
          unit: line.unit
        }))
      });

      if (response.success) {
        setShowCreateModal(false);
        setCreateFormData({
          customerName: '',
          warehouseId: '',
          deliveryDate: '',
          lines: []
        });
        fetchDeliveries();
      } else {
        setCreateError(response.error?.message || 'Failed to create delivery');
      }
    } catch (error: any) {
      setCreateError(error.message || 'An error occurred');
    } finally {
      setCreateLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Draft: 'bg-gray-800 text-gray-300',
      Picking: 'bg-blue-900/30 text-blue-400',
      Packing: 'bg-yellow-900/30 text-yellow-400',
      Ready: 'bg-purple-900/30 text-purple-400',
      Shipped: 'bg-green-900/30 text-green-400',
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
            <h1 className="text-3xl font-bold text-white">Delivery Orders (Outgoing Stock)</h1>
            <p className="text-gray-400 mt-1">Manage outgoing shipments to customers</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] shadow-lg transition-all"
          >
            <Plus size={20} />
            Create Delivery
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Deliveries</p>
                <p className="text-3xl font-bold text-white mt-1">{deliveries.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Send className="text-purple-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">
                  {deliveries.filter(d => d.status === 'Picking' || d.status === 'Packing').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Package className="text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ready to Ship</p>
                <p className="text-3xl font-bold text-[#FF8C00] mt-1">
                  {deliveries.filter(d => d.status === 'Ready').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-[#FF8C00]" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Shipped</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  {deliveries.filter(d => d.status === 'Shipped').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center">
                <Send className="text-green-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search deliveries..."
                className="w-full pl-12 pr-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Draft', 'Picking', 'Packing', 'Ready', 'Shipped'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-[#FF8C00] text-white'
                      : 'border border-gray-800 hover:bg-[#1F1F1F]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#252525] border border-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-lg text-gray-400">Loading deliveries...</div>
          </div>
        ) : (
        <div className="bg-[#252525] border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1F1F1F]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Delivery ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Warehouse</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-[#1F1F1F] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{delivery.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{delivery.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{delivery.products.length} item(s)</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{delivery.warehouse}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{delivery.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedDelivery(delivery)}
                        className="text-[#FF8C00] hover:text-[#FF9500] text-sm font-medium"
                      >
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
                className="bg-[#252525] border border-gray-800 rounded-2xl p-8 max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create Delivery Order</h2>
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

                <form onSubmit={handleCreateDelivery} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Customer Name</label>
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={createFormData.customerName}
                      onChange={(e) => setCreateFormData({ ...createFormData, customerName: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:border-[#FF8C00] focus:outline-none text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Warehouse</label>
                    <input
                      type="text"
                      placeholder="Warehouse ID"
                      value={createFormData.warehouseId}
                      onChange={(e) => setCreateFormData({ ...createFormData, warehouseId: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:border-[#FF8C00] focus:outline-none text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Delivery Date</label>
                    <input
                      type="date"
                      value={createFormData.deliveryDate}
                      onChange={(e) => setCreateFormData({ ...createFormData, deliveryDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:border-[#FF8C00] focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Products</label>
                    <div className="space-y-3">
                      {createFormData.lines.map((line, index) => (
                        <div key={index} className="flex gap-3 items-center bg-[#1F1F1F] p-3 rounded-xl">
                          <select 
                            value={line.productId}
                            onChange={(e) => {
                              const newLines = [...createFormData.lines];
                              newLines[index].productId = e.target.value;
                              setCreateFormData({ ...createFormData, lines: newLines });
                            }}
                            className="flex-1 px-4 py-2 bg-[#252525] border border-gray-800 rounded-lg text-white"
                          >
                            <option value="">Select Product</option>
                            <option value="1">Steel Rods</option>
                            <option value="2">Bolts M8</option>
                            <option value="3">Packaging Boxes</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Qty"
                            value={line.quantity}
                            onChange={(e) => {
                              const newLines = [...createFormData.lines];
                              newLines[index].quantity = e.target.value;
                              setCreateFormData({ ...createFormData, lines: newLines });
                            }}
                            className="w-24 px-4 py-2 bg-[#252525] border border-gray-800 rounded-lg text-white placeholder-gray-500"
                          />
                          <input
                            type="text"
                            placeholder="Unit"
                            value={line.unit}
                            onChange={(e) => {
                              const newLines = [...createFormData.lines];
                              newLines[index].unit = e.target.value;
                              setCreateFormData({ ...createFormData, lines: newLines });
                            }}
                            className="w-24 px-4 py-2 bg-[#252525] border border-gray-800 rounded-lg text-white placeholder-gray-500"
                          />
                          <button 
                            type="button" 
                            onClick={() => {
                              const newLines = createFormData.lines.filter((_, i) => i !== index);
                              setCreateFormData({ ...createFormData, lines: newLines });
                            }}
                            className="p-2 text-red-400 hover:text-red-300"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => {
                          setCreateFormData({
                            ...createFormData,
                            lines: [...createFormData.lines, { productId: '', quantity: '', unit: '' }]
                          });
                        }}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-700 rounded-xl hover:border-[#FF8C00] hover:bg-[#FF8C00]/10 transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-[#FF8C00]"
                      >
                        <Plus size={20} />
                        Add Product
                      </button>
                    </div>
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
                      {createLoading ? 'Creating...' : 'Create Delivery'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delivery Detail Panel */}
        <AnimatePresence>
          {selectedDelivery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
              onClick={() => setSelectedDelivery(null)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="bg-[#252525] border-l border-gray-800 h-full w-full md:w-[500px] overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Delivery Details</h2>
                  <button 
                    onClick={() => setSelectedDelivery(null)} 
                    className="p-2 hover:bg-[#2A2A2A] rounded-lg text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#1F1F1F] border border-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Delivery ID</p>
                    <p className="font-bold text-lg text-white">{selectedDelivery.id}</p>
                  </div>

                  <div className="bg-[#1F1F1F] border border-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Customer</p>
                    <p className="font-medium text-white">{selectedDelivery.customer}</p>
                  </div>

                  <div className="bg-[#1F1F1F] border border-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-3">Products</p>
                    {selectedDelivery.products.map((prod, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b border-gray-800 last:border-0">
                        <span className="text-gray-300">{prod.name}</span>
                        <span className="font-bold text-white">
                          {prod.quantity} {prod.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#1F1F1F] border border-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Warehouse</p>
                    <p className="font-medium text-white">{selectedDelivery.warehouse}</p>
                  </div>

                  <div className="bg-[#1F1F1F] border border-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="font-medium text-white">{selectedDelivery.date}</p>
                  </div>

                  <div className="bg-[#1F1F1F] border border-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedDelivery.status)}`}>
                      {selectedDelivery.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
