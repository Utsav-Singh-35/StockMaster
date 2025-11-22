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

  const getStatusColor = (status: string) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Waiting: 'bg-yellow-100 text-yellow-700',
      Validated: 'bg-green-100 text-green-700',
    };
    return colors[status as keyof typeof colors];
  };

  const filteredReceipts = receipts.filter(
    r => filterStatus === 'All' || r.status === filterStatus
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Receipts (Incoming Stock)</h1>
            <p className="text-slate-600 mt-1">Manage incoming goods from suppliers</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg transition-all"
          >
            <Plus size={20} />
            Create Receipt
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Receipts</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{receipts.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TruckIcon className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Validation</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {receipts.filter(r => r.status === 'Waiting').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Validated Today</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {receipts.filter(r => r.status === 'Validated').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search receipts..."
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-green-600"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Draft', 'Waiting', 'Validated'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-green-600 text-white'
                      : 'border border-slate-200 hover:bg-slate-50'
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
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-lg text-slate-600">Loading receipts...</div>
          </div>
        ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Receipt ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Supplier</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Warehouse</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{receipt.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{receipt.supplier}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {receipt.products.length} item(s)
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{receipt.warehouse}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{receipt.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedReceipt(receipt)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          View
                        </button>
                        {receipt.status === 'Waiting' && (
                          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
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
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Create New Receipt</h2>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <form className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Supplier Name</label>
                    <input
                      type="text"
                      placeholder="Enter supplier name"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Warehouse</label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-green-600">
                      <option>Main Warehouse</option>
                      <option>Warehouse 2</option>
                      <option>Production Floor</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Expected Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Products</label>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <select className="flex-1 px-4 py-3 border border-slate-200 rounded-xl">
                          <option>Select Product</option>
                          <option>Steel Rods</option>
                          <option>Bolts M8</option>
                          <option>Packaging Boxes</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Qty"
                          className="w-24 px-4 py-3 border border-slate-200 rounded-xl"
                        />
                        <button type="button" className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700">
                      Create Receipt
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
                    <button className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium">
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
