import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Warehouse, MapPin, X, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { warehousesAPI } from '../lib/api';

export default function Settings() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any | null>(null);
  const [warehouseFormData, setWarehouseFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    status: 'Active'
  });
  const [warehouseError, setWarehouseError] = useState('');
  const [warehouseLoading, setWarehouseLoading] = useState(false);

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

  const handleOpenWarehouseModal = (warehouse?: any) => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setWarehouseFormData({
        name: warehouse.name || '',
        location: warehouse.location || '',
        capacity: warehouse.capacity || '',
        status: warehouse.status || 'Active'
      });
    } else {
      setEditingWarehouse(null);
      setWarehouseFormData({
        name: '',
        location: '',
        capacity: '',
        status: 'Active'
      });
    }
    setWarehouseError('');
    setShowWarehouseModal(true);
  };

  const handleSaveWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    setWarehouseError('');
    setWarehouseLoading(true);

    try {
      let response;
      if (editingWarehouse) {
        response = await warehousesAPI.update(editingWarehouse.id, {
          name: warehouseFormData.name,
          location: warehouseFormData.location,
          capacity: warehouseFormData.capacity,
          status: warehouseFormData.status
        });
      } else {
        response = await warehousesAPI.create({
          name: warehouseFormData.name,
          location: warehouseFormData.location,
          capacity: warehouseFormData.capacity,
          status: warehouseFormData.status
        });
      }

      if (response.success) {
        setShowWarehouseModal(false);
        setEditingWarehouse(null);
        setWarehouseFormData({
          name: '',
          location: '',
          capacity: '',
          status: 'Active'
        });
        fetchWarehouses();
      } else {
        setWarehouseError(response.error?.message || 'Failed to save warehouse');
      }
    } catch (error: any) {
      setWarehouseError(error.message || 'An error occurred');
    } finally {
      setWarehouseLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">Manage warehouses and system configuration</p>
          </div>
          <button 
            onClick={() => handleOpenWarehouseModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] shadow-lg"
          >
            <Plus size={20} />
            Add Warehouse
          </button>
        </div>

        <div className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Warehouse Management</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading warehouses...</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warehouses.map((wh) => (
              <div key={wh.id} className="bg-[#1F1F1F] border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-900/30 rounded-xl flex items-center justify-center">
                    <Warehouse className="text-indigo-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{wh.name}</h3>
                    <p className="text-xs text-gray-400">{wh.id}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={16} />
                    <span>{wh.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capacity:</span>
                    <span className="font-medium text-white">{wh.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium">
                      {wh.status}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenWarehouseModal(wh)}
                  className="w-full mt-4 px-4 py-2 border border-gray-800 rounded-lg hover:bg-[#2A2A2A] text-sm font-medium text-gray-300"
                >
                  <Edit size={16} className="inline mr-2" />
                  Edit Warehouse
                </button>
              </div>
            ))}
          </div>
          )}
        </div>

        <div className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">System Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-800 rounded-xl">
              <div>
                <p className="font-medium text-white">Low Stock Alerts</p>
                <p className="text-sm text-gray-400">Get notified when products reach reorder level</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C00]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-800 rounded-xl">
              <div>
                <p className="font-medium text-white">Auto-validate Receipts</p>
                <p className="text-sm text-gray-400">Automatically validate receipts on creation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C00]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Add/Edit Warehouse Modal */}
        <AnimatePresence>
          {showWarehouseModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
              onClick={() => setShowWarehouseModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-[#252525] border border-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}
                  </h2>
                  <button 
                    onClick={() => setShowWarehouseModal(false)} 
                    className="p-2 hover:bg-[#2A2A2A] rounded-lg text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                {warehouseError && (
                  <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-xl mb-4">
                    {warehouseError}
                  </div>
                )}

                <form onSubmit={handleSaveWarehouse} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Warehouse Name</label>
                    <input
                      type="text"
                      placeholder="Enter warehouse name"
                      value={warehouseFormData.name}
                      onChange={(e) => setWarehouseFormData({ ...warehouseFormData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="text"
                        placeholder="Enter location"
                        value={warehouseFormData.location}
                        onChange={(e) => setWarehouseFormData({ ...warehouseFormData, location: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Capacity</label>
                    <input
                      type="text"
                      placeholder="Enter capacity"
                      value={warehouseFormData.capacity}
                      onChange={(e) => setWarehouseFormData({ ...warehouseFormData, capacity: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Status</label>
                    <select
                      value={warehouseFormData.status}
                      onChange={(e) => setWarehouseFormData({ ...warehouseFormData, status: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white"
                    >
                      <option value="Active" className="bg-[#252525]">Active</option>
                      <option value="Inactive" className="bg-[#252525]">Inactive</option>
                      <option value="Maintenance" className="bg-[#252525]">Maintenance</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowWarehouseModal(false)}
                      disabled={warehouseLoading}
                      className="flex-1 px-6 py-3 border border-gray-800 rounded-xl hover:bg-[#2A2A2A] disabled:opacity-50 text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={warehouseLoading}
                      className="flex-1 px-6 py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {warehouseLoading ? 'Saving...' : editingWarehouse ? 'Update Warehouse' : 'Create Warehouse'}
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
