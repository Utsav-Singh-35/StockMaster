import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, TruckIcon, X, Package, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { receiptsAPI } from '../lib/api';

interface Receipt {
  id: string;
  supplier: string;
  products: { name: string; quantity: number; unit: string }[];
  status: 'Draft' | 'Waiting' | 'Validated';
  date: string;
  warehouse: string;
}

export default function Receipts() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [createFormData, setCreateFormData] = useState({
    supplierName: '',
    warehouseId: '',
    expectedDate: '',
    lines: [] as { productId: string; quantity: string; unit: string }[]
  });
  const [newLineItem, setNewLineItem] = useState({
    productId: '',
    quantity: '',
    unit: 'pcs'
  });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, [filterStatus]);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const response = await receiptsAPI.getAll(filterStatus !== 'All' ? filterStatus : undefined);
      if (response.success && response.data) {
        setReceipts(response.data as Receipt[]);
      }
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    try {
      const response = await receiptsAPI.create({
        supplierName: createFormData.supplierName,
        warehouseId: createFormData.warehouseId,
        expectedDate: createFormData.expectedDate,
        lines: createFormData.lines.map(line => ({
          productId: line.productId,
          quantity: parseFloat(line.quantity),
          unit: line.unit
        }))
      });

      if (response.success) {
        setShowCreateModal(false);
        setCreateFormData({
          supplierName: '',
          warehouseId: '',
          expectedDate: '',
          lines: []
        });
        fetchReceipts();
      } else {
        setCreateError(response.error?.message || 'Failed to create receipt');
      }
    } catch (error: any) {
      setCreateError(error.message || 'An error occurred');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleValidateReceipt = async (receiptId: string) => {
    try {
      const response = await receiptsAPI.validate(receiptId);
      if (response.success) {
        fetchReceipts();
      }
    } catch (error) {
      console.error('Failed to validate receipt:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Draft: 'bg-gray-800 text-gray-300',
      Waiting: 'bg-yellow-900/50 text-yellow-300',
      Validated: 'bg-green-900/50 text-green-300',
    };
    return colors[status as keyof typeof colors];
  };

  const addLineItem = () => {
    if (newLineItem.productId && newLineItem.quantity) {
      setCreateFormData({
        ...createFormData,
        lines: [...createFormData.lines, { ...newLineItem }]
      });
      setNewLineItem({ productId: '', quantity: '', unit: 'pcs' });
    }
  };

  const removeLineItem = (index: number) => {
    setCreateFormData({
      ...createFormData,
      lines: createFormData.lines.filter((_, i) => i !== index)
    });
  };

  const products = ['Steel Rods', 'Aluminum Sheets', 'Copper Wire', 'Plastic Components', 'Electronic Parts'];
  const warehouses = ['Main Warehouse', 'Warehouse A', 'Warehouse B', 'Storage Room'];

  const filteredReceipts = receipts.filter(
    r => filterStatus === 'All' || r.status === filterStatus
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Receipts (Incoming Stock)</h1>
            <p className="text-gray-400 mt-1">Manage incoming goods from suppliers</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all"
          >
            <Plus size={20} />
            Create Receipt
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Receipts</p>
                <p className="text-3xl font-bold text-white mt-1">{receipts.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <TruckIcon className="text-green-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Validation</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">
                  {receipts.filter(r => r.status === 'Waiting').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="text-yellow-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Validated Today</p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {receipts.filter(r => r.status === 'Validated').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Package className="text-green-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search receipts..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Draft', 'Waiting', 'Validated'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Receipts Table */}
        {loading ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-lg text-gray-300">Loading receipts...</div>
          </div>
        ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Receipt ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Supplier</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Warehouse</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{receipt.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{receipt.supplier}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {receipt.products.length} item(s)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{receipt.warehouse}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{receipt.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedReceipt(receipt)}
                          className="text-green-500 hover:text-green-400 text-sm font-medium"
                        >
                          View
                        </button>
                        {receipt.status === 'Waiting' && (
                          <button 
                            onClick={() => handleValidateReceipt(receipt.id)}
                            className="text-orange-500 hover:text-orange-400 text-sm font-medium"
                          >
                            Validate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Create Receipt Modal */}
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
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create New Receipt</h2>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                {createError && (
                  <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6">
                    {createError}
                  </div>
                )}

                <form onSubmit={handleCreateReceipt} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Supplier Name</label>
                    <input
                      type="text"
                      placeholder="Enter supplier name"
                      value={createFormData.supplierName}
                      onChange={(e) => setCreateFormData({ ...createFormData, supplierName: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Warehouse</label>
                    <select
                      value={createFormData.warehouseId}
                      onChange={(e) => setCreateFormData({ ...createFormData, warehouseId: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-green-500 text-white"
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map(warehouse => (
                        <option key={warehouse} value={warehouse}>{warehouse}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Expected Date</label>
                    <input
                      type="date"
                      value={createFormData.expectedDate}
                      onChange={(e) => setCreateFormData({ ...createFormData, expectedDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-green-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Products</label>
                    
                    {/* Add Product Form */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <select
                          value={newLineItem.productId}
                          onChange={(e) => setNewLineItem({ ...newLineItem, productId: e.target.value })}
                          className="md:col-span-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-white text-sm"
                        >
                          <option value="">Select Product</option>
                          {products.map(product => (
                            <option key={product} value={product}>{product}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={newLineItem.quantity}
                          onChange={(e) => setNewLineItem({ ...newLineItem, quantity: e.target.value })}
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-white text-sm placeholder-gray-400"
                        />
                        <button 
                          type="button" 
                          onClick={addLineItem}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          Add Product
                        </button>
                      </div>
                    </div>

                    {/* Product List */}
                    {createFormData.lines.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Added Products:</h4>
                        {createFormData.lines.map((line, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-3">
                            <div className="flex-1">
                              <span className="text-white font-medium">{line.productId}</span>
                              <span className="text-gray-400 ml-2">× {line.quantity} {line.unit}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLineItem(index)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
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
                      disabled={createLoading || createFormData.lines.length === 0}
                      className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {createLoading ? 'Creating...' : 'Create Receipt'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Receipt Detail */}
        <AnimatePresence>
          {selectedReceipt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
              onClick={() => setSelectedReceipt(null)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="bg-white h-full w-full md:w-[500px] overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Receipt Details</h2>
                  <button onClick={() => setSelectedReceipt(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600">Receipt ID</p>
                    <p className="font-bold text-lg">{selectedReceipt.id}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600">Supplier</p>
                    <p className="font-medium">{selectedReceipt.supplier}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600 mb-3">Products</p>
                    {selectedReceipt.products.map((prod, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                        <span>{prod.name}</span>
                        <span className="font-bold">
                          {prod.quantity} {prod.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600">Warehouse</p>
                    <p className="font-medium">{selectedReceipt.warehouse}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedReceipt.status)}`}>
                      {selectedReceipt.status}
                    </span>
                  </div>

                  {selectedReceipt.status === 'Waiting' && (
                    <button 
                      onClick={async () => {
                        await handleValidateReceipt(selectedReceipt.id);
                        setSelectedReceipt(null);
                      }}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium"
                    >
                      Validate Receipt (Stock +)
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
