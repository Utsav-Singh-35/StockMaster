import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Send, X, Package, CheckCircle, MapPin, Calendar, User, Truck } from 'lucide-react';
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
  const [createFormData, setCreateFormData] = useState({
    customerName: '',
    warehouseId: '',
    deliveryDate: '',
    lines: [] as { productId: string; quantity: string; unit: string }[]
  });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

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
      Picking: 'bg-blue-900/50 text-blue-300',
      Packing: 'bg-yellow-900/50 text-yellow-300',
      Ready: 'bg-purple-900/50 text-purple-300',
      Shipped: 'bg-green-900/50 text-green-300',
    };
    return colors[status as keyof typeof colors];
  };

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    try {
      const response = await deliveriesAPI.updateStatus(deliveryId, newStatus);
      if (response.success) {
        fetchDeliveries();
        if (selectedDelivery && selectedDelivery.id === deliveryId) {
          setSelectedDelivery({ ...selectedDelivery, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    }
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
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all"
          >
            <Plus size={20} />
            Create Delivery
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Deliveries</p>
                <p className="text-3xl font-bold text-white mt-1">{deliveries.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Send className="text-purple-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-3xl font-bold text-blue-500 mt-1">
                  {deliveries.filter(d => d.status === 'Picking' || d.status === 'Packing').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Package className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ready to Ship</p>
                <p className="text-3xl font-bold text-purple-500 mt-1">
                  {deliveries.filter(d => d.status === 'Ready').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-purple-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Shipped</p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {deliveries.filter(d => d.status === 'Shipped').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Send className="text-green-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search deliveries..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Draft', 'Picking', 'Packing', 'Ready', 'Shipped'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-lg text-gray-300">Loading deliveries...</div>
          </div>
        ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
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
                  <tr key={delivery.id} className="hover:bg-gray-800/50 transition-colors">
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
                        className="text-purple-500 hover:text-purple-400 text-sm font-medium"
                      >
                        View Details
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
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create Delivery Order</h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                {createError && (
                  <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-4">
                    {createError}
                  </div>
                )}

                <form onSubmit={handleCreateDelivery} className="space-y-6">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={createFormData.customerName}
                    onChange={(e) => setCreateFormData({ ...createFormData, customerName: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white placeholder-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Warehouse ID"
                    value={createFormData.warehouseId}
                    onChange={(e) => setCreateFormData({ ...createFormData, warehouseId: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white placeholder-gray-400"
                  />
                  <input
                    type="date"
                    value={createFormData.deliveryDate}
                    onChange={(e) => setCreateFormData({ ...createFormData, deliveryDate: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white"
                  />
                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateModal(false)} 
                      disabled={createLoading}
                      className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={createLoading}
                      className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {createLoading ? 'Creating...' : 'Create'}
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
                className="bg-gray-900 border-l border-gray-800 h-full w-full md:w-[600px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Delivery Details</h2>
                    <button 
                      onClick={() => setSelectedDelivery(null)} 
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X size={24} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Header Info */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{selectedDelivery.id}</h3>
                          <p className="text-gray-400">Delivery Order</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDelivery.status)}`}>
                          {selectedDelivery.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <User className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-400">Customer</p>
                            <p className="text-white font-medium">{selectedDelivery.customer}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-400">Delivery Date</p>
                            <p className="text-white font-medium">{selectedDelivery.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-400">Warehouse</p>
                            <p className="text-white font-medium">{selectedDelivery.warehouse}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Package className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-400">Items</p>
                            <p className="text-white font-medium">{selectedDelivery.products.length} products</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Products List */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Products to Deliver</h4>
                      <div className="space-y-3">
                        {selectedDelivery.products.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Package className="text-purple-500" size={20} />
                              </div>
                              <div>
                                <p className="text-white font-medium">{product.name}</p>
                                <p className="text-sm text-gray-400">SKU: {product.name.replace(/\s+/g, '-').toLowerCase()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-bold">{product.quantity}</p>
                              <p className="text-sm text-gray-400">{product.unit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Delivery Process</h4>
                      <div className="space-y-3">
                        {['Draft', 'Picking', 'Packing', 'Ready', 'Shipped'].map((status, index) => {
                          const isCompleted = ['Draft', 'Picking', 'Packing', 'Ready', 'Shipped'].indexOf(selectedDelivery.status) >= index;
                          const isCurrent = selectedDelivery.status === status;
                          
                          return (
                            <div key={status} className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCompleted ? 'bg-purple-500' : 'bg-gray-700'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="text-white" size={16} />
                                ) : (
                                  <span className="text-gray-400 text-sm">{index + 1}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium ${isCurrent ? 'text-purple-400' : isCompleted ? 'text-white' : 'text-gray-400'}`}>
                                  {status}
                                </p>
                              </div>
                              {isCurrent && selectedDelivery.status !== 'Shipped' && (
                                <button
                                  onClick={() => {
                                    const nextStatus = ['Draft', 'Picking', 'Packing', 'Ready', 'Shipped'][index + 1];
                                    if (nextStatus) {
                                      updateDeliveryStatus(selectedDelivery.id, nextStatus);
                                    }
                                  }}
                                  className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
                                >
                                  Complete
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {selectedDelivery.status === 'Shipped' && (
                      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Tracking Information</h4>
                        <div className="flex items-center gap-3 p-3 bg-green-900/30 border border-green-700 rounded-lg">
                          <Truck className="text-green-400" size={20} />
                          <div>
                            <p className="text-green-300 font-medium">Package Shipped</p>
                            <p className="text-sm text-gray-400">Tracking: TRK-{selectedDelivery.id}</p>
                          </div>
                        </div>
                      </div>
                    )}
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
