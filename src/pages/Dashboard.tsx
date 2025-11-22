import { motion } from 'framer-motion';
import { Package, AlertTriangle, TruckIcon, Send, ArrowLeftRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { dashboardAPI } from '../lib/api';

interface Operation {
  id: string;
  type: 'Receipt' | 'Delivery' | 'Transfer' | 'Adjustment';
  products: string;
  source: string;
  destination: string;
  status: 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled';
  date: string;
}

export default function Dashboard() {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [kpis, setKpis] = useState<any>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kpisRes, opsRes] = await Promise.all([
        dashboardAPI.getKPIs(),
        dashboardAPI.getOperations(20)
      ]);

      if (kpisRes.success && kpisRes.data) {
        setKpis(kpisRes.data);
      }

      if (opsRes.success && opsRes.data) {
        setOperations(opsRes.data as Operation[]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpiData = kpis ? [
    { title: 'Total Products', value: kpis.totalProducts.toString(), icon: Package, color: 'from-blue-500 to-blue-600' },
    { title: 'Low Stock Items', value: kpis.lowStockItems.toString(), subValue: `${kpis.outOfStockItems} Out of Stock`, icon: AlertTriangle, color: 'from-red-500 to-red-600' },
    { title: 'Pending Receipts', value: kpis.pendingReceipts.toString(), icon: TruckIcon, color: 'from-green-500 to-green-600' },
    { title: 'Pending Deliveries', value: kpis.pendingDeliveries.toString(), icon: Send, color: 'from-purple-500 to-purple-600' },
    { title: 'Internal Transfers', value: kpis.internalTransfers.toString(), icon: ArrowLeftRight, color: 'from-orange-500 to-orange-600' },
  ] : [];

  const getStatusColor = (status: string) => {
    const colors = {
      Draft: 'bg-gray-800 text-gray-300',
      Waiting: 'bg-yellow-900/30 text-yellow-400',
      Ready: 'bg-blue-900/30 text-blue-400',
      Done: 'bg-green-900/30 text-green-400',
      Canceled: 'bg-red-900/30 text-red-400',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-800 text-gray-300';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      Receipt: 'bg-green-900/30 text-green-400 border-green-800',
      Delivery: 'bg-purple-900/30 text-purple-400 border-purple-800',
      Transfer: 'bg-orange-900/30 text-orange-400 border-orange-800',
      Adjustment: 'bg-red-900/30 text-red-400 border-red-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-800 text-gray-300 border-gray-800';
  };

  const filteredOperations = operations.filter(op => {
    const typeMatch = filterType === 'All' || op.type === filterType;
    const statusMatch = filterStatus === 'All' || op.status === filterStatus;
    return typeMatch && statusMatch;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-400">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#252525] border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <kpi.icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-sm text-gray-400 mb-1">{kpi.title}</h3>
              <p className="text-3xl font-bold text-white">{kpi.value}</p>
              {kpi.subValue && (
                <p className="text-xs text-red-400 mt-1">{kpi.subValue}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#252525] border border-gray-800 rounded-2xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Document Type</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Receipt', 'Delivery', 'Transfer', 'Adjustment'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterType === type
                        ? 'bg-[#FF8C00] text-white shadow-lg shadow-[#FF8C00]/30'
                        : 'bg-[#1F1F1F] text-gray-300 hover:bg-[#2A2A2A] border border-gray-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Draft', 'Waiting', 'Ready', 'Done', 'Canceled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterStatus === status
                        ? 'bg-[#FF8C00] text-white shadow-lg shadow-[#FF8C00]/30'
                        : 'bg-[#1F1F1F] text-gray-300 hover:bg-[#2A2A2A] border border-gray-800'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Operations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#252525] border border-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">Recent Operations</h3>
            <p className="text-sm text-gray-400 mt-1">
              Showing {filteredOperations.length} of {operations.length} operations
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1F1F1F]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Document ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Destination</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOperations.map((op, index) => (
                  <motion.tr
                    key={op.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[#2A2A2A] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">{op.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(op.type)}`}>
                        {op.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{op.products}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{op.source}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{op.destination}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(op.status)}`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{op.date}</td>
                    <td className="px-6 py-4">
                      <button className="text-[#FF8C00] hover:text-[#FF9500] text-sm font-medium">
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
