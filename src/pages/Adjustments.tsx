import { Plus, AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { adjustmentsAPI, productsAPI, warehousesAPI } from '../lib/api';

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [createFormData, setCreateFormData] = useState({
    productId: '',
    warehouseId: '',
    countedQuantity: '',
    reason: '',
    adjustmentDate: new Date().toISOString().split('T')[0]
  });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchAdjustments();
    fetchProducts();
    fetchWarehouses();
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

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      if (response.success && response.data) {
        setProducts(response.data as any[]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await warehousesAPI.getAll();
      if (response.success && response.data) {
        setWarehouses(response.data as any[]);
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  const handleCreateAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    try {
      const response = await adjustmentsAPI.create({
        productId: createFormData.productId,
        warehouseId: createFormData.warehouseId,
        countedQuantity: parseFloat(createFormData.countedQuantity),
        reason: createFormData.reason,
        adjustmentDate: createFormData.adjustmentDate
      });

      if (response.success) {
        setShowCreateModal(false);
        setCreateFormData({
          productId: '',
          warehouseId: '',
          countedQuantity: '',
          reason: '',
          adjustmentDate: new Date().toISOString().split('T')[0]
        });
        fetchAdjustments();
      } else {
        setCreateError(response.error?.message || 'Failed to create adjustment');
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
            <h1 className="text-3xl font-bold text-slate-900">Stock Adjustments</h1>
            <p className="text-slate-600 mt-1">Fix discrepancies between recorded and physical stock</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg"
          >
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

        {/* Create Adjustment Modal */}
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Create Stock Adjustment</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    This will immediately update stock levels. Make sure you have physically counted the inventory before proceeding.
                  </p>
                </div>

                {createError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {createError}
                  </div>
                )}

                <form onSubmit={handleCreateAdjustment} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Product</label>
                      <select
                        value={createFormData.productId}
                        onChange={(e) => setCreateFormData({ ...createFormData, productId: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-red-600"
                      >
                        <option value="">Select product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Warehouse</label>
                      <select
                        value={createFormData.warehouseId}
                        onChange={(e) => setCreateFormData({ ...createFormData, warehouseId: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-red-600"
                      >
                        <option value="">Select warehouse</option>
                        {warehouses.map((warehouse) => (
                          <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Counted Quantity (Physical Count)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter the actual counted quantity"
                      value={createFormData.countedQuantity}
                      onChange={(e) => setCreateFormData({ ...createFormData, countedQuantity: e.target.value })}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-red-600"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      The system will calculate the difference from recorded quantity automatically
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Reason for Adjustment</label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Physical count discrepancy, Damaged goods, Theft, etc."
                      value={createFormData.reason}
                      onChange={(e) => setCreateFormData({ ...createFormData, reason: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-red-600"
                    ></textarea>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Adjustment Date</label>
                    <input
                      type="date"
                      value={createFormData.adjustmentDate}
                      onChange={(e) => setCreateFormData({ ...createFormData, adjustmentDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      disabled={createLoading}
                      className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createLoading}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createLoading ? 'Creating...' : 'Create Adjustment'}
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
